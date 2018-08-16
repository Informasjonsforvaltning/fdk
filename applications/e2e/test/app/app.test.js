import puppeteer from "puppeteer";
import { isDebugging } from './../testingInit';

// const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const APP = process.env.HOST_SEARCH;
let page;
let browser;
const width = 1920;
const height = 1080;

beforeAll(async () => {
    try {
        browser = await puppeteer.launch(isDebugging().puppeteer);
        page = await browser.newPage();
        page.on('console', msg => {
            for (let i = 0; i < msg.args().length; ++i)
                console.log(`CONSOLE ${i}: ${msg.args()[i]}`);
        });
        await page.setViewport({ width, height });
    } catch (e) {
        console.error('got error', e)
    }
});

afterAll(() => {
    browser.close();
});

describe('App', () => {

    test('search page opens', async () => {
        await page.goto(APP)

        // Search page component now waits for resolving API request before rendering.
        // If some other solution is implemented with initial rendering, delay can be removed
        // await delay(5000);

        await expect(page.title()).resolves.toBe('Felles datakatalog')
        // we get "org.elasticsearch.index.IndexNotFoundException" on API calls, and
        // Our current logic does not render on error, so test
        // await expect(page.$('input[name=searchBox]')).resolves.toBeTruthy()
        // await expect(page.$('#content')).resolves.toBeTruthy()
    }, 10000)

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
