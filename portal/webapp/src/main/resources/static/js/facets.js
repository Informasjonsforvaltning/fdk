var filterElement = document.getElementById("filter");
var themeFacetElement = document.getElementById("facet.theme");
var themeFilter = []; // contains theme codes that dataset should be filtered upon
var themeMap = {}; // contains codes and corresponding theme titles
var themeLanguage = "nb";

/**
* Sets the theme filter code to be used by the query
* This is later used by themeFacetController to add filter and highlight facets
*/
function setThemeFilter(code) {
    if (themeFilter.indexOf(code) === -1) {
        themeFilter.push(code);
    }
}
/**
* adds a code to the theme filter.
* 1) creates filter element
* 2) add code to filter array
*/

function addThemeFilter(code) {
    if (code && themeFilter.indexOf(code) === -1) {
        createFilterElement(code,getTheme(code),'label-default');
        themeFilter.push(code);

        // Execute search
        resetResultCursor();
        doSearch();
    }
}

/**
* Removes a code from the theme filter.
* 1) remove filter element
* 2) deactivate facet
* 3) remove code from theme filter array
*/
function removeThemeFilter(code) {
    if (code && themeFilter.indexOf(code) > -1) {

        removeFilterElement(code);

        deactivateFacet(code);

        var index = themeFilter.indexOf(code);
        themeFilter.splice(index,1);

        // Execute search
        resetResultCursor();
        doSearch();
    }
}

/**
* returns the title of the theme code
*/
function getTheme(code) {
    if (code) {
        var title = themeMap[code];
        if (title) {
            return title[themeLanguage];
        } else {
            return undefined;
        }
    }
}


/**
* If themeMap is empty fetch themes from codeList and update the themeMap
*
*/
function createThemeMap() {
    if (Object.keys(themeMap).length === 0) {
        var res = codeList["data-themes"];
        res.hits.hits.forEach(function (theme) {
            var code = theme._source.code;

            var title = {
                "nb": theme._source.title.nb,
                "en": theme._source.title.en
            };
            themeMap[code] = title;
        });
    }
}

/**
*
* @data the data identifier to find the facet
* @name the name to show in filter label
* @label the bootstrap-label type for the label: default-label, ...
*/
function createFilterElement(data, name, label) {
    // check if filter already exists
    var f = $('#filter').find('a[data="'+data+'"]')[0];

    if (f === undefined) {
        var filterLabel = $(' <a href="#" class="label '+ label +'" data="'+data+'">' + name + ' <span class="glyphicon glyphicon-remove"/></a>')[0];
        $("#filter").append(filterLabel);

        // add delete hook
        filterLabel.onclick = function (event) {
            event.preventDefault();

            removeThemeFilter(this.getAttribute("data"));
        };
    }
}

function removeFilterElement(name) {
    var f = $("#filter").find("a[data='" + name +"']")[0];
    if (f) {
        filterElement.removeChild(f);
    }
}

function createBadge(count) {
    return "<span class='badge'>" + count + "</span>";
}

function deactivateFacet(data) {

    var element = $('.list-group-item[data="'+data+'"]')[0];
    element.className = 'list-group-item';
}

/**
* Sets up the theme Facet
*/
function facetThemeController(theme) {

    if (theme && theme.buckets) {

        themeFilter.forEach(function (code) {
            createFilterElement(code, getTheme(code), 'label-default');
        });

        var ul = themeFacetElement.getElementsByTagName("ul")[0];

        // for each theme found in dataset
        theme.buckets.forEach(function (item){

            var themeElem = document.createElement("a");

            // data contains the code to the theme
            themeElem.setAttribute("data", item.key);

            if (themeFilter.indexOf(item.key) > -1) {
                themeElem.className = "list-group-item active";
            } else {
                themeElem.className = "list-group-item";
            }
            themeElem.innerHTML = getTheme(item.key) + " " + createBadge(item.doc_count);
            themeElem.onclick = function (event) {
                event.preventDefault();

                // select/unselect theme
                if (this.className.indexOf("active") > -1) {
                    // show no longer active
                    this.className = "list-group-item";
                    // remove if exist in filter line
                    removeThemeFilter(this.getAttribute("data"));
                } else {
                    // show active
                    this.className = "list-group-item active";
                    // add filter line
                    addThemeFilter(this.getAttribute("data"));
                }

            };

            ul.appendChild(themeElem);
        });
    }

}

// removes facet information
function resetFacets() {
    var facets = [ themeFacetElement ];

    facets.forEach(function (facet) {
        var ul = facet.getElementsByTagName("ul")[0];
        while (ul.firstChild) {
            ul.removeChild(ul.firstChild);
        }
    });
}

/**
* Sets up the facet controller. Calls the individual facets
*/
function facetController(result) {
    // themes only come in two languages
    if (pageLanguage === "en") {
        themeLanguage = "en";
    } else {
        themeLanguage = "nb";
    }
    createThemeMap();

    resetFacets();
    // build facets
    if (result.aggregations) {
        facetThemeController(result.aggregations.theme_count);
    }
}