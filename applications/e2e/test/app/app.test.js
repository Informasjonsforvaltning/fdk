import puppeteer from "puppeteer";
import { isDebugging } from './../testingInit';
import delay from 'delay'

const APP = process.env.HOST_SEARCH;

const isMacOS = !!process.env.IS_MACOS;
let page;
let browser;
const width = 1920;
const height = 1080;

beforeAll(async () => {
    try {
        const options = isMacOS ?
        {
          headless: false,
          executablePath: '/Applications/Chromium.app/Contents/MacOS/Chromium',
          args: ["--window-size=2400,1239"]
        } : isDebugging().puppeteer;
        browser = await puppeteer.launch(options);
        page = await browser.newPage();
        page.on('console', consoleMessage => {
            console.log('CONSOLE MESSAGE TYPE:', consoleMessage.type())
            console.log('CONSOLE MESSAGE TEXT:', consoleMessage.text())
            consoleMessage.args().forEach(msgArgJSHandle => {
                console.log('CONSOLE MESSAGE ARG:', msgArgJSHandle.jsonValue())
            })
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
        await page.goto(APP);
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
