import { config } from '../../config';

const datasetsContentSelector = '#content[data-test-id="datasets"]';

export const searchBoxSelector = 'input[name=searchBox]';
export const searchButtonSelector = 'button.fdk-button-search';
export const activeTabSelector = '.search-results-tabs .li-active';
export const apiTabSelector = '.search-results-tabs a[href="/apis"]';
export const apisContentSelector = '#content[data-test-id="apis"]';
export const apiArticleSelector = '#content[data-test-id="apis"] article';

export class SearchPage {
  constructor(browserPage) {
    this.browserPage = browserPage;
    this.click=browserPage.click.bind(browserPage);
  }

  async waitForPageLoad() {
    await this.waitForVisible(datasetsContentSelector);
  }

  hasVisible(selector) {
    return this.waitForVisible(selector)
      .then(() => true)
      .catch(() => false);
  }

  waitForVisible(selector) {
    return this.browserPage.waitForSelector(selector, { visible: true });
  }

  selectorsContent(selector) {
    return this.browserPage.$$eval(selector, els => els.map(e => e.innerText));
  }
}

export async function navigateToSearchPage(browserPage) {
  await browserPage.goto(config.searchHost);
  const searchPage = new SearchPage(browserPage);
  await searchPage.waitForPageLoad();
  return searchPage;
}
