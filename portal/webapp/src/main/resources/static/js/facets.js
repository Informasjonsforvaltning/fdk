var filterElement = document.getElementById("filter");
var facetDefaultCount = 6;

var themeMap = {}; // contains codes and corresponding theme titles

/**
* returns the title of the theme code
*/
function getTheme(code) {
    if (code) {
        var title = themeMap[code];
        if (title) {
            return title[filters.theme.language];
        } else {
            return undefined;
        }
    }
}

function getPublisher(code) {
    return code;
}


var filters = {
    "publisher": {
        facet: document.getElementById("facet.publisher"),
        active: [], // contains active filters
        hideMany: true,
        label: "label-primary",
        getName: getPublisher
    },
    "theme": {
        facet: document.getElementById("facet.theme"),
        active: [], // contains active filters
        hideMany : true,
        language : "nb",
        label: "label-default",
        getName: getTheme
    }
};


/**
* Sets the theme filter code to be used by the query
* This is later used by themeFacetController to add filter and highlight facets
*/
function setThemeFilter(code) {
    if (filters.theme.active.indexOf(code) === -1) {
        filters.theme.active.push(code);
    }
}

/**
* Sets the publisher filter code to be used by the query
* This is later used by themeFacetController to add filter and highlight facets
*/
function setPublisherFilter(code) {
    if (filters.publisher.active.indexOf(code) === -1) {
        filters.publisher.active.push(code);
    }
}

/**
* Identifies and removes a filter element with the corresponding data attribute
*/
function removeFilterElement(data) {
    /*
    var f = $("#filter").find("a[data='" + data +"']")[0];
    if (f) {
        filterElement.removeChild(f);
    }*/
}

/**
* Creates a filter element.
*
* @filter the filter to remove
* @data the data identifier to find the facet
*/
function createFilterElement(filter, data) {
    /*
    // check if filter already exists
    var f = $('#filter').find('a[data="'+data+'"]')[0];

    if (f === undefined) {
        var filterLabel = $('<a href="#" class="label '+ filter.label +'" data="'+data+'">' + filter.getName(data) + ' <span class="glyphicon glyphicon-remove"/></a> ')[0];
        $("#filter").append(filterLabel);

        // add delete hook
        filterLabel.onclick = function (event) {
            event.preventDefault();

            removeFilter(this.getAttribute("data"),filter.active);
        };
    }*/
}



/**
* Changes class on facet with corresponding data attribute to non active
*/
function deactivateFacet(data) {
    if (data) {
        var element = $('.list-group-item[data="'+data+'"]')[0];
        if (element) {
            element.className = 'list-group-item';
        }
    }
}

/**
* adds a filter.
*
* 1) creates filter element
* 2) add code to active filter array
* 3) executes new search
*/
function addFilter(filter, code) {
    if (filter && code) {
        createFilterElement(filter, code);
        filter.active.push(code);

        resetResultCursor();
        doSearch();
    }
}


/**
* Removes a filter.
* 1) remove filter element
* 2) deactivate facet
* 3) remove code from theme filter array
*/
function removeFilter(code, filterArray) {
    if (code && filterArray.indexOf(code) > -1) {

        removeFilterElement(code);

        deactivateFacet(code);

        var index = filterArray.indexOf(code);
        filterArray.splice(index,1);

        // Execute search
        resetResultCursor();
        doSearch();
    }
}



/**
* If themeMap is empty fetch themes from codeList and update the themeMap
*
*/
function createThemeMap() {
    if (Object.keys(themeMap).length === 0) {
        if (typeof codeList !== 'undefined') {
            var res = codeList["data-themes"];
            res.hits.hits.forEach(function (theme) {
                var code = theme._source.code;

                var title = {
                    "nb": theme._source.title.nb,
                    "en": theme._source.title.en
                };
                themeMap[code] = title;
            });
        } else {
            throw new Error("Codelist 'data-themes' is not defined");
        }
    }
}



function createBadge(count) {
    return "<span class='fdk-badge'>(<span class='fdk-count'>" + count + "</span>)</span>";
}


// removes all facet information
function resetFacets() {
    var facets = [ filters.theme.facet, filters.publisher.facet ];

    facets.forEach(function (facet) {
        var ul = facet.getElementsByTagName("ul")[0];
        while (ul.firstChild) {
            ul.removeChild(ul.firstChild);
        }
    });
}

/**
* Returns toggle text for the three langauages supported.
*/
function getToggleText(filter) {
    var result = "";
    if (pageLanguage === "nb") {
        result = filter.hideMany ? "Mer" : "Mindre";
    } else if (pageLanguage === "nn") {
        result = filter.hideMany ? "Meir" : "Mindre";
    } else {
       result = filter.hideMany ? "More" : "Less";
    }

    return result;
}

function toggleFacets(ulElement, hideMany) {
    if (ulElement) {
        var counter = 0;
        var children = $(ulElement).children("a.list-group-item"); // .children; //).find("a"); //$(ulElement).getChildren().getElementsByTagName("a");
        for (var i = 0; i < children.length; i++) {
            if (counter > facetDefaultCount -1) {
                var element = children[i];

                if (!hideMany) {
                    $(element).removeClass("hidden");
                } else {
                    $(element).addClass("hidden");
                }
            }
            counter ++;
        }
    }
}


/**
* Creates a Facet Controller for a specific filter facet.
*
* @filter the filter to create facet controller for
* @aggregation the aggregation data to show in the facet
*/
function createFacetController(filter, aggregation) {

    if (aggregation && aggregation.buckets) {

        var ul = filter.facet.getElementsByTagName("ul")[0];

        // if filter array already has active filters make sure they are created
        filter.active.forEach(function (code) {
            createFilterElement(filter, code);
        });

        var counter = 0;
        // for each theme found in dataset
        aggregation.buckets.forEach(function (item){

            var elem = document.createElement("a");

            // data contains the code to the theme
            elem.setAttribute("data", item.key);
            elem.setAttribute("href", "#");

            if (filter.active.indexOf(item.key) > -1) {
                elem.className = "list-group-item fdk-label fdk-label-default active"; //list-group-item active";
            } else {
                elem.className = "list-group-item fdk-label fdk-label-default"; //"list-group-item";
            }
            if (filter.hideMany && counter > facetDefaultCount - 1) {
                elem.className += " hidden";
            }
            elem.innerHTML = filter.getName(item.key) + " " + createBadge(item.doc_count);
            elem.onclick = function (event) {
                event.preventDefault();
                event.stopPropagation();

                // select/unselect theme
                if (this.className.indexOf("active") > -1) {
                    // show no longer active
                    this.className = "fdk-label fdk-label-default";
                    // remove if exist in filter line
                    removeFilter(this.getAttribute("data"),filter.active);
                } else {
                    // show active
                    this.className = "list-group-item fdk-label fdk-label-default active";
                    // add filter line
                    addFilter(filter, this.getAttribute("data"));
                }

            };

            counter++;

            ul.appendChild(elem);
        });
        if (counter > facetDefaultCount) {
            // more/less toggle
            var toggleElement = document.createElement("a");
            toggleElement.className = "btn btn-outline-secondary btn-sm";
            var numberOfHiddenElements = counter - facetDefaultCount;
            if (filter.hideMany) {
                toggleElement.innerHTML = numberOfHiddenElements + " " + getToggleText(filter);
            } else {
                toggleElement.innerHTML = getToggleText(filter);
            }
            toggleElement.onclick = function (event) {
                event.preventDefault();
                event.stopPropagation();

                filter.hideMany = !filter.hideMany;
                this.innerHTML = getToggleText(filter);
                toggleFacets(this.parentElement,filter.hideMany);
            };

            ul.appendChild(toggleElement);
        }
    }

}


/**
* Sets up the facet controller. Calls the individual facets
*/
function facetController(result) {
    // themes only come in two languages
    if (pageLanguage === "en") {
        filters.theme.language = "en";
    } else {
        filters.theme.language = "nb";
    }
    if (typeof result !== 'undefined') {
        createThemeMap();

        resetFacets();
        // build facets
        if (result.aggregations) {
           // facetThemeController(result.aggregations.theme_count);
            createFacetController(filters.theme, result.aggregations.theme_count);
            createFacetController(filters.publisher, result.aggregations.publisherCount);
        }
    } else {
        throw new Error("FacetController bad input " + result);
    }
}

$('.collapse').on('shown.bs.collapse', function(){
    $(this).parent().find(".glyphicon-triangle-left").removeClass("glyphicon-triangle-left").addClass("glyphicon-triangle-bottom");
}).on('hidden.bs.collapse', function(){
    $(this).parent().find(".glyphicon-triangle-bottom").removeClass("glyphicon-triangle-bottom").addClass("glyphicon-triangle-left");
});