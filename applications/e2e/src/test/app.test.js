import delay from 'delay';
import * as browser from '../lib/browser';
import {
  activeTabSelector,
  apiArticleSelector,
  apisContentSelector,
  apiTabSelector,
  navigateToSearchPage,
  navigateToSearchPageApiTab,
  searchBoxSelector,
  searchButtonSelector
} from '../pages/search-page';
import { extractNumber } from '../lib/extract-number';

afterAll(() => {
  browser.close(); // we might not want to close the browser between each suite
});

describe('SUITE: Main page', () => {
  let page;
  beforeAll(async () => {
    page = await browser.getNewBrowserPage();
  });

  describe('GIVEN: Address is bar is blank', () => {
    describe('WHEN: Navigate to the search page', () => {
      let searchPage;
      beforeAll(async () => {
        searchPage = await navigateToSearchPage(page);
      });

      test("ART:API-705 THEN: Window has title 'Felles datakatalog'", async () =>
        expect(page.title()).resolves.toBe('Felles datakatalog'));

      test('ART:API-705 THEN: Search box and button are visible', async () => {
        expect(searchPage.hasVisible(searchBoxSelector)).resolves.toBeTruthy();
        expect(
          searchPage.hasVisible(searchButtonSelector)
        ).resolves.toBeTruthy();
      });

      test('ART:API-705 THEN: Dataset tab is active', async () => {
        const activeTabLabels = await searchPage.selectorsContent(
          activeTabSelector
        );
        expect(activeTabLabels).toHaveLength(1); // only one tab is active
        expect(activeTabLabels[0]).toContain('Datasett'); // default language is nb
      });

      test('ART:API-705 THEN: Api tab label shows number larger than 3', async () => {
        const apiTabLabel = (
          await searchPage.selectorsContent(apiTabSelector)
        )[0];

        expect(apiTabLabel).toContain('API-er');
        expect(extractNumber(apiTabLabel)).toBeGreaterThan(5);
      });
    });
  });

  describe('GIVEN: On search page datasets tab', () => {
    let searchPage;
    beforeAll(async () => {
      searchPage = await navigateToSearchPage(page);
    });

    describe('WHEN: Click on "Apis" tab', () => {
      beforeAll(async () => {
        await searchPage.click(apiTabSelector);
        await page.waitForSelector(apisContentSelector);
      });

      test('ART:API-201 THEN: Results block is displayed with more than 3 api items in it', async () => {
        const articleTexts = await searchPage.selectorsContent(
          apiArticleSelector
        );
        expect(articleTexts.length).toBeGreaterThan(3);
      });
    });
  });

  describe('GIVEN: On search page apis tab', () => {
    let searchPage;
    beforeAll(async () => {
      searchPage = await navigateToSearchPageApiTab(page);
    });

    describe("WHEN: Enter search text 'ks' + enter", () => {
      beforeAll(async () => {
        const searchText = 'ks';
        await searchPage.typeSearchTextAndEnter(searchText);
        // wait for api call to be finished
        delay(5000);
      });

      test("ART:API-201 THEN: Results block is displayed with exactly 1 api item that contains 'KS Fiks'", async () => {
        const articleTexts = await searchPage.selectorsContent(
          apiArticleSelector
        );

        expect(articleTexts).toHaveLength(1);
        expect(articleTexts[0]).toContain('KS Fiks');
      });
    });
  });
});
