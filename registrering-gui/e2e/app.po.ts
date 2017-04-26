import {browser, element, by} from "protractor";

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
}
