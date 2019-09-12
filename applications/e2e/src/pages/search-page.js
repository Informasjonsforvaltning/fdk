import { config } from '../../config';

const datasetsContentSelector = '#content[data-test-id="datasets"]';

export const searchBoxSelector = 'input[name=searchBox]';
export const searchButtonSelector = 'button.fdk-button-search';

export class SearchPage {
  constructor(browserPage) {
    this.browserPage = browserPage;
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
}

export async function navigateToSearchPage(browserPage) {
  await browserPage.goto(config.searchHost);
  const searchPage = new SearchPage(browserPage);
  await searchPage.waitForPageLoad();
  return searchPage;
}
