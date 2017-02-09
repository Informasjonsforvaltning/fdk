
var lang = navigator.language || navigator.userLanguage;
var themeList = "";
var publisherList= "";
console.log("browser language: ", lang);
var params= window.location.search.substr(1);
console.log(params);
if (params.indexOf("\&") !== -1 ) {
    console.log(params.split("&"));
    params.split("&").forEach(function (param){
        var pair = param.split("=");

        if (pair[0] === "lang") {
            lang = pair[1];
        } else if (pair[0] === "theme") {
            themeList =pair[1];
        } else if (pair[0] === "publisher") {
            publisherList = pair[1];
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

// handle language toggle
/*$(".dropdown-menu li a").click(function(event){
 $(this).parents(".dropdown").find('.btn').html($(this).html() + ' <span class="caret"></span>');
 });*/

// Set up searchbar controller
function searchController() {
    var search = document.getElementById("search");
    var dosearch = document.getElementById("dosearch");

    if (dosearch)
        dosearch.onclick = function (event) {
            var query = "?q=" + search.value ;
            console.log("traverse ", query);
            window.location = "/datasets" + query;

        };

    if (search)
        search.onkeypress = function (event) {
            if (event.keyCode === 13) {
                var query = "?q=" + search.value  ;
                console.log("traverse ", query);
                window.location = "/datasets" + query;

            }
        };
}