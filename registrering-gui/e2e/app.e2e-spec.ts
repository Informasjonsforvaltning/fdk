import {RegistreringGuiPage} from "./app.po";
import {browser, element, by, protractor} from "protractor";
import {} from 'jasmine';
declare function setTimeout(callback: Function, milliseconds: number): any
/* TO RUN WITH SUCCESS YOU MUST CREATE AN EMPTY DATASET IN THE CATALOG */
describe('registrering-gui App', () => {
    let page: RegistreringGuiPage;

    beforeEach(() => {
        page = new RegistreringGuiPage();
        browser.get("/")
        element(by.buttonText("Logg inn som bjg")).isPresent().then(function (isPresent) {
            if (isPresent) {
                let submitButton = element(by.buttonText("Logg inn som bjg"));
                submitButton.click();
            }
        });

        var isLoggedInElement = element(by.css('.alert-success'));
        var EC = protractor.ExpectedConditions;
        browser.wait(EC.presenceOf(isLoggedInElement), 10000);
    });

    beforeAll(() => {
    });

    it("should save conformsTo uris", () => {
        let catalogLink = element(by.css("#datacatalogs td"));
        catalogLink.click();

        let datasetLink = element(by.css("#datasets td"));
        datasetLink.click();

        let subjectInput = element(by.css("input[placeholder='Standard']"));
        subjectInput.sendKeys('http://url1,http://url2,'); //comma finishes entry

        var EC = protractor.ExpectedConditions;
        var alertSuccess = element(by.css('.alert-success'));
        browser.wait(EC.presenceOf(alertSuccess), 10000);

        browser.refresh();
        let actualConformsTo = element(by.css("input[placeholder='Standard']"));
        browser.wait(EC.presenceOf(actualConformsTo), 1000).then(() => {
            expect(<any>page.getTextFromCssElement("rl-tag-input[placeholder='Standard'] rl-tag-input-item:first-child")).toMatch(/http:\/\/url1.*/);
            expect(<any>page.getTextFromCssElement("rl-tag-input[placeholder='Standard'] rl-tag-input-item:nth-child(2)")).toMatch(/http:\/\/url2.*/);
        });

    });

    it("should display accessRightsComments field if RESTRICTED is chosen and content is saved ", () => {
        let catalogLink = element(by.css("#datacatalogs td"));
        catalogLink.click();

        let newDatasetLink = element(by.css("#datasets td"));
        newDatasetLink.click();

        //#accessRightSelector > div:nth-child(2) > label > input

        //click restricted access right to display accessrightsComment field
        let accessRights = element(by.css("#accessRightSelector > div:nth-child(2) > label > input"));
        accessRights.click()


        var EC = protractor.ExpectedConditions;
        var alertSuccess = element(by.css('.alert-success'));
        browser.wait(EC.presenceOf(alertSuccess), 10000);

        //write something into the accesrightscomment field
        let accessRightsComment = element(by.css("input[placeholder='Legg til url']"));
        accessRightsComment.clear();
        accessRightsComment.sendKeys('http://lovdata,'); //comma finishes entry

        var EC = protractor.ExpectedConditions;
        var alertSuccess = element(by.css('.alert-success'));
        browser.wait(EC.presenceOf(alertSuccess), 10000);

        //check that accessrightscomment was saved
        browser.refresh();
        let actualAccessRightsComment = element(by.css("input[placeholder='Legg til url']"));
        // #accessRightsComment
        browser.wait(EC.presenceOf(actualAccessRightsComment), 10000).then(() => {
            expect(<any>page.getTextFromCssElement("rl-tag-input[placeholder='Legg til url'] rl-tag-input-item:first-child")).toMatch(/http:\/\/lovdata.*/);

        });


    });


    it("should save labels for subject uris", () => {
        let catalogLink = element(by.css("#datacatalogs td"));
        catalogLink.click();

        let newDatasetLink = element(by.css("#datasets td"));
        newDatasetLink.click();

        let subjectInput = element(by.css("input[placeholder='Begrep']"));
        subjectInput.clear();
        subjectInput.sendKeys('http://brreg.no/begrep/testbegrep,'); //comma finishes entry

        var EC = protractor.ExpectedConditions;
        var alertSuccess = element(by.css('.alert-success'));
        browser.wait(EC.presenceOf(alertSuccess), 10000);

        browser.refresh();
        let actualSubjects = element(by.css("input[placeholder=Begrep]"));
        browser.wait(EC.presenceOf(actualSubjects), 10000).then(() => {
            expect(<any>page.getTextFromCssElement("rl-tag-input[placeholder='Begrep'] rl-tag-input-item:first-child")).toMatch(/http:\/\/brreg.no\/begrep\/testbegrep.*/);

        });

    });



    it("Should handle saving of codes in new dataset", () => {
      let catalogLink = element(by.css("#datacatalogs td"));
      catalogLink.click();

      let newDatasetLink = element(by.css("#datasets td"));
      newDatasetLink.click();

        let datasetH1Input = element(by.css(".fdk-register-h1"));
        datasetH1Input.clear();
        datasetH1Input.sendKeys('Codes test');

        let provenanceControl = element(by.css('[formcontrolname=provenance]'));
        provenanceControl.click();
        let provenanceControlFirstValue = element(by.css('[formcontrolname=provenance] li:first-child'));
        provenanceControlFirstValue.click();

        let accrualPeriodicityControl = element(by.css('[formcontrolname=accrualPeriodicity]'));
        accrualPeriodicityControl.click();
        let accrualPeriodicityControlFirstValue = element(by.css('[formcontrolname=accrualPeriodicity] li:first-child'));
        accrualPeriodicityControlFirstValue.click();

        var EC = protractor.ExpectedConditions;
        var alertSuccess = element(by.css('.alert-success'));
        browser.wait(EC.presenceOf(alertSuccess), 10000);

        browser.refresh();
        let provenanceControlValueElement = element(by.css('[formcontrolname=provenance] .value'));

      browser.wait(EC.presenceOf(provenanceControlValueElement),10000).then(() => {
        expect(<any>page.getTextFromCssElement('[formcontrolname=provenance] .value')).toEqual('Tredjepart');
        expect(<any>page.getTextFromCssElement('[formcontrolname=accrualPeriodicity] .value')).toEqual('hver fjortende dag');
      });
    });

    it('should display message saying app works', () => {
        page.navigateTo();
        expect(<any>page.getParagraphText()).toEqual('Datakataloger');
    });


    /* bjg: not relevant with preliminary login, therefore disabled
     it("Should be able to login", () => {
     let usernameInput = element(by.css("input[name=username]"));
     usernameInput.sendKeys("dask");
     let passwordInput = element(by.css("input[name=password]"));
     passwordInput.sendKeys("123");
     let submitButton = element(by.css("form[name=loginForm] button"));
     submitButton.click();

     expect(page.getLoginStatusText()).toEqual('Pålogget som dask');
     });
     */

    it("Should save datacatalog fields upon typing", () => {
        let catalogLink = element(by.css("#datacatalogs td"));
        catalogLink.click();

        let datasetH1Input = element(by.css(".fdk-register-h1"));
        datasetH1Input.clear();
        datasetH1Input.sendKeys('New datacatalog name');

        var EC = protractor.ExpectedConditions;
        var alertSuccess = element(by.css('.alert-success'));
        browser.wait(EC.presenceOf(alertSuccess), 10000);

        browser.refresh();
        datasetH1Input = element(by.css(".fdk-register-h1"));
        browser.wait(EC.textToBePresentInElementValue(datasetH1Input, 'New datacatalog name'), 1000).then(() => {
            expect(<any>page.getH1Value()).toEqual('New datacatalog name');
        });
    });

    it("Should save dataset fields upon typing", () => {
        let catalogLink = element(by.css("#datacatalogs td"));
        catalogLink.click();

        let datasetLink = element(by.css("#datasets td"));
        datasetLink.click();

        let datasetH1Input = element(by.css(".fdk-register-h1"));
        datasetH1Input.clear();
        datasetH1Input.sendKeys('New dataset name');

        var EC = protractor.ExpectedConditions;
        var alertSuccess = element(by.css('.alert-success'));
        browser.wait(EC.presenceOf(alertSuccess), 10000);

        browser.refresh();
        datasetH1Input = element(by.css(".fdk-register-h1"));
        browser.wait(EC.textToBePresentInElementValue(datasetH1Input, 'New dataset name'), 1000).then(() => {
            expect(<any>page.getH1Value()).toEqual('New dataset name');
        });
    });

    it("Should copy publiser from catalog into new dataset", () => {
        let catalogLink = element(by.css("#datacatalogs td"));
        catalogLink.click();

        let datasetLink = element(by.css("#datasets td"));
        datasetLink.click();

        let datasetH1Input = element(by.css(".fdk-register-h1"));
        datasetH1Input.clear();
        datasetH1Input.sendKeys('New dataset name');

        var EC = protractor.ExpectedConditions;
        var alertSuccess = element(by.css('.alert-success'));
        browser.wait(EC.presenceOf(alertSuccess), 10000);

        browser.refresh();
        let datasetPublisherName = element(by.id('datasett-utgiver-navn'));
        expect(<any>datasetPublisherName.getText()).toEqual("REGISTERENHETEN I BRØNNØYSUND");
    });

    it("Should handle Contact Point fields upon typing", () => {
        let catalogLink = element(by.css("#datacatalogs td"));
        catalogLink.click();

        let datasetLink = element(by.css("#datasets td"));
        datasetLink.click();

        let datasetH1Input = element(by.css(".fdk-register-h1"));
        datasetH1Input.clear();
        datasetH1Input.sendKeys('CONTACTPOINT TEST');

        let contactAvdeling = element(by.id('contact-avdeling'));
        contactAvdeling.clear();
        contactAvdeling.sendKeys('Avdelingsnavn');

        let contactUrl = element(by.id('contact-url'));
        contactUrl.clear();
        contactUrl.sendKeys("http://test.no");

        let contactEmail = element(by.id('contact-email'));
        contactEmail.clear();
        contactEmail.sendKeys('test@test.test');

        let contactTelephone = element(by.id('contact-telephone'));
        contactTelephone.clear();
        contactTelephone.sendKeys("+47123456")

        var EC = protractor.ExpectedConditions;
        var alertSuccess = element(by.css('.alert-success'));
        browser.wait(EC.presenceOf(alertSuccess), 10000);

        browser.refresh();
        var avdeling = element(by.id('contact-avdeling'));

        browser.wait(EC.textToBePresentInElementValue(avdeling, 'Avdelingsnavn'), 1000).then(() => {
            expect(<any>page.getValueFromElement('contact-avdeling')).toEqual('Avdelingsnavn');
            expect(<any>page.getValueFromElement('contact-url')).toEqual('http://test.no');
            expect(<any>page.getValueFromElement('contact-email')).toEqual('test@test.test');
            expect(<any>page.getValueFromElement('contact-telephone')).toEqual('+47123456');
        });
    });



});
