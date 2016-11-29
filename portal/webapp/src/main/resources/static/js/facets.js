var filterElement = document.getElementById("filter");
var themeFacetElement = document.getElementById("facet.theme");
var themeFilter = []; // contains theme codes that dataset should be filtered upon
var themeMap = {}; // contains code and theme description object


/**
* Sets the theme filter code to be used by the query
*/
function setThemeFilter(code) {
    if (themeFilter.indexOf(code) === -1) {
        themeFilter.push(code);
    }
}

function removeThemeFilter(code) {
    if (code) {

        removeFilterElement(themeMap[code]);

    ]
}


function createThemeMap(hits) {
    if (hits && hits.hits) {

        hits.hits.forEach(function (dataset) {
            if (dataset._source.theme) {
                dataset._source.theme.forEach(function (theme) {
                    themeMap[theme.code] = theme.title["nb"];
                });
            }
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
    var filter = $("#filter").append(' <a href="#" class="label '+ label +' data="'+data+'">' + name + ' <span class="glyphicon glyphicon-remove"/></a>');
    console.log(filter);
    // add delete hook
    filter.onclick = function (event) {
        event.preventDefault();

        deactivate(this.data);
        var p = this.parentElement;
        p.removeChild(this);
    }
}

function removeFilterElement(name) {
    var f = $("#filter").children("a:contains(" + name +")")[0];
    if (f) {
        filterElement.removeChild(f);
    }
}

function showFilters() {
    themeFilter.forEach(function (code) {
        createFilterElement(code, themeMap[code], 'label-default');
    });
}

function createBadge(count) {
    return "<span class='badge'>" + count + "</span>";
}

function deactivate(data) {
    var element = $('.ul[data='+data+']');
    console.log (element);

}

/**
* Sets up the theme Facet
*/
function facetThemeController(theme) {

    if (theme && theme.buckets) {
        var themeTotal = document.getElementById("facet.theme.total");
        var ul = themeFacetElement.getElementsByTagName("ul")[0];
        var ttotal = 0;

        // for each theme found in dataset
        theme.buckets.forEach(function (item){
            console.log(item);

            var themeElem = document.createElement("a");
            a.data = item.key;
            if (themeFilter.indexOf(item.key) > -1) {
                themeElem.className = "list-group-item active";
            } else {
                themeElem.className = "list-group-item";
            }
            themeElem.innerHTML = themeMap[item.key] + " " + createBadge(item.doc_count);
            themeElem.onclick = function (event) {
                event.preventDefault();
                console.log(this);
                // select/unselect theme
                if (this.className.indexOf("active") > 0) {
                    // show no longer active
                    this.className = "list-group-item";
                    // remove if exist in filter line
                    removeThemeFilter(item.key);
                } else {
                    // show active
                    this.className = "list-group-item active";
                    // add filter line
                    createFilterElement(themeMap[item.key]);
                }

            };

            ttotal += item.doc_count;

            ul.appendChild(themeElem);
        });

        themeTotal.innerHTML = ttotal;
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

    console.log(result.aggregations);
    createThemeMap(result.hits);
    resetFacets();
    showFilters();
    if (result.aggregations) {
        facetThemeController(result.aggregations.theme_count);

    }

}