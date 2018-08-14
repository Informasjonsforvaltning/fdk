import puppeteer from "puppeteer";
import { isDebugging } from './../testingInit';

const APP = process.env.HOST_SEARCH;
let page;
let browser;
const width = 1920;
const height = 1080;

beforeAll(async () => {
  try {
      browser = await puppeteer.launch(isDebugging().puppeteer);
      page = await browser.newPage();
      await page.setViewport({ width, height });
  }catch(e){
    console.error('got error',e)
  }
});

afterAll(() => {
  browser.close();
});

describe('App', () => {

  test ('search page opens', async () => {
      await page.goto(APP)

      expect.assertions(3);
      await expect(page.title()).resolves.toBe('Felles datakatalog')
      await expect(page.$('input[name="searchBox"]')).resolves.toBeTruthy()
      await expect(page.$('#content')).resolves.toBeTruthy()
  }, 16000)

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
