// simulate global variables in result.js

var pageLanguage = "nb";
var languages = [ "nb", "nn", "en", "sv", "dk", "de", "fr", "es", "pl", "ru" ];

// Testsuite
describe("getLanguageString", function() {

var title = {
    "nb": "Norsk NB",
    "nn": "Norsk NN",
    "en": "English",
    "no": "Invalid",
    "": "Invalid",
    "pl": "Polish"};

var description = {
    "xy": "XYLANG",
     "nb": "NORSK"
};

var keyword = {
    "no" : "Gulating"
};

    beforeEach(function () {
        pageLanguage="nb";
    });

    it("default returns Norsk NB 2", function () {
        expect(getLanguageString(title)).toEqual({ value: "Norsk NB", language: "nb" });
    });

    it("pageLanguage = en -> returns English", function () {
        pageLanguage = "en";
        expect(getLanguageString(title)).toEqual({ value: "English", language: "en" });
    });

    it("pageLanguage = nb and literal only contains no should return unknown language no", function () {
        pageLanguage = "nb";
        expect(getLanguageString(keyword)).toEqual({ value: "Gulating", language: "no" });
    });

    it("pageLanguage = en and map only contains nb returns nb", function () {
        pageLanguage = "en";
        expect(getLanguageString(description)).toEqual({ value: "NORSK", language: "nb" });
    });

    it("pageLanguage = xx and language does not contain xx should return nb", function () {
        pageLanguage = "xx";
        expect(getLanguageString(description)).toEqual({ value: "NORSK", language: "nb" });
    });

    it("returns undefined if argument is undefined", function() {
        expect(getLanguageString(undefined)).toBe(undefined);
    });

    it("returns undefined if argument is empty object", function() {

         expect(getLanguageString({})).toBe(undefined);
    });

});