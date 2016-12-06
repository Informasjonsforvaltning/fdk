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
* Identifies and removes a filter element with the corresponding data attribute
*/
function removeFilterElement(name) {
    var f = $("#filter").find("a[data='" + name +"']")[0];
    if (f) {
        filterElement.removeChild(f);
    }
}

/**
* @filter the filter to remove
* @data the data identifier to find the facet
*/
function createFilterElement(filter, data) {
    // check if filter already exists
    var f = $('#filter').find('a[data="'+data+'"]')[0];

    if (f === undefined) {
        var filterLabel = $('<a href="#" class="label '+ filter.label +'" data="'+data+'">' + filter.getName(data) + ' <span class="glyphicon glyphicon-remove"/></a> ')[0];
        //$("#filter").append(document.createTextNode(" "));
        $("#filter").append(filterLabel);

        // add delete hook
        filterLabel.onclick = function (event) {
            event.preventDefault();

            removeFilter(this.getAttribute("data"),filter.active);
        };
    }
}

/**
* adds a code to the filter.
* 1) creates filter element
* 2) add code to filter array
*/
function addThemeFilter(code) {
    if (code && filters.theme.active.indexOf(code) === -1) {
        createFilterElement(filters.theme, code);
        filters.theme.active.push(code);

        // Execute search
        resetResultCursor();
        doSearch();
    }
}

/**
* adds a code to the filter.
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
    return "<span class='badge'>" + count + "</span>";
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
            if (counter > facetDefaultCount) {
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
* Sets up the theme Facet
*/
function facetThemeController(theme) {

    if (theme && theme.buckets) {

        filters.theme.active.forEach(function (code) {
            createFilterElement(filters.theme, code);
        });

        var ul = filters.theme.facet.getElementsByTagName("ul")[0];

        var themeCounter = 0;
        // for each theme found in dataset
        theme.buckets.forEach(function (item){

            var themeElem = document.createElement("a");
            themeCounter++;
            // data contains the code to the theme
            themeElem.setAttribute("data", item.key);
            themeElem.setAttribute("href", "#");

            if (filters.theme.active.indexOf(item.key) > -1) {
                themeElem.className = "list-group-item active";
            } else {
                themeElem.className = "list-group-item";
            }
            if (filters.theme.hideMany && themeCounter > facetDefaultCount) {
                themeElem.className += " hidden";
            }
            themeElem.innerHTML = getTheme(item.key) + " " + createBadge(item.doc_count);
            themeElem.onclick = function (event) {
                event.preventDefault();
                event.stopPropagation();

                // select/unselect theme
                if (this.className.indexOf("active") > -1) {
                    // show no longer active
                    this.className = "list-group-item";
                    // remove if exist in filter line
                    removeFilter(this.getAttribute("data"), filters.theme.active);
                } else {
                    // show active
                    this.className = "list-group-item active";
                    // add filter line
                    addThemeFilter(this.getAttribute("data"));
                }

            };

            ul.appendChild(themeElem);
        });
        if (themeCounter > facetDefaultCount) {
            // more/less toggle
            var toggleElement = document.createElement("a");
            toggleElement.className = "btn btn-outline-secondary btn-sm";
            toggleElement.innerHTML = getToggleText(filters.theme);
            toggleElement.onclick = function (event) {
                event.preventDefault();
                event.stopPropagation();

                filters.theme.hideMany = !filters.theme.hideMany;
                this.innerHTML = getToggleText(filter);
                toggleFacets(this.parentElement,filters.theme.hideMany);
                //resetFacets();
                //facetThemeController(themeData);
            };

            ul.appendChild(toggleElement);
        }
    }

}


/**
* Sets up the theme Facet
*/
function createFacetController(filter, aggregation) {

    if (aggregation && aggregation.buckets) {

        var ul = filter.facet.getElementsByTagName("ul")[0];

       // filter.active.forEach(function (code) {
        //    createFilterElement(code, getTheme(code), 'label-default');
        //});

        var counter = 0;
        // for each theme found in dataset
        aggregation.buckets.forEach(function (item){

            var elem = document.createElement("a");
            counter++;
            // data contains the code to the theme
            elem.setAttribute("data", item.key);
            elem.setAttribute("href", "#");

            if (filters.publisher.active.indexOf(item.key) > -1) {
                elem.className = "list-group-item active";
            } else {
                elem.className = "list-group-item";
            }
            if (filters.publisher.hideMany && counter > facetDefaultCount) {
                elem.className += " hidden";
            }
            elem.innerHTML = item.key + " " + createBadge(item.doc_count);
            elem.onclick = function (event) {
                event.preventDefault();
                event.stopPropagation();

                // select/unselect theme
                if (this.className.indexOf("active") > -1) {
                    // show no longer active
                    this.className = "list-group-item";
                    // remove if exist in filter line
                    removeFilter(this.getAttribute("data"),filter.active);
                } else {
                    // show active
                    this.className = "list-group-item active";
                    // add filter line
                    addFilter(filter, this.getAttribute("data"));
                }

            };

            ul.appendChild(elem);
        });
        if (counter > facetDefaultCount) {
            // more/less toggle
            var toggleElement = document.createElement("a");
            toggleElement.className = "btn btn-outline-secondary btn-sm";
            toggleElement.innerHTML = getToggleText(filter);
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
            facetThemeController(result.aggregations.theme_count);
            createFacetController(filters.publisher, result.aggregations.publisherCount);
        }
    } else {
        throw new Error("FacetController bad input " + result);
    }
}