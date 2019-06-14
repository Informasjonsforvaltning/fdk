import delay from 'delay';
import * as browser from '../../lib/browser';
import { config } from '../../config';

afterAll(() => {
  browser.close(); // we might not want to close the browser between each suite
});

describe('SUITE: Main page', () => {
  let page;
  beforeAll(async () => {
    page = await browser.getNewBrowserPage();
  });

  describe('GIVEN: Address is bar is blank', () => {
    describe('WHEN: Navigate to the search address', () => {
      beforeAll(async () => {
        const datasetsContentSelector = '#content[data-test-id="datasets"]';

        await page.goto(config.searchHost);
        await page.waitForSelector(datasetsContentSelector);
        await delay(5000); // TODO wait for network success /api/apis/search
      });

      test("ART:API-705 THEN: Window has title 'Felles datakatalog'", async () =>
        expect(page.title()).resolves.toBe('Felles datakatalog'));

      test('ART:API-705 THEN: Search box and button are visible', async () =>
        expect(page.$('input[name=searchBox]')).resolves.toBeTruthy());

      test('ART:API-705 THEN: Concepts tab is active', async () => {
        const activeTabSelector = '.search-results-tabs .li-active';

        const activeTabText = await page.$eval(
          activeTabSelector,
          el => el.innerText
        );
        expect(activeTabText).toContain('Datasett'); // default language is nb
      });

      test('ART:API-705 THEN: Api tab label shows number larger than 3', async () => {
        const apiTabSelector = '.search-results-tabs a[href="/apis"]';

        const apiTab = await page.$(apiTabSelector);
        expect(apiTab).toBeTruthy();

        const label = await page.$eval(apiTabSelector, el => el.innerText);
        const count = Number(label.match(/\d+/g)[0]);
        expect(count).toBeGreaterThan(5);
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

    describe("WHEN: Enter search text 'FS' + enter", () => {
      beforeAll(async () => {
        const searchBox = await page.$('input[name=searchBox]');
        await searchBox.type(`fs${String.fromCharCode(13)}`);
        await page.waitForSelector('#content[data-test-id="apis"]');
        await delay(5000); // TODO wait for network success /api/apis/search
      });

      test("ART:API-201 THEN: Results block is displayed with exactly 1 api item that contains 'FS-API'", async () => {
        const apiArticleSelector = '#content[data-test-id="apis"] article';

        const articleTexts = await page.$$eval(apiArticleSelector, els =>
          els.map(el => el.innerText)
        );

        expect(articleTexts).toHaveLength(1);
        expect(articleTexts[0]).toContain('FS-API');
      });
    });
  });
});
