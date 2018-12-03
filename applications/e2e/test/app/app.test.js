import * as browser from "../../lib/browser";
import { config } from "../../config";

afterAll(() => {
  browser.close();// we might not want to close the browser between each suite
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
        });

        test('Window has title \'Felles datakatalog\'', async () =>
          expect(page.title()).resolves.toBe('Felles datakatalog')
        );

        test('Search box and button are visible', async () =>
          expect(page.$('input[name=searchBox]')).resolves.toBeTruthy()
        );

        test('Concepts tab is active', async () => {
          const activeTabSelector = '.search-results-tabs .li-active';

          const activeTabText = await page.$eval(activeTabSelector, el => el.innerText);
          expect(activeTabText).toContain("Datasett"); // default language is nb
        });

        test('Api tab label shows number larger than 3', async () => {
          const apiTabSelector = '.search-results-tabs a[href="/apis"]';

          const apiTab = await page.$(apiTabSelector);
          expect(apiTab).toBeTruthy();

          const label = await page.$eval(apiTabSelector, el => el.innerText);
          const count = parseInt(label.match(/\d+/g)[0]);
          expect(count).toBeGreaterThan(5);
        });
      }
    );
  });
});
