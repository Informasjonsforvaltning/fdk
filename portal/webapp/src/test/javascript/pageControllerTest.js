
describe("Page Navigation Controller Tests", function() {


    beforeEach(function () {
        var total = 200;
        var pageLanguage="nb";
    });

    it("No fixtures should not throw error ", function () {
        expect(function() { paginationController(); }).not.toThrow();
    });

    it("With fixtures 200 results should generate 20 pages", function() {
    /*
        $('body').append('<div class="col-sm-4" th:attr="aria-label=#{page.navigation}"><nav>                                                  <ul class="pager pagination pagination-sm" style="margin:0;">                                                                                <li>                                                          <a id="prev" href="#" th:attr="aria-label=#{page.prev}">                                                              <span aria-hidden="true">&laquo;</span>                                                          </a>                                                      </li>                                                      <li>                                                          <a id="next" href="#" th:attr="aria-label=#{page.next}">                                                              <span aria-hidden="true">&raquo;</span>     </a>      </li>       </ul>      </nav> </div>');
        paginationController();

        expect ( $('.pager li').length ).toBe(8);
        expect ( $('.pager li')[6].innerHTML).toBe('<a href="#">20</a>');
*/
    });


});