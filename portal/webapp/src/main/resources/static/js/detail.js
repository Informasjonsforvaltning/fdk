
var lang = "nb"; // force default to be nb, or as browser= navigator.language || navigator.userLanguage;
if (lang === undefined) {
    lang = "nb";
}
if (lang.indexOf("en") === 0 ) {
    lang = "en";
}
if (lang.indexOf("nb") === 0) {
    lang = "nb";
}
if (lang.indexOf("nn") === 0) {
    lang = "nn";
}

var datasetId = "";

console.log("browser language: ", lang);

// get language from url
var params= window.location.search.substr(1);

if (params.indexOf("\&") !== -1 ) {
    params.split("&").forEach(function (param){
        var pair = param.split("=");

        if (pair[0] === "lang") {
            lang = pair[1];
        } else if (pair[0] === "id") {
            datasetId =pair[1];
        }
    });
} else {
    var pair = params.split("=");
    if (pair[0] === "lang") {
        lang = pair[1];
    }
}
console.log("application lang: " , lang);

// set correct chosen language
var langElement = document.getElementById("lang." + lang);
$("#chosenLanguage").html($(langElement).html() + ' <span class="caret"></span>');

// adjust href for language choice
langElement = document.getElementById("lang.nb");
langElement.href ="datasets?id=" + datasetId + "&lang=nb";

langElement = document.getElementById("lang.nn");
langElement.href ="datasets?id=" + datasetId + "&lang=nn";

langElement = document.getElementById("lang.en");
langElement.href ="datasets?id=" + datasetId + "&lang=en";

