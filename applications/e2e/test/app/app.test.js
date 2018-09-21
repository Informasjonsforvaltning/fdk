import delay from 'delay'
import * as browser from "../../lib/browser";
import {config} from "../../config";

afterAll(() => {
    browser.close();// we might not want to close the browser between each suite
});

describe('App', () => {

    test('search page opens', async () => {
        const page = await browser.getNewBrowserPage();
        await page.goto(config.searchHost)

        // Search page component now waits for resolving API request before rendering.
        // If some other solution is implemented with initial rendering, delay can be removed
        await delay(10000);

        await expect(page.title()).resolves.toBe('Felles datakatalog')
        await expect(page.$('input[name=searchBox]')).resolves.toBeTruthy()
        await expect(page.$('#content')).resolves.toBeTruthy()
    }, 20000)

    // todo - test that some results are coming, currently the dabaase is unpopulated, so no results
    // const hits = await page.$$('.fdk-container-search-hit')
    // expect(hits.length).toBeGreaterThan(10);

    /*
    test('user can submit a search request and get a resultpage', async () => {
      await page.goto(APP);
      await page.waitForSelector('.fdk-search-box')
      await page.click('input[name=searchBox]')
      await page.type('input[name=searchBox]', 'enhetsregister')
      await page.click('button.fdk-button-search')
      await page.waitForSelector('#resultPanel')
    }, 16000)
    */
});
