
var languages = [ "nb", "nn", "en", "sv", "dk", "de", "fr", "es", "pl", "ru" ];
var pageLanguage = "nb";
var sortField = "";
var sortOrder = "asc";
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
    resultCursor.size = 10;
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
    var summary = document.getElementById("total.hits");
    var info = document.getElementById("search.info");
    if (summary) {
        if (info && total === 0) {
            info.innerHTML = "Ingen resultater funnet";
        }
        summary.innerHTML = total;
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
        if (theme) {
            themeElement = document.createElement("span");
            themeElement.className = "label label-default";
            var content = [];
            theme.forEach(function (element) {
                if (pageLanguage === "en") { // theme comes with only two languages
                    content.push(element.title.en);
                } else {
                    content.push(element.title.nb);
                }
            });
            themeElement.innerHTML = content.join(", ");
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
            pbElement = document.createElement("button");
            pbElement.className = "btn btn-default btn-sm publisher";
            pbElement.type = "button";
            pbElement.innerHTML =  publisher.name;
        }

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

        if (keyword !== undefined && keyword.value !== undefined) {
            kwElement = document.createElement("span");

            kwElement.innerHTML = " [" + keyword.value.join(", ") + "] ";
        }

        var distributionList = document.createElement("span");
        if (source.distribution) {

            source.distribution.forEach(function (dist) {
                 console.log(dist.format);
                 var a = document.createElement("a");
                 a.href = dist.accessURL;
                 a.innerHTML = dist.format;
                 a.className = "label label-info";
                 distributionList.appendChild(a);
                 distributionList.appendChild(document.createTextNode(" "));
            });
        }

        // reference to detail page
        var row = document.createElement("a");
        row.setAttribute('href', "detail?id=" + dataset._id);
        row.target = "_blank";  // open in new page
        row.className = "row list-group-item dataset";
        // dataset
        var ds = document.createElement("div");
        ds.className = "col-sm-12";
        row.appendChild(ds);

        var scoreString = "(" + score + ")";
        if (!score) scoreString = "";
        ds.innerHTML = "<h4>" + title.value + " <sup>" + title.language + " " + scoreString + "</sup></h4>" ;

        if (publisher !== undefined)
           ds.appendChild(pbElement);
        if (description)
            ds.appendChild(descriptionElement);
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
        }
        if (landingPage) {
           ds.appendChild(document.createTextNode(" "));
           ds.appendChild(lpElement);
        }

        results.appendChild(row);
    });

}

function doSearch() {
    var theme = $('meta[name="theme"]').attr('content');

    var urlstring = searchUrl + "?q=" + search.value + "&from="+resultCursor.from +"&size="+resultCursor.size ;
    if (sortField) urlstring += "&sortfield=" + sortField + "&sortdirection=" + sortDirection;
    if (theme && theme !== "") urlstring += "&theme=" + theme;
    console.log(urlstring);

    $('meta[name="theme"]').attr("content", "");

    // does an asynchronous call and calls showResults function.
    httpGetAsync(urlstring, showResults);
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
    if (hitsSelectElement) {
        hitsSelectElement.onclick = function (event) {
            var hitsVal = parseInt(event.target.innerHTML);
            if (hitsVal) {
                // The easiest thing is to reset the Result Cursor
                resetResultCursor();
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

    if (sortSelectElement)
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
            sortField = "publisher.name" ;
        } else if (attr === "sort.modified") {
            sortDirection = "desc";
            sortField = "modified";
        }

        doSearch();

    };

}

// Set up searchbar controller
function searchController() {
    var search = document.getElementById("search");
    var dosearch = document.getElementById("dosearch");

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

    console.log("service: " + searchUrl);

    // find the chosen language from the page
    var chosenLanguage = document.getElementById("chosenLanguage");
    var languageList = document.getElementById("language-list");

    var langName = "Norsk (bokmål)";
    if (chosenLanguage && chosenLanguage.textContent) langName = chosenLanguage.textContent;

    // set page language. HACK TODO FIX
    if (langName === "English") pageLanguage="en";
    if (langName === "Norsk (bokmål)") pageLanguage="nb";
    if (langName === "Norsk (nynorsk)") pageLanguage = "nn";

    console.log(pageLanguage);

    searchController();
    sortController();
    hitsPerPageController();

    // First call to search
    doSearch();

}



