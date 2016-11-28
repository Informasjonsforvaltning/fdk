var filterElement = document.getElementById("filter");
var themeFacetElement = document.getElementById("facet.theme");
var themeMap = {};

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

function createFilterElement(name) {
    var filter = $("#filter").append('<a href="#" class="label label-default">' + name + ' <span class="glyphicon glyphicon-remove"/></a>');
    // add delete hook
    
}

function removeFilterElement(name) {
    var f = $("#filter").children("a:contains(" + name +")")[0];

    filterElement.removeChild(f);
}

function createBadge(count) {
    return "<span class='badge'>" + count + "</span>";
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
            themeElem.className = "list-group-item";
            themeElem.innerHTML = themeMap[item.key] + " " + createBadge(item.doc_count);
            themeElem.onclick = function (event) {
                event.preventDefault();
                console.log(this);
                // select/unselect theme
                if (this.className.indexOf("active") > 0) {
                    // show no longer active
                    this.className = "list-group-item";
                    // remove if exist in filter line
                    removeFilterElement(themeMap[item.key]);
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
    if (result.aggregations) {
        facetThemeController(result.aggregations.theme_count);

    }

}