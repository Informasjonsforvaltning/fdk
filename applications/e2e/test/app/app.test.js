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
      const title=await page.title()
      expect(title).toBe('Felles datakatalog')
      const searchBox = await page.$eval('.fdk-search-box', el => (el ? true : false))
      expect (searchBox).toBe(true)
      const resultPanel = await page.$eval('#resultPanel', el => (el ? true : false))
      expect (resultPanel).toBe(true);
  }, 16000)

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
