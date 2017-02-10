var languages = [ "nb", "nn", "en", "sv", "dk", "de", "fr", "es", "pl", "ru" ];
var pageLanguage = lang;
var sortField = queryParameterSortfield;
var sortDirection = "asc";
var resultCursor = {
    currentPage: 0,
    sectionStart: 1,
    from: 0,
    size: 10
    };
var total = 0;
var searchUrl = "http://dcat.no/unknown";

function resetResultCursor() {
    resultCursor.currentPage = 0;
    resultCursor.sectionStart = 1;
    resultCursor.from = 0;
    //resultCursor.size = 10;
}

function httpGetAsync(theUrl, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState === 4 && xmlHttp.status === 200)
            callback(xmlHttp.responseText);
    };
    xmlHttp.open("GET", theUrl, true); // true for asynchronous
    xmlHttp.send(null);
}

// Returns the string from the language tagged literal,
// literal - object with language keys { "nb": "Norsk", "en": "English", ...
function getLanguageString(literal) {
    var result = { "value": undefined, "language": "?"};

    // test if argument is undefined
    if (!literal)
        return undefined;

    // test if it is the empty object
    if (Object.keys(literal).length === 0 && literal.constructor === Object)
        return undefined;

    // get string from pageLanguage
    var string = literal[pageLanguage];

    // literal does not contain the default pageLanguage key
    if (string === undefined) {
        var l = 0;
        // Check expected language keys
        while (l < languages.length && string === undefined) {
            string = literal[ languages[l] ];
            if (string !== undefined) {
                result.value = string;
                result.language = languages[l];

                return result;
            }
            l++;
        }
        // Handle unexpected language keys (select first in list)
        if (result.value === undefined) {
            for (var k in literal) {
                if (literal[k]) {
                    result.value = literal[k];
                    result.language = k;

                    return result;
                }
            }
        }
    } else { // default language values found
        result.value = string;
        result.language = pageLanguage;
    }

    return result;
}


/*
 Creates the page navigation controller
 for 5 pages, page 1 active: << *1* 2 3 4 5 >>
 for 6 pages, page 3 active: << 1 .. *3* 4 5 6 >>
 for 100 pages, page 1 active : << *1* 2 3 4 .. 100 >>
 for 100 pages, page 50 active: << 1 .. 49 *50* 51 .. 100 >>
 for 100 pages, page 89 active: << 1 .. 97 *98* 99 100 >>

 ... &hellip;
*/
function paginationController () {

    var setup = {
        numPagesInSection: 3,
        manySymbol: "&#x22ef;"
    };
    // compute the number of pages available in the search
    var numPages = Math.ceil(total / resultCursor.size);

    // if filters are in play, we need to reset page cursor
    if (resultCursor.currentPage >= numPages) {
        resetResultCursor();
    }

    if (queryParameterFrom > 0) {
        resultCursor.from = queryParameterFrom;
        if (resultCursor.from < 0) resultCursor.from = 0;
        resultCursor.currentPage = Math.ceil(resultCursor.from / resultCursor.size);
        resultCursor.sectionStart = resultCursor.currentPage - 1 ;
        if (resultCursor.sectionStart < 1) resultCursor.sectionStart = 1;
    }

    // empty pager list
    $('.pager').empty();

    // helper to create elipse element ...
    function createListElement(pageSymbol) {
      var element = $('<li><a href="#">'+ pageSymbol +'</a></li>');
      return element;
    }
    // helper function to create page number element (2)
    function createPageElement(page) {
        var pageNumber = page + 1;
        var pageElement = createListElement(pageNumber)[0];
        if (resultCursor.currentPage === page) pageElement.className = "active page";
        else pageElement.className = "page";

        pageElement.onclick = function(e){
            e.preventDefault();
            var clickedPage = parseInt(e.target.innerHTML) - 1;
            goTo(clickedPage);
        };

        return pageElement;
    }

    if (total === 0) {
        $('.pager li').remove();
    } else {

        // PREV element
        var prevElement = createListElement('&laquo;')[0];
        prevElement.id = "prev";
        prevElement.onclick = function (e) {
            e.preventDefault();
            if (resultCursor.currentPage > 0) {
                 resultCursor.currentPage -- ;
                 if (resultCursor.currentPage < resultCursor.sectionStart && resultCursor.sectionStart > 1)
                     resultCursor.sectionStart --;
                 else if (resultCursor.sectionStart + setup.numPagesInSection <= resultCursor.currentPage )
                     resultCursor.sectionStart = resultCursor.currentPage - setup.numPagesInSection + 1;
                 goTo(resultCursor.currentPage);
                }
            };
        $('.pager').append(prevElement);

        // first element
        $('.pager').append(createPageElement(0));

        // .. if larger than 2
        if (resultCursor.sectionStart > 1) {
            var dotElement = createListElement(setup.manySymbol);
            dotElement[0].className = "disabled";
            $('.pager').append(dotElement);
        }

        for (var i = 0; i < setup.numPagesInSection; i++) {
            var curr = resultCursor.sectionStart + i;
            if (curr < numPages) {
                $('.pager').append(createPageElement(curr));
            }
        }

        // .. if last of section is < numPages -1
        if (resultCursor.sectionStart + setup.numPagesInSection < numPages - 1) {
            var dotElement2 = createListElement(setup.manySymbol)[0];
            dotElement2.className = "disabled";
            $('.pager').append(dotElement2);
        }

        // last element
        if (resultCursor.sectionStart + setup.numPagesInSection < numPages )
            $('.pager').append(createPageElement(numPages - 1));

        // NEXT element
        var nextElement = createListElement('&raquo;')[0];
        nextElement.id = "next";
        nextElement.onclick = function (e) {
             e.preventDefault();
             if (resultCursor.currentPage < numPages - 1) {
                resultCursor.currentPage ++;
                if ((resultCursor.currentPage >= resultCursor.sectionStart + setup.numPagesInSection) && (resultCursor.sectionStart + setup.numPagesInSection -1 < numPages - setup.numPagesInSection + 1))
                    resultCursor.sectionStart ++;
                else if (resultCursor.sectionStart > resultCursor.currentPage )
                     resultCursor.sectionStart = resultCursor.currentPage ;
                goTo(resultCursor.currentPage);
             }
        };
        $('.pager').append(nextElement);
    }
}

// Results
function showResults(searchResult) {

    var res = JSON.parse(searchResult);

    var results = document.getElementById("datasets");
    // fjerner forrige resultat
    while (results.firstChild) {
        results.removeChild(results.firstChild);
    }
    // Oppdaterer søkeinformasjon
    total = res.hits.total;

    facetController(res);

    var summary = document.getElementById("total.hits");
    summary.innerHTML = total;

    if (total === 0) {
       var zeroHitElement = document.createElement("a");
       zeroHitElement.className = "row list-group-item dataset";
       zeroHitElement.innerHTML = "<h4><center>Ingen resultater funnet</center></h4>";
       results.appendChild(zeroHitElement);
    }

    paginationController();

    // handles hits
    var hits  = res.hits.hits;
    hits.forEach(function(dataset) {
        var source = dataset._source;
        var score = dataset._score;

        var lpElement, pbElement, kwElement, themeElement, descriptionElement, modifiedElement;

        var title = getLanguageString(source.title);
        var description = getLanguageString(source.description);
        var keyword = getLanguageString(source.keyword);

        if (description) {
            descriptionElement = document.createElement("div");
            descriptionElement.className= "overflow-text";
            descriptionElement.innerHTML = description.value;
        }

        var theme = source.theme;
        var themeList = [];
        if (theme) {
            themeElement = document.createElement("span");
            var content = false;
            theme.forEach(function (element) {

                if (pageLanguage === "en") { // theme comes with only two languages
                    themeList.push(element.title.en);
                } else {
                    themeList.push(element.title.nb);
                }
            });
        }

        var landingPage = source.landingPage;
        if (landingPage !== undefined) {
            lpElement = document.createElement("a");
            lpElement.href = landingPage;
            lpElement.target = "_blank";
            lpElement.innerHTML = "<span class=\"glyphicon glyphicon-home\"></span>";
        }

        var publisher = source.publisher;
        if (!publisher) {
            publisher = source.catalog.publisher.name;
        }
        if (publisher) {
            pbElement = document.createElement("h4");
            pbElement.innerHTML =  '<b>'+publisher.name + ' &centerdot;</b> ' + themeList.join(", ");
        }

        /*
        var modified = source.modified;
        if (modified) {
            var ix2 = modified.indexOf("T");
            modifiedElement = document.createElement("span");
            if (ix2 !== -1) {
                modifiedElement.innerHTML = modified.substring(0,ix2);
            } else {
                modifiedElement.innerHTML = modified;
            }
        }
*/
        /*
        if (keyword !== undefined && keyword.value !== undefined) {
            kwElement = document.createElement("span");

            kwElement.innerHTML = " [" + keyword.value.join(", ") + "] ";
        }

        var distributionList = document.createElement("span");
        if (source.distribution) {

            source.distribution.forEach(function (dist) {
                if (dist.format) {
                     var a = document.createElement("a");
                     a.href = dist.accessURL;
                     a.innerHTML = dist.format;
                     a.className = "label label-info";
                     // TODO add href to distribution page
                     distributionList.appendChild(a);
                     distributionList.appendChild(document.createTextNode(" "));
                 }
            });
        }
        */
        // reference to detail page
        var row = document.createElement("a");
        row.setAttribute('href', "datasets?id=" + encodeURIComponent(dataset._id) + "&lang=" + pageLanguage) ;
        //row.target = "_blank";  // open in new page
        row.className = "row list-group-item dataset";
        // dataset
        var ds = document.createElement("div");
        ds.className = "col-sm-12";
        row.appendChild(ds);

        var scoreString = "(" + score + ")";
        if (!score) scoreString = "";
        ds.innerHTML = "<h2>" + title.value + "</h2>" ;

        if (publisher !== undefined)
           ds.appendChild(pbElement);
        if (description)
            ds.appendChild(descriptionElement);
        /*
        if (keyword !== undefined)
            ds.appendChild(kwElement);

        if (theme)
            ds.appendChild(themeElement);
        if (modified) {
            ds.appendChild(document.createTextNode(" "));
            ds.appendChild(modifiedElement);
        }
        if (distributionList) {
            ds.appendChild(document.createTextNode(" "));
            ds.appendChild(distributionList);
        }*/
        if (landingPage) {
           ds.appendChild(document.createTextNode(" "));
           ds.appendChild(lpElement);
        }

        results.appendChild(row);
    });

}

function urlSearchComponents() {
    if (search) {
        var query = "?q=" + search.value + "&from=" + resultCursor.from + "&size=" + resultCursor.size + "&lang=" + pageLanguage;

        if (sortField) {
            query += "&sortfield=" + sortField + "&sortdirection=" + sortDirection;
        }

        if (filters.theme.active.length > 0) {
            var themeStr = "";
            var commaT = false;
            filters.theme.active.forEach(function(t){
                if (commaT) {
                    themeStr += ",";
                }
                themeStr += t;
                commaT = true;
            });
            query += "&theme=" + themeStr;
        }

        if (filters.publisher.active.length > 0) {
            var publ = encodeURIComponent(filters.publisher.active.join(","));
            query += "&publisher=" + publ;
        }

        return query;
    }
}

function getData() {
    var urlstring =  searchUrl + "/search" + urlSearchComponents();

    httpGetAsync(urlstring, showResults);
}

function doSearch() {
    console.log("/datasets" + urlSearchComponents());
    window.location = "/datasets" + urlSearchComponents();

}

// changes page and starts a new search
function goTo(page){

    resultCursor.currentPage = page;
    resultCursor.from = page * resultCursor.size;

    doSearch();
}

// Sets up event handler to select the number of hits per page.
function hitsPerPageController() {
    var hitsSelectElement = document.getElementById('hits.select');
    var hitsChooseElement = document.getElementById('hits.choice');

    if (queryParameterSize !== "") {
        hitsChooseElement.innerHTML = queryParameterSize;
        resultCursor.size = queryParameterSize;
    }
    if (hitsSelectElement) {
        hitsSelectElement.onclick = function (event) {
            var hitsVal = parseInt(event.target.innerHTML);
            if (hitsVal) {
                // The easiest thing is to reset the Result Cursor
                //resetResultCursor();
                resultCursor.size = hitsVal; // set new size
                hitsChooseElement.innerHTML = hitsVal; // show hits per page

                doSearch();
            }
        };
    }
}

// sets up sort controller
function sortController() {

    var sortSelectElement = document.getElementById("sort.select");
    var sortChooseElement = document.getElementById("sort.choice");

    if (sortChooseElement) {

        var sortText;
        if (queryParameterSortfield.indexOf("title") !== -1) {
            sortText = document.getElementById("sort.title").innerHTML;
        } else if (queryParameterSortfield.indexOf("publisher") !== -1) {
            sortText = document.getElementById("sort.publisher").innerHTML;
        } else if (queryParameterSortfield.indexOf("modified") !== -1) {
            sortText = document.getElementById("sort.modified").innerHTML;
        } else if (queryParameterSortfield.indexOf("relevance") !== -1) {
            sortText = document.getElementById("sort.relevance").innerHTML;
        }
        if (sortText) {
            sortChooseElement.innerHTML = sortText;
        }
    }
    if (sortSelectElement) {

        sortSelectElement.onclick = function (event) {
            var oldSortField = sortField;

            var sortElement = event.target;
            var sortVal = event.target.innerHTML;

            sortChooseElement.innerHTML = sortVal;
            var attr = sortElement.getAttribute("id");
            sortDirection = "asc";
            if (attr === "sort.relevance") {
                sortField = undefined;
                sortDirection = "desc";
            } else if (attr === "sort.title") {
                sortField = "title." + pageLanguage;
            } else if (attr === "sort.publisher") {
                sortField = "publisher.name";
            } else if (attr === "sort.modified") {
                sortDirection = "desc";
                sortField = "modified";
            }

            doSearch();

        };
    }
}

// Set up searchbar controller
function searchController() {
    var search = document.getElementById("search");
    var dosearch = document.getElementById("dosearch");

    if (queryParameterQuery !== "") {
        search.value = decodeURIComponent(queryParameterQuery);
    }
    if (dosearch)
        dosearch.onclick = function (event) {
            resetResultCursor();
            doSearch();
        };

    if (search)
        search.onkeypress = function (event) {
            if (event.keyCode === 13) {
                resetResultCursor();
                doSearch();
            }
        };
}

// Set up page
function showPage () {

    searchUrl = $('meta[name="dcatQueryService"]').attr('content');

    var t = $('meta[name="theme"]').attr('content');
    if ( t !== undefined && t !== "") {
        setThemeFilter(t);
        $('meta[name="theme"]').attr("content", "");
    }

    var t = $('meta[name="publisher"]').attr('content');
    if ( t !== undefined && t !== "") {
        setPublisherFilter(t);
        $('meta[name="publisher"]').attr("content", "");
    }

    console.log("query service: " + searchUrl);

    // find the chosen language from the page
    var chosenLanguage = document.getElementById("chosenLanguage");
    var languageList = document.getElementById("language-list");

    var langName = "Norsk (bokmål)";
    if (chosenLanguage && chosenLanguage.textContent) langName = chosenLanguage.textContent;

    searchController();

    sortController();
    hitsPerPageController();

    getData();
}

