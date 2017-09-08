import {RegistreringGuiPage} from "./app.po";
import {browser, element, by, protractor} from "protractor";
import {} from 'jasmine';

declare function setTimeout(callback: Function, milliseconds: number): any

const EC = protractor.ExpectedConditions;


async function openSection(label) {
  let sectionElement = element(by.css(`label[for="${label}-toggle"]`));
  await browser.wait(EC.presenceOf(sectionElement), 10000, `Could not find ${label}-toggle`);
  await sectionElement.click();
  return sectionElement;
}

/* TO RUN WITH SUCCESS YOU MUST CREATE AN EMPTY DATASET IN THE CATALOG */
describe('registrering-gui App', () => {


    let page: RegistreringGuiPage;

    beforeEach(async () => {

        console.log("beforeEach()");
        page = new RegistreringGuiPage();
        console.log("waiting for browser get");
        await browser.get("/");

        console.log("Looking for Logg inn");
        let isPresent = await element(by.linkText("Logg inn")).isPresent()
        if (isPresent) {
            let submitButton = element(by.linkText("Logg inn"));
            console.log("Clicking on Logg inn");

            await submitButton.click();

            browser.sleep(500);
            browser.executeScript('document.getElementsByName("username")[0].value = "03096000854"')
            browser.executeScript('document.getElementsByName("password")[0].value = "password01"')
            browser.executeScript('document.getElementsByName("submit")[0].click()')

            browser.sleep(500);
        }

        browser.sleep(500);

        console.log("Waiting to be logged in");
        let isLoggedInElement = element(by.linkText("Logg ut"));

        await browser.wait(EC.presenceOf(isLoggedInElement), 10000, "Could not find log out link in beforeEach");

        console.log("Logged in!");
    });

    afterEach(async () => {
        console.log("afterEach()");
        let clickDeleteDataset = async () => {

            console.log("Cleaning up after test. NOT WORKING YET!");

/*
            let delete_button = element(by.id('button_delete_dataset_in_list'));
            console.log("afterEach3");

            browser.sleep(1000);

            let present = await delete_button.isPresent();
            if (!present) {
                return;
            }

            console.log("afterEach4");

            await element(by.css("#button_delete_dataset_in_list")).click();

            console.log("afterEach5");

            let count = await element.all(by.css("#datasets_table tr")).count();

            console.log("afterEach6");

            if (count !== 0) {
                await clickDeleteDataset();
            }

*/
        };
        await clickDeleteDataset();


    });

    beforeAll(() => {
        console.log("beforeAll");
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000000;
    });


        it("Should handle saving of themes (checkboxes) in new dataset", async () => {

            let catalogLink = element(by.css("#datacatalogs td"));
            await browser.wait(EC.presenceOf(catalogLink), 10000, "Could not find #datacatalogs td");
            await catalogLink.click();

            await page.createDataset('Should handle saving of themes checkboxes in new dataset');

            // first the checkboxes must be expanded
            await openSection("tema");

            let datasetThemesElement = element.all(by.css('.dataset-tema .checkbox-replacement'));
            await browser.wait(EC.presenceOf(datasetThemesElement.get(5)), 10000, "Could not find checkboxes");
            await datasetThemesElement.get(0).click();
            await datasetThemesElement.get(2).click();
            await datasetThemesElement.get(3).click();

            //let alertSuccess = element(by.css('.fdk-saved'));

            browser.sleep(2000); // check above should check if things have been stored in the backgroun, but doesn't actually work so we sleep as well to give the frontend time to post to the serverwait browser.wait(EC.presenceOf(alertSuccess), 15000);
            await browser.refresh();
            let datasetElement = element(by.css(".nv-dataset"));

            await openSection("tema");

            let datasetThemesElement21 = element.all(by.css('.dataset-tema .checkbox-replacement'));

            let datasetThemesCheckboxes = element.all(by.css('input[id^="theme-checkbox"]'));

            await browser.wait(EC.presenceOf(datasetThemesElement21.get(5)), 10000, "Could not find Tema 5");

            expect(datasetThemesCheckboxes.get(0).getAttribute('checked')).toBeTruthy("Theme 1 should be checked");
            expect(datasetThemesCheckboxes.get(2).getAttribute('checked')).toBeTruthy("Theme 3 should be checked");
            expect(datasetThemesCheckboxes.get(3).getAttribute('checked')).toBeTruthy("Theme 4 should be checked");

            console.log("uncheck element 3");

            // uncheck theme 3
            await datasetThemesElement21.get(2).click();
            let datasetid = "dataset-id-not-found";
            await browser.wait(EC.presenceOf(datasetElement), 10000, "Could not find datasetid");
            datasetElement.getAttribute('id').then(function (value) {
              datasetid = value;
              console.log("dataset: ", datasetid);
            });


            let backButton = element(by.css("#button_back_to_catalog"));
            await browser.wait(EC.presenceOf(backButton), 10000);

            await backButton.click();

            // Open dataset and make sure the un-clicked theme is off
            let datasetRow = element(by.css('tr[id="'+datasetid+'"]'));
            await browser.wait(EC.presenceOf(datasetRow), 1000, "Could not find dataset id");
            await datasetRow.click();

            await openSection("tema");

            console.log("reopen themes");

            let datasetReopenedThemeCheckboxes = element.all(by.css('input[id^=theme-checkbox]'));
            await browser.wait(EC.presenceOf(datasetReopenedThemeCheckboxes.get(5)),5000);

            expect(datasetReopenedThemeCheckboxes.get(0).getAttribute('checked')).toBeTruthy("Theme 1 should be checked");
            expect(datasetReopenedThemeCheckboxes.get(2).getAttribute('checked')).toBeFalsy("Theme 3 should be UNCHECKED");
            expect(datasetReopenedThemeCheckboxes.get(3).getAttribute('checked')).toBeTruthy("Theme 4 should be checked");


        });

    it("Should save datacatalog fields upon typing", async () => {

        let catalogLink = element(by.css("#datacatalogs td"));

        await browser.wait(EC.presenceOf(catalogLink), 10000, "Could not find catalogLink");

        await  catalogLink.click();

        let datasetH1Input = element(by.css(".fdk-register-h1"));
        await browser.wait(EC.presenceOf(datasetH1Input), 10000, "Could not find catalog title element");

        await datasetH1Input.clear();
        await datasetH1Input.sendKeys('New datacatalog name');

        browser.sleep(2000); // check above should check if things have been stored in the backgroun, but doesn't actually work so we sleep as well to give the frontend time to post to the server
        await browser.refresh();

        datasetH1Input = element(by.css(".fdk-register-h1"));

        await browser.wait(EC.textToBePresentInElementValue(datasetH1Input, 'New datacatalog name'), 10000, "Could not find 'New datacatalog name'");

        expect(<any>page.getH1Value()).toEqual('New datacatalog name');


    });


    it("Should save dataset title after typing", async () => {
        let catalogLink = element(by.css("#datacatalogs td"));
        await catalogLink.click();

        let title = 'Should save dataset title after typing';
        await page.createDataset(title);

        let alertSuccess = element(by.css('.fdk-saved'));
        await browser.wait(EC.presenceOf(alertSuccess), 10000);

        browser.sleep(2000); //  check above should check if things have been stored in the backgroun, but doesn't actually work so we sleep as well to give the frontend time to post to the server
        await browser.refresh();

        let section = element(by.cssContainingText(".section-title","Tittel og beskrivelse"));
        await section.click();

        let datasetTitle = element(by.css("#dataset-title"));
        await browser.wait(EC.textToBePresentInElementValue(datasetTitle, title), 1000);
        expect(<any>page.getDatasetTitle()).toEqual(title);

        let backButton = element(by.css("#button_back_to_catalog"));
        await  browser.wait(EC.presenceOf(backButton), 10000);
        await backButton.click();

    });


    it("Should copy publiser from catalog into new dataset", async () => {
        let catalogLink = element(by.css("#datacatalogs td"));
        await catalogLink.click();
        await page.createDataset('Should copy publiser from catalog into new dataset');

        let alertSuccess = element(by.css('.fdk-saved'));
        await browser.wait(EC.presenceOf(alertSuccess), 10000);

        browser.sleep(2000); // check above should check if things have been stored in the backgroun, but doesn't actually work so we sleep as well to give the frontend time to post to the server
        await browser.refresh();
        let datasetPublisherName = element(by.id('datasett-utgiver-navn'));
        expect(<any>datasetPublisherName.getText()).toEqual("RAMSUND OG ROGNAN REVISJO");
        let backButton = element(by.css("#button_back_to_catalog"));
        await  browser.wait(EC.presenceOf(backButton), 10000);
        await backButton.click();

    });


    it("should display at least 21 datasets", async () => {
        let catalogLink = element(by.css("#datacatalogs td"));
        await catalogLink.click();


        for (let x = 0; x < 21; x++) {

            await page.createDataset('Dataset' + x);
            let alertSuccess = element(by.css('.fdk-saved'));
            await browser.wait(EC.presenceOf(alertSuccess), 10000);
            let backButton = element(by.css("#button_back_to_catalog"));
            await browser.wait(EC.presenceOf(backButton), 10000);
            await backButton.click();

        }

        expect(element.all(by.css("#datasets-list tr")).count()).toBeGreaterThan(20);

    });

    it("Should handle saving of languages (checkboxes) in new dataset", async () => {

        let catalogLink = element(by.css("#datacatalogs td"));
        await browser.wait(EC.presenceOf(catalogLink), 10000, "Could not find #datacatalogs td");
        await catalogLink.click();

        await page.createDataset('Should handle saving of checkboxes in new dataset');

        // first the checkboxes must be expanded
        await openSection("geotime");

        let datasetLanguages = element.all(by.css('.language-checkbox'));
        await browser.wait(EC.presenceOf(datasetLanguages.get(3)), 10000, "Could not find language-checkbox");
        await datasetLanguages.get(0).click();
        await datasetLanguages.get(2).click();

        browser.sleep(2000); // check above should check if things have been stored in the backgroun, but doesn't actually work so we sleep as well to give the frontend time to post to the serverwait browser.wait(EC.presenceOf(alertSuccess), 15000);
        await browser.refresh();

        // first the checkboxes must be expanded
        await openSection("geotime");
        let datasetLanguageInputs = element.all(by.css('.language-checkbox input'));
        await browser.wait(EC.presenceOf(datasetLanguageInputs.get(3)), 10000, "Could not find language-checkbox input");

        expect(datasetLanguageInputs.get(0).getAttribute('checked')).toBeTruthy("Language element 1 should be checked");
        expect(datasetLanguageInputs.get(1).getAttribute('checked')).toBeFalsy("Language element 2 should be UNCHECKED");
        expect(datasetLanguageInputs.get(2).getAttribute('checked')).toBeTruthy("Language element 3 should be checked");

    });


    it("should save conformsTo uris", async () => {
        let catalogLink = element(by.css("#datacatalogs td"));
        await catalogLink.click();
        await page.createDataset('should save conformsTo uris');

        await openSection("quality");

        let subjectInput = element(by.css("input[placeholder='Standard']"));
        await subjectInput.sendKeys('http://url1,http://url2,'); //comma finishes entry

        let alertSuccess = element(by.css('.fdk-saved'));

        await browser.wait(EC.presenceOf(alertSuccess), 10000);

        browser.sleep(2000); // .fdk-saved check above should check if things have been stored in the backgroun, but doesn't actually work so we sleep as well to give the frontend time to post to the server
        await browser.refresh();
        await openSection("quality");

        let actualConformsTo = element(by.css("input[placeholder='Standard']"));
        await browser.wait(EC.presenceOf(actualConformsTo), 10000);
        console.log('aaaaa');
        expect(<any>page.getTextFromCssElement("rl-tag-input[placeholder='Standard'] rl-tag-input-item:first-child")).toMatch(/http:\/\/url1.*/);
        expect(<any>page.getTextFromCssElement("rl-tag-input[placeholder='Standard'] rl-tag-input-item:nth-child(2)")).toMatch(/http:\/\/url2.*/);
        console.log('aaaaab');
        let backButton = element(by.css("#button_back_to_catalog"));
        await browser.wait(EC.presenceOf(backButton), 10000);
        await backButton.click();

    });


    it("should save spatial uris", async () => {
        let catalogLink = element(by.css("#datacatalogs td"));
        await catalogLink.click();

        await page.createDataset('should save spatial uris')

        await openSection("geotime");

        let subjectInput = element(by.css("input[placeholder='Dekningsområde']"));
        await subjectInput.sendKeys('http://url1,http://url2,'); //comma finishes entry

        let alertSuccess = element(by.css('.fdk-saved'));
        await browser.wait(EC.presenceOf(alertSuccess), 10000);

        browser.sleep(2000); // .fdk-saved check above should check if things have been stored in the backgroun, but doesn't actually work so we sleep as well to give the frontend time to post to the server
        await browser.refresh();
        await openSection("geotime");

        let actualConformsTo = element(by.css("input[placeholder='Dekningsområde']"));
        await browser.wait(EC.presenceOf(actualConformsTo), 10000);
        expect(<any>page.getTextFromCssElement("rl-tag-input[placeholder='Dekningsområde'] rl-tag-input-item:first-child")).toMatch(/http:\/\/url1.*/);
        expect(<any>page.getTextFromCssElement("rl-tag-input[placeholder='Dekningsområde'] rl-tag-input-item:nth-child(2)")).toMatch(/http:\/\/url2.*/);
        let backButton = element(by.css("#button_back_to_catalog"));
        await browser.wait(EC.presenceOf(backButton), 10000);
        await backButton.click();


    });


    it("should display accessRightsComments field if RESTRICTED is chosen and content is saved ", async () => {
        let catalogLink = element(by.css("#datacatalogs td"));
        await catalogLink.click();

        await page.createDataset('hould display accessRightsComments field if RESTRICTED is chosen');
        //click restricted access right to display accessrightsComment field

        await openSection("access-level");

      let accessRights = element(by.css("#accessRightSelector > div:nth-child(2) > label > input"));
        await accessRights.click();

        let alertSuccess = element(by.css('.fdk-saved'));
        await browser.wait(EC.presenceOf(alertSuccess), 10000);

        //write something into the accesrightscomment field
        let accessRightsComment = element(by.css("input[placeholder='Legg til url']"));
        await accessRightsComment.clear();
        await accessRightsComment.sendKeys('http://lovdata,'); //comma finishes entry

        await browser.wait(EC.presenceOf(alertSuccess), 10000);


        browser.sleep(2000); // .fdk-saved check above should check if things have been stored in the backgroun, but doesn't actually work so we sleep as well to give the frontend time to post to the server//check that accessrightscomment was saved
        await browser.refresh();
        await openSection("access-level");

        let actualAccessRightsComment = element(by.css("input[placeholder='Legg til url']"));
        // #accessRightsComment
        await browser.wait(EC.presenceOf(actualAccessRightsComment), 10000)
        expect(<any>page.getTextFromCssElement("rl-tag-input[placeholder='Legg til url'] rl-tag-input-item:first-child")).toMatch(/http:\/\/lovdata.*/);
        let backButton = element(by.css("#button_back_to_catalog"));
        await  browser.wait(EC.presenceOf(backButton), 10000)
        await backButton.click();

    });


    it("should save labels for subject uris", async () => {
        let catalogLink = element(by.css("#datacatalogs td"));
        await catalogLink.click();

        await page.createDataset('should save labels for subject uris');



        let subjectInput = element(by.css("input[placeholder='Begrep']"));
        await subjectInput.clear();
        await subjectInput.sendKeys('http://brreg.no/begrep/testbegrep,'); //comma finishes entry


        let alertSuccess = element(by.css('.fdk-saved'));
        await  browser.wait(EC.presenceOf(alertSuccess), 10000);

        browser.sleep(2000); // .fdk-saved check above should check if things have been stored in the backgroun, but doesn't actually work so we sleep as well to give the frontend time to post to the server
        await browser.refresh();
        let actualSubjects = element(by.css("input[placeholder=Begrep]"));
        await browser.wait(EC.presenceOf(actualSubjects), 10000);
        expect(<any>page.getTextFromCssElement("rl-tag-input[placeholder='Begrep'] rl-tag-input-item:first-child")).toMatch(/http:\/\/brreg.no\/begrep\/testbegrep.*/);
        let backButton = element(by.css("#button_back_to_catalog"));
        await  browser.wait(EC.presenceOf(backButton), 10000);
        await backButton.click();

    });


    it("Should handle saving of codes in new dataset", async () => {
        let catalogLink = element(by.css("#datacatalogs td"));
        await catalogLink.click();

        await page.createDataset('saving of codes');
        let provenanceControl = element(by.css('[formcontrolname=provenance]'));
        await provenanceControl.click();

        let provenanceControlFirstValue = element(by.css('[formcontrolname=provenance] li:first-child'));
        await provenanceControlFirstValue.click();

        let accrualPeriodicityControl = element(by.css('[formcontrolname=accrualPeriodicity]'));
        await accrualPeriodicityControl.click();
        let accrualPeriodicityControlFirstValue = element(by.css('[formcontrolname=accrualPeriodicity] li:first-child'));
        await accrualPeriodicityControlFirstValue.click();


        let alertSuccess = element(by.css('.fdk-saved'));
        await browser.wait(EC.presenceOf(alertSuccess), 10000);

        browser.sleep(2000); // check above should check if things have been stored in the background, but doesn't actually work so we sleep as well to give the frontend time to post to the server
        await browser.refresh();
        let provenanceControlValueElement = element(by.css('[formcontrolname=provenance] .value'));

        await browser.wait(EC.presenceOf(provenanceControlValueElement), 10000);
        expect(<any>page.getTextFromCssElement('[formcontrolname=provenance] .value')).toEqual('Tredjepart');
        expect(<any>page.getTextFromCssElement('[formcontrolname=accrualPeriodicity] .value')).toEqual('hver fjortende dag');
        let backButton = element(by.css("#button_back_to_catalog"));
        await  browser.wait(EC.presenceOf(backButton), 10000);
        await   backButton.click();

    });





    it("Should handle Contact Point fields upon typing", async () => {
        let catalogLink = element(by.css("#datacatalogs td"));
        await catalogLink.click();

        await page.createDataset('Should handle Contact Point fields upon typing');
        let contactAvdeling = element(by.id('contact-avdeling'));
        await contactAvdeling.clear();
        await contactAvdeling.sendKeys('Avdelingsnavn');

        let contactUrl = element(by.id('contact-url'));
        await contactUrl.clear();
        await contactUrl.sendKeys("http://test.no");

        let contactEmail = element(by.id('contact-email'));
        await contactEmail.clear();
        await contactEmail.sendKeys('test@test.test');

        let contactTelephone = element(by.id('contact-telephone'));
        await contactTelephone.clear();
        await contactTelephone.sendKeys("+47123456");


        let alertSuccess = element(by.css('.fdk-saved'));
        await browser.wait(EC.presenceOf(alertSuccess), 10000);

        browser.sleep(2000); // check above should check if things have been stored in the backgroun, but doesn't actually work so we sleep as well to give the frontend time to post to the server
        await browser.refresh();
        let avdeling = element(by.id('contact-avdeling'));

        await browser.wait(EC.textToBePresentInElementValue(avdeling, 'Avdelingsnavn'), 1000);
        expect(<any>page.getValueFromElement('contact-avdeling')).toEqual('Avdelingsnavn');
        expect(<any>page.getValueFromElement('contact-url')).toEqual('http://test.no');
        expect(<any>page.getValueFromElement('contact-email')).toEqual('test@test.test');
        expect(<any>page.getValueFromElement('contact-telephone')).toEqual('+47123456');
        let backButton = element(by.css("#button_back_to_catalog"));
        await  browser.wait(EC.presenceOf(backButton), 10000);
        await backButton.click();

    });


})
;
