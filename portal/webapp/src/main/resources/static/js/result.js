

var languages = [ "nb", "nn", "en", "sv", "dk", "de", "fr", "es", "pl", "ru" ];
var pageLanguage = "nb";
var sortField = "";
var sortOrder = "asc";
var from = 0;
var size = 10;
var total = 0;
var searchUrl = "http://dcat.no/unknown";

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
    if (summary) {
        summary.innerHTML = total;
    }

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
                var inx = element.lastIndexOf("/");
                content.push(element.substring(inx +1, element.length));
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
            pbElement.innerHTML =  publisher.name;
        }

        var modified = source.modified;
        if (modified) {
            var ix2 = modified.indexOf("T");
            modifiedElement = document.createElement("span");
            modifiedElement.innerHTML = modified.substring(0,ix2);
        }

        if (keyword !== undefined && keyword.value !== undefined) {
            kwElement = document.createElement("span");

            kwElement.innerHTML = " [" + keyword.value.join(", ") + "] ";
        }

        var row = document.createElement("a");
        row.className = "row list-group-item dataset";
        row.href = "#";
        var scoreString = "(" + score + ")"
        if (!score) scoreString = "";
        row.innerHTML = "<strong>" + title.value + "</strong> <sup>" + title.language + " " + scoreString + "</sup></br>" ;

        if (publisher !== undefined)
            row.appendChild(pbElement);
        if (description)
            row.appendChild(descriptionElement);
        if (keyword !== undefined)
            row.appendChild(kwElement);
        if (theme)
            row.appendChild(themeElement);
        if (landingPage !== undefined)
            row.appendChild(lpElement);
        if (modified)
            row.appendChild(modifiedElement);

        results.appendChild(row);
    });

}

function doSearch() {
    var urlstring = searchUrl + "?q=" + search.value +"&from="+from +"&size="+size ;
    if (sortField) urlstring += "&sortfield=" + sortField + "&sortdirection=" + sortDirection;

    console.log(urlstring);

    httpGetAsync(urlstring, showResults);
}

function prepareSort() {
    console.log("Prepare Sort");

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
            sortField = "modified";
        }

        //if (oldSortField !=== sortField) {
            doSearch();
        //}

    };

}

function showPage () {

var sElement = document.getElementById("dcatQueryService");

if (sElement) // !== undefined)
    searchUrl = sElement.innerHTML;

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

// First call to search
httpGetAsync(searchUrl, showResults);

var prev = document.getElementById("prev");
if (prev)
    prev.onclick = function (e) {
        e.preventDefault();
        from -= size;
        if (from < 0) from = 0;
        console.log(from + " " + size);

        doSearch();
    };

var next = document.getElementById("next");
if (next)
    next.onclick = function(e) {
        e.preventDefault();
        var oldFrom = from;
        from += size;
        if (from > total) from = odlFrom;

        console.log(from + " " + size);

        doSearch();
    };

var search = document.getElementById("search");
var dosearch = document.getElementById("dosearch");

if (dosearch)
    dosearch.onclick = function (event) {
        console.log("q: " + search.value);
        from = 0;
        doSearch();
    };

if (search)
    search.onkeypress = function (event) {
        if (event.keyCode === 13) {
            from = 0;
            doSearch();
        }
    };

prepareSort();
}

// starts the page initializing code;
showPage();



