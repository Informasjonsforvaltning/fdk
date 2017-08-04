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
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000000;
    });

    afterEach(()=>{
      var clickDeleteDataset = () => {
        var EC = protractor.ExpectedConditions;
        let delete_button = element(by.id('button_delete_dataset_in_list'));
        return browser.wait(EC.presenceOf(delete_button), 10000).then(()=>{
          element(by.css("#button_delete_dataset_in_list")).click().then(()=>{
            element.all(by.css("#datasets_table tr")).count().then((count) => {
              if(count !== 0) {
                clickDeleteDataset();
              } else {

              }
            });
          });
        });
      }
      clickDeleteDataset();
    })

    beforeAll(() => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000000;
    });

        it("Should save datacatalog fields upon typing", () => {
            let catalogLink = element(by.css("#datacatalogs td"));
            catalogLink.click();

            let datasetH1Input = element(by.css(".fdk-register-h1"));
            datasetH1Input.clear();
            datasetH1Input.sendKeys('New datacatalog name');

            var EC = protractor.ExpectedConditions;
            var alertSuccess = element(by.css('.alert-success'));
            browser.wait(EC.presenceOf(alertSuccess), 10000).then( () => {

                    browser.refresh();

                    datasetH1Input = element(by.css(".fdk-register-h1"));
                    browser.wait(EC.textToBePresentInElementValue(datasetH1Input, 'New datacatalog name'), 1000).then(() => {
                        expect(<any>page.getH1Value()).toEqual('New datacatalog name');
                    });
                }
            );


        });


    it("Should handle saving of checkboxes in new dataset", (done) => {
      let catalogLink = element(by.css("#datacatalogs td"));
      catalogLink.click();

      page.createDataset('Should handle saving of checkboxes in new dataset').then(() => {

        let datasetLanguagesEngelskElement = element(by.css('.dataset-languages input'));
        datasetLanguagesEngelskElement.click().then(()=>{
          //browser.pause();
          var EC = protractor.ExpectedConditions;
          var alertSuccess = element(by.css('.alert-success'));
          browser.wait(EC.presenceOf(alertSuccess), 10000).then(()=>{
            browser.refresh()
            let datasetLanguagesEngelskElement = element(by.css('.dataset-languages input'));

            browser.wait(EC.presenceOf(datasetLanguagesEngelskElement),10000).then(() => {
              expect(datasetLanguagesEngelskElement.getAttribute('checked') ).toBeTruthy();
              expect(element(by.css('.dataset-languages input:last-child')).getAttribute('checked') ).toBeTruthy();
              let backButton = element(by.css("#button_back_to_catalog"));
              return browser.wait(EC.presenceOf(backButton), 10000).then(()=>{
                backButton.click();
                done();
              });
            });
          });
        });
      });
    });


    it("should display at least 21 datasets", () => {
      let catalogLink = element(by.css("#datacatalogs td"));
      catalogLink.click();
      var EC = protractor.ExpectedConditions;

      const createDataset = (x) => {
        return page.createDataset('Dataset' + x).then(()=>{
          let alertSuccess = element(by.css('.alert-success'));
          return browser.wait(EC.presenceOf(alertSuccess), 10000).then(()=>{
            let backButton = element(by.css("#button_back_to_catalog"));
            return browser.wait(EC.presenceOf(backButton), 10000).then(()=>{
              backButton.click();
              if(x<2) {
                createDataset(x+1);
                return false;
              } else {
                return true;
              }
            });
          });
        });
      }

      createDataset(0).then((returnVal)=> { // create the first dataset, which will recurse to 21
        if(returnVal === true) {
          expect(element.all(by.css("#datasets_table tr")).count()).toBeGreaterThan(1);
          //cleanup:
        }
      });
    });

    it("should save conformsTo uris", (done) => {
        let catalogLink = element(by.css("#datacatalogs td"));
        catalogLink.click();

        //let datasetLink = element(by.css("#datasets td")); // create one instead
        //datasetLink.click();
        page.createDataset('should save conformsTo uris').then(() => {
          let subjectInput = element(by.css("input[placeholder='Standard']"));
          subjectInput.sendKeys('http://url1,http://url2,'); //comma finishes entry

          var alertSuccess = element(by.css('.alert-success'));
          var EC = protractor.ExpectedConditions;
          browser.wait(EC.presenceOf(alertSuccess), 10000);

          browser.refresh();
          let actualConformsTo = element(by.css("input[placeholder='Standard']"));
          return browser.wait(EC.presenceOf(actualConformsTo), 10000).then(() => {
            console.log('aaaaa');
              expect(<any>page.getTextFromCssElement("rl-tag-input[placeholder='Standard'] rl-tag-input-item:first-child")).toMatch(/http:\/\/url1.*/);
              expect(<any>page.getTextFromCssElement("rl-tag-input[placeholder='Standard'] rl-tag-input-item:nth-child(2)")).toMatch(/http:\/\/url2.*/);
              console.log('aaaaab');
              let backButton = element(by.css("#button_back_to_catalog"));
              return browser.wait(EC.presenceOf(backButton), 10000).then(()=>{
                backButton.click();
                done();
              });
          });
        });
    });


    it("should save spatial uris", (done) => {
        let catalogLink = element(by.css("#datacatalogs td"));
        catalogLink.click();


        page.createDataset('should save spatial uris').then(() => {

          let subjectInput = element(by.css("input[placeholder='Dekningsområde']"));
          subjectInput.sendKeys('http://url1,http://url2,'); //comma finishes entry

          var EC = protractor.ExpectedConditions;
          var alertSuccess = element(by.css('.alert-success'));
          browser.wait(EC.presenceOf(alertSuccess), 10000);

          browser.refresh();
          let actualConformsTo = element(by.css("input[placeholder='Dekningsområde']"));
          browser.wait(EC.presenceOf(actualConformsTo), 1000).then(() => {
              expect(<any>page.getTextFromCssElement("rl-tag-input[placeholder='Dekningsområde'] rl-tag-input-item:first-child")).toMatch(/http:\/\/url1.*/);
              expect(<any>page.getTextFromCssElement("rl-tag-input[placeholder='Dekningsområde'] rl-tag-input-item:nth-child(2)")).toMatch(/http:\/\/url2.*/);
              let backButton = element(by.css("#button_back_to_catalog"));
              return browser.wait(EC.presenceOf(backButton), 10000).then(()=>{
                backButton.click();
                done();
              });
          });
        });

    });


    it("should display accessRightsComments field if RESTRICTED is chosen and content is saved ", (done) => {
        let catalogLink = element(by.css("#datacatalogs td"));
        catalogLink.click();

        page.createDataset('hould display accessRightsComments field if RESTRICTED is chosen').then(() => {
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
              let backButton = element(by.css("#button_back_to_catalog"));
              return browser.wait(EC.presenceOf(backButton), 10000).then(()=>{
                backButton.click();
                done();
              });

          });
        });


    });


    it("should save labels for subject uris", (done) => {
        let catalogLink = element(by.css("#datacatalogs td"));
        catalogLink.click();

        page.createDataset('should save labels for subject uris').then(() => {
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
              let backButton = element(by.css("#button_back_to_catalog"));
              return browser.wait(EC.presenceOf(backButton), 10000).then(()=>{
                backButton.click();
                done();
              });

          });
        });
    });




    it("Should handle saving of codes in new dataset", (done) => {
      let catalogLink = element(by.css("#datacatalogs td"));
      catalogLink.click();

      page.createDataset('saving of codes').then(() => {
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
          let backButton = element(by.css("#button_back_to_catalog"));
          return browser.wait(EC.presenceOf(backButton), 10000).then(()=>{
            backButton.click();
            done();
          });
        });
      });
    });


    it("Should save dataset fields upon typing", (done) => {
        let catalogLink = element(by.css("#datacatalogs td"));
        catalogLink.click();

        page.createDataset('Should save dataset fields upon typing').then(() => {
          var EC = protractor.ExpectedConditions;
          var alertSuccess = element(by.css('.alert-success'));
          browser.wait(EC.presenceOf(alertSuccess), 10000);

          browser.refresh();
          let datasetH1Input = element(by.css(".fdk-register-h1"));
          browser.wait(EC.textToBePresentInElementValue(datasetH1Input, 'Should save dataset fields upon typing'), 1000).then(() => {
              expect(<any>page.getH1Value()).toEqual('Should save dataset fields upon typing');
              let backButton = element(by.css("#button_back_to_catalog"));
              return browser.wait(EC.presenceOf(backButton), 10000).then(()=>{
                backButton.click();
                done();
              });
          });
        });

    });

    it("Should copy publiser from catalog into new dataset", (done) => {
        let catalogLink = element(by.css("#datacatalogs td"));
        catalogLink.click();
        page.createDataset('Should copy publiser from catalog into new dataset').then(() => {
          var EC = protractor.ExpectedConditions;
          var alertSuccess = element(by.css('.alert-success'));
          browser.wait(EC.presenceOf(alertSuccess), 10000);

          browser.refresh();
          let datasetPublisherName = element(by.id('datasett-utgiver-navn'));
          expect(<any>datasetPublisherName.getText()).toEqual("REGISTERENHETEN I BRØNNØYSUND");
          let backButton = element(by.css("#button_back_to_catalog"));
          return browser.wait(EC.presenceOf(backButton), 10000).then(()=>{
            backButton.click();
            done();
          });
        });
    });

    it("Should handle Contact Point fields upon typing", (done) => {
        let catalogLink = element(by.css("#datacatalogs td"));
        catalogLink.click();

        page.createDataset('Should handle Contact Point fields upon typing').then(() => {
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
          contactTelephone.sendKeys("+47123456");

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
              let backButton = element(by.css("#button_back_to_catalog"));
              return browser.wait(EC.presenceOf(backButton), 10000).then(()=>{
                backButton.click();
                done();
              });
          });
        });
    });
});
