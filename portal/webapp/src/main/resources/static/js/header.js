
var lang = navigator.language || navigator.userLanguage;
console.log("browser language: ", lang);
var params= window.location.search.substr(1);
var pair = params.split("=");
if (pair[0] === "lang") {
    lang = pair[1];
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
            window.location = "/results" + query;

        };

    if (search)
        search.onkeypress = function (event) {
            if (event.keyCode === 13) {
                var query = "?q=" + search.value  ;
                console.log("traverse ", query);
                window.location = "/results" + query;

            }
        };
}