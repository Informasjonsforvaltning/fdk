import delay from 'delay';
import * as browser from "../../lib/browser";
import { config } from "../../config";

afterAll(() => {
  browser.close();// we might not want to close the browser between each suite
});

describe('App', () => {

  test('search page opens', async () => {
    const page = await browser.getNewBrowserPage();
    await page.goto(config.searchHost);

    // Search page component now waits for resolving API request before rendering.
    // If some other solution is implemented with initial rendering, delay can be removed
    await delay(10000);

    await expect(page.title()).resolves.toBe('Felles datakatalog');
    await expect(page.$('input[name=searchBox]')).resolves.toBeTruthy();
    await expect(page.$('#content')).resolves.toBeTruthy();
  }, 20000);

});
