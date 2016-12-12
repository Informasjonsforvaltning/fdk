
describe("Page Navigation Controller Tests", function() {
    var pgContr = '<div id="pageController" class="col-sm-4"><nav><ul class="pager pagination pagination-sm" style="margin:0;"><li><a id="prev" href="#" th:attr="aria-label=#{page.prev}"><span aria-hidden="true">&laquo;</span></a></li><li><a id="next" href="#" th:attr="aria-label=#{page.next}"> <span aria-hidden="true">&raquo;</span> </a></li></ul> </nav> </div>';

    beforeEach(function () {
        total = 200;
        pageLanguage="nb";
    });

    afterEach(function() {
        $('#pageController').remove();
    });

    it("No fixtures should not throw error ", function () {
        expect(function() { paginationController(); }).not.toThrow();
    });

    it("With 200 results should generate 20 pages", function() {
        $('body').append(pgContr);

        paginationController();

        expect ( $('.pager li').length ).toBe(8);
        expect ( $('.pager li')[6].innerHTML).toBe('<a href="#">20</a>');

    });

    it("With 0 results should generate 0 pages", function() {
        $('body').append(pgContr);

        total = 0;
        paginationController();

        expect ( $('.pager li').length).toBe(0);

    })


});