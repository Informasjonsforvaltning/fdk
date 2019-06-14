import puppeteer from 'puppeteer';
import { config } from '../config';

const browserConfig = {
  default: {},
  chromium: {
    headless: false,
    slowMo: 80,
    args: [`--window-size=1920,1080`]
  },
  'google-chrome-unstable': {
    args: ['--no-sandbox'],
    executablePath: 'google-chrome-unstable'
  }
};

let browser;

export function launchBrowser() {
  return puppeteer.launch(browserConfig[config.browser]);
}

export function getBrowser() {
  browser = browser || launchBrowser();
  return browser;
}

export async function getNewBrowserPage({ width = 1920, height = 1080 } = {}) {
  const browser = await getBrowser();
  const page = await browser.newPage();

  await page.setViewport({ width, height });

  page.on('console', consoleMessage => {
    console.warn(
      'BROWSER CONSOLE:',
      consoleMessage.type(),
      consoleMessage.text()
    );
    // usually the arguments are included in test form of the message
    // consoleMessage.args().forEach(msgArgJSHandle => {
    //     console.log('ARG:', msgArgJSHandle.jsonValue());
    // });
  });

  return page;
}

export async function close() {
  if (browser) {
    (await browser).close();
  }
  browser = undefined;
}
