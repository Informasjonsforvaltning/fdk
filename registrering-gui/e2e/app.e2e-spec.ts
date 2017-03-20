import {RegistreringGuiPage} from "./app.po";
import {browser, element, by, protractor} from "protractor";
import {} from 'jasmine';
declare function setTimeout(callback: Function, milliseconds: number): any
describe('registrering-gui App', () => {
  let page: RegistreringGuiPage;

  beforeEach(() => {
  });
  beforeAll(()=> {
    page = new RegistreringGuiPage();
      browser.get("/")
    let usernameInput = element(by.css("input[name=username]"));
    usernameInput.sendKeys("dask");
    let passwordInput = element(by.css("input[name=password]"));
    passwordInput.sendKeys("123");
    let submitButton = element(by.css("form[name=loginForm] button"));
    submitButton.click();
    var isLoggedInElement = element(by.css('.login-status'));
    var EC = protractor.ExpectedConditions;
    browser.wait(EC.presenceOf(isLoggedInElement), 10000);
  })

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Datakataloger');
  });

  it("Should be able to login", () => {
    browser.get("/")
    let usernameInput = element(by.css("input[name=username]"));
    usernameInput.sendKeys("dask");
    let passwordInput = element(by.css("input[name=password]"));
    passwordInput.sendKeys("123");
    let submitButton = element(by.css("form[name=loginForm] button"));
    submitButton.click();

    expect(page.getLoginStatusText()).toEqual('Pålogget som dask');
  });

  it("Should save field upon typing", () => {
    //page.navigateTo();
    let catalogLink = element(by.css("#datacatalogs td"));
    catalogLink.click();

    var EC = protractor.ExpectedConditions;

    let datasetLink = element(by.css("#datasets td"));
    datasetLink.click();

    let datasetH1Input = element(by.css(".fdk-register-h1"));
    datasetH1Input.clear();
    var oldValue = datasetH1Input.getText();
    datasetH1Input.sendKeys('New dataset name');

    var alertSuccess = element(by.css('.alert-success'));
    browser.wait(EC.presenceOf(alertSuccess), 10000);

    expect(page.getAlertText()).toContain('Sist lagret');


    browser.wait(EC.presenceOf(alertSuccess), 10000);

    browser.refresh();
    datasetH1Input = element(by.css(".fdk-register-h1"));
    browser.wait(EC.textToBePresentInElementValue(datasetH1Input, 'New dataset name'),1000).then(() => {
      expect(page.getH1Value()).toEqual('New dataset name');
    });
  });
});
