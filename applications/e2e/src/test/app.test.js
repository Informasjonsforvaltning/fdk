import delay from 'delay';
import * as browser from '../lib/browser';
import { config } from '../../config';
import {
  activeTabSelector, apiTabSelector,
  navigateToSearchPage,
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
        const activeTabLabels = await searchPage.selectorsContent(activeTabSelector);
        expect(activeTabLabels).toHaveLength(1); // only one tab is active
        expect(activeTabLabels[0]).toContain('Datasett'); // default language is nb
      });

      test('ART:API-705 THEN: Api tab label shows number larger than 3', async () => {
        const apiTabLabel = (await searchPage.selectorsContent(apiTabSelector))[0];

        expect(apiTabLabel).toContain('API-er');
        expect(extractNumber(apiTabLabel)).toBeGreaterThan(5);
      });
    });
  });

  describe('GIVEN: On search page datasets tab', () => {
    describe('WHEN: Click on "Apis" tab', () => {
      beforeAll(async () => {
        await page.goto(config.searchHost);
        const apiTabSelector = '.search-results-tabs a[href="/apis"]';
        const apisContentSelector = '#content[data-test-id="apis"]';
        await page.waitForSelector(apiTabSelector);
        await page.click(apiTabSelector);
        await page.waitForSelector(apisContentSelector);
      });

      test('ART:API-201 THEN: Results block is displayed with more than 3 api items in it', async () => {
        const apiArticleSelector = '#content[data-test-id="apis"] article';

        const count = await page.$$eval(apiArticleSelector, els => els.length);

        expect(count).toBeGreaterThan(3);
      });
    });
  });

  describe('GIVEN: On search page apis tab', () => {
    beforeAll(async () => {
      await page.goto(`${config.searchHost}/apis`);
      await page.waitForSelector('#content[data-test-id="apis"]');
    });

    describe("WHEN: Enter search text 'ks' + enter", () => {
      beforeAll(async () => {
        const searchBox = await page.$('input[name=searchBox]');
        await searchBox.type(`ks${String.fromCharCode(13)}`);
        await page.waitForSelector('#content[data-test-id="apis"]');
        await delay(5000); // TODO wait for network success /api/apis/search
      });

      test("ART:API-201 THEN: Results block is displayed with exactly 1 api item that contains 'KS Fiks'", async () => {
        const apiArticleSelector = '#content[data-test-id="apis"] article';

        const articleTexts = await page.$$eval(apiArticleSelector, els =>
          els.map(el => el.innerText)
        );

        expect(articleTexts).toHaveLength(1);
        expect(articleTexts[0]).toContain('KS Fiks');
      });
    });
  });
});