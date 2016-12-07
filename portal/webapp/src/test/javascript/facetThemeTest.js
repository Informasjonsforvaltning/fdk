var pageLangauge = "nb";
var themeViewToggle = true;

var badInput = {"this": "is", "bad": "."};

// Testsuite
describe("Theme facets", function() {

    beforeEach(function() {
        pageLangauge = "nb";
    });

    it("Facet Controller handles undefined result", function () {

        expect(function () {facetController(undefined);}).toThrow();
    });


    it("Facet Controller handles bad input", function () {

        expect(function() {facetController(badInput);}).toThrow();
    });

    it("Expect more toggle text", function() {

        pageLanguage = "en";

        expect(getToggleText()).toBe("More");
    });

    it("Facet Theme Controller handles undefined input parameter", function() {

        expect(function() {facetThemeController(undefined);}).not.toThrow();
    });

    it("Facet Theme Controller handles bad input parameter", function() {

        expect(function() {createFacetThemeController(badInput);}).not.toThrow();
    });

    it("Facet Theme Controller handles bad input parameter2", function() {
        var badBucket = {buckets:["very", "bad", "indeed"]};

        expect(function() {createFacetThemeController(badBucket);}).toThrow();
    });

});