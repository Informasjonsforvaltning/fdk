var pageLangauge = "nb";
var themeViewToggle = true;

var badInput = {"this": "is", "bad": "."};

// Testsuite
describe("Theme facets", function() {

    beforeEach(function() {
        pageLangauge = "nb";
    });

    it("Facet Controller throws error on undefined result", function () {

        expect(function () {facetController(undefined);}).toThrow();
    });


    it("Facet Controller throws error on bad input", function () {

        expect(function() {facetController(badInput);}).toThrow();
    });

    it("Expect more toggle text", function() {

        pageLanguage = "en";

        expect(getToggleText({ hideMany: true})).toBe("Show more");
    });

    it("Create Facet Controller handles undefined input parameter", function() {

        expect(function() {createFacetController(undefined);}).not.toThrow();
    });

    it("Create Facet Controller ignores bad input parameter", function() {

        expect(function() {createFacetController(badInput);}).not.toThrow();
    });

    it("Create Facet Controller ignores bad input parameter2", function() {
        var badBucket = {buckets:["very", "bad", "indeed"]};

        expect(function() {createFacetController(badBucket);}).not.toThrow();
    });

});