import {browser, element, by, protractor} from "protractor";

export class RegistreringGuiPage {
     EC = protractor.ExpectedConditions;


    async navigateTo() {
        await browser.get('/');
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

    async createDataset(name) {
        console.log(`createDataset(name: ${name})`);
        let newDatasetButton = element(by.id("button_new_dataset"));
        await newDatasetButton.click();
        let datasetH1Input = element(by.css(".fdk-register-h1"));
        await browser.wait(this.EC.presenceOf(datasetH1Input), 10000, "Could not find input field for dataset name");
        await datasetH1Input.clear();
        await datasetH1Input.sendKeys(name);
    }
}
