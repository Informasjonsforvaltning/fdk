
// tree toggler -> http://cssdeck.com

var sElement = document.getElementById("dcatQueryService");
var searchUrl = sElement.innerHTML;
console.log("service: " + searchUrl);

var languages = [ "nb", "nn", "en", "sv", "dk", "de", "fr", "es", "pl", "ru" ];
var pageLanguage = "nb";

// find the chosen language from the page
var chosenLanguage = document.getElementById("chosenLanguage");
var languageList = document.getElementById("language-list");

var langName = chosenLanguage.textContent;

// set page language.
if (langName == "English") pageLanguage="en";
if (langName == "Norsk (bokmål)") pageLanguage="nb";
if (langName == "Norsk (nynorsk)") pageLanguage = "nn"

console.log(pageLanguage);


var from = 0;
var size = 10;
var total = 0;

// First call to search
httpGetAsync(searchUrl, showResults);

var prev = document.getElementById("prev");
prev.onclick = function (e) {
    e.preventDefault();
    from -= size;
    if (from < 0) from = 0;
    console.log(from + " " + size);

    doSearch();
};

var next = document.getElementById("next");
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
dosearch.onclick = function (event) {
    console.log("q: " + search.value);
    from = 0;
    doSearch();
};

search.onkeypress = function (event) {
    if (event.keyCode == 13) {
        from = 0;
        doSearch();
    }
};

function doSearch() {
    var urlstring = searchUrl + "?q=" + search.value +"&from="+from +"&size="+size ;
    console.log(urlstring);
    httpGetAsync(urlstring, showResults);

}

function httpGetAsync(theUrl, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous
    xmlHttp.send(null);
}

function showResults(search_result) {

    var res = JSON.parse(search_result);

    var results = document.getElementById("datasets");
    // fjerner forrige resultat
    while (results.firstChild) {
        results.removeChild(results.firstChild);
    }
    // Oppdaterer søkeinformasjon
    total = res.hits.total;
    var summary = document.getElementById("summary");
    if (total == 0 )
        summary.innerHTML = "Ingen treff";
    else {
        var til = from + size ;
        var fra = from + 1;
        if (fra > total) fra = total;
        if (til > total ) til = total;
        //if (from == 0) summary.innerHTML = "Viser de " + fra +  " første datasettene av totalt " + total + " treff";
        summary.innerHTML = "Viser datasett " + fra  + " til " + til + " av " + total + " treff";
    }



    // Returns the string from the language tagged literal,
    // literal - object with language keys { "nb": "Norsk", "en": "English", ...
    function getLanguageString(literal) {
        var result = { "value": undefined, "language": "?"};

        // get string from pageLanguage
        var string = literal[pageLanguage];

        // literal does not contain the default pageLanguage key
        if (string == undefined) {
            let l = 0;
            // Check expected language keys
            while (l < languages.length && string == undefined) {
                string = literal[ languages[l] ];
                if (string != undefined) {
                    result.value = string;
                    result.language = languages[l];

                    return result;
                }
                l++;
            }
            // Handle unexpected language keys (select first in list)
            if (result.value == undefined) {
                for (var k in literal) {
                    result.value = literal[k];
                    result.language = k;

                    return result;
                }
            }
        } else { // default language values found
            result.value = string;
            result.language = pageLanguage;
        }

        return result;
    }

    // handles hits
    var hits  = res.hits.hits;
    hits.forEach(function(dataset) {
        var source = dataset._source;

        var title = getLanguageString(source.title);
        var description = getLanguageString(source.description);

        var landingPage = source.landingPage;
        if (landingPage != undefined) {
            var lpElement = document.createElement("a");
            lpElement.href = landingPage;
            lpElement.target = "_blank";
            lpElement.innerHTML = "<span class=\"glyphicon glyphicon-home\"></span>";
        }

        var publisher = source.publisher;
        if (publisher == undefined ) {
            publisher = source.catalog.publisher.name;
        } else {
            publisher = publisher.name;
        }
        if (publisher != undefined) {
            var pbElement = document.createElement("kbd");
            pbElement.innerHTML =  publisher;
        }

        var keywords = getLanguageString(source.keywords);
        if (keywords.value != undefined) {
            var kwElement = document.createElement("span");

            kwElement.innerHTML = " [" + keywords.value.join(", ") + "] ";
        }

        var row = document.createElement("a");
        row.className = "row list-group-item dataset";
        row.href = "#";
        row.innerHTML = "<strong>" + title.value + " [" + title.language + "]</strong></br>" + description.value ;

        if (keywords.value != undefined)
            row.appendChild(kwElement);
        if (landingPage != undefined)
            row.appendChild(lpElement);
        if (publisher != undefined)
            row.appendChild(pbElement);

        results.appendChild(row);
    });
}