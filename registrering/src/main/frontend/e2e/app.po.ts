import {browser, element, by, protractor} from "protractor";

export class RegistreringGuiPage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('app-root h1')).getText();
  }

  getLoginStatusText() {
    return element(by.css('.login-status')).getText();
  }

  getAlertText() {
    return element(by.css('.alert')).getText();
  }

  getH1Value() {
    return element(by.css('.fdk-register-h1')).getAttribute('value');
  }

    getValueFromElement(id) {
      return element(by.id(id)).getAttribute('value');
    }
    getTextFromCssElement(css) {
      return element(by.css(css)).getText();
    }
    createDataset(name) {
      let newDatasetButton = element(by.id("button_new_dataset"));
      newDatasetButton.click();
      let datasetH1Input = element(by.css(".fdk-register-h1"));
      var EC = protractor.ExpectedConditions;
      return browser.wait(EC.presenceOf(datasetH1Input), 10000).then(() => {
        datasetH1Input.clear();
        datasetH1Input.sendKeys(name);
      });
    }
}
