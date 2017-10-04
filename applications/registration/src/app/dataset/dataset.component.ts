import { Component, OnInit, ViewChild, ChangeDetectorRef } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from "@angular/forms";
import { DatasetService } from "./dataset.service";
import { CodesService } from "./codes.service";
import { CatalogService } from "../catalog/catalog.service";
import { Dataset } from "./dataset";
import { Catalog } from "../catalog/catalog"
import { Observable } from 'rxjs';
import { Http, Response } from '@angular/http';
import { NgModule } from '@angular/core';
import { environment } from "../../environments/environment";
import { ConfirmComponent } from "../confirm/confirm.component";
import { DialogService } from "ng2-bootstrap-modal";
import { DistributionFormComponent } from "./distribution/distribution.component";
import * as _ from 'lodash';
import { ThemesService } from "./themes.service";
import { IMyDpOptions } from 'mydatepicker';
import { TemporalListComponent } from "./temporal/temporal-list.component";
import { HelpText } from "./helptext/helptext.component";

@Component({
    selector: 'app-dataset',
    templateUrl: './dataset.component.html',
    styleUrls: ['./dataset.component.css']
})

export class DatasetComponent implements OnInit {
    title = 'Registrer datasett';
    dataset: Dataset;
    catalog: Catalog;
    description: string;
    language: string;
    timer: number;
    saved: boolean;
    catId: string;
    lastSaved: string;
    identifiersForm: FormGroup;
    datasetSavingEnabled: boolean = false; // upon page init, saving is disabled
    saveDelay: number = 1000;
    datasetForm: FormGroup = new FormGroup({});
    myDatePickerOptions: IMyDpOptions = {
        //dateFormat: 'dd.mm.yyyy',//'yyyy.mm.dd',
        showClearDateBtn: false
    };
    availableLanguages: any;
    summaries: any = {};
    legalBasis: any[];

    constructor(private route: ActivatedRoute,
        private router: Router,
        private service: DatasetService,
        private codesService: CodesService,
        private themesService: ThemesService,
        private catalogService: CatalogService,
        private http: Http,
        private dialogService: DialogService,
        private formBuilder: FormBuilder,
        private cdr: ChangeDetectorRef) {
    }


  ngOnInit() {
    this.language = 'nb';
    this.availableLanguages = [ // this should be delivered from the server together with index.html (for example)
      {
        uri: "http://publications.europa.eu/resource/authority/language/ENG",
        code: 'ENG',
        prefLabel: {
          nb: 'Engelsk'
        },
        selected: false
      },
      {
        uri: "http://publications.europa.eu/resource/authority/language/NOR",
        code: 'NOR',
        prefLabel: {
          nb: 'Norsk'
        },
        selected: false
      },
      {
        uri: "http://publications.europa.eu/resource/authority/language/SMI",
        code: 'SMI',
        prefLabel: {
          nb: 'Samisk'
        },
        selected: false
      }
    ];
    this.timer = 0;
    var that = this;
    // snapshot alternative
    this.catId = this.route.snapshot.params['cat_id'];

    this.identifiersForm = new FormGroup({});


    this.identifiersForm.addControl("identifiersControl", new FormControl([]));

    let datasetId = this.route.snapshot.params['dataset_id'];
    this.catalogService.get(this.catId).then((catalog: Catalog) => this.catalog = catalog);
    this.service.get(this.catId, datasetId).then((dataset: Dataset) => {
      console.log('dataset from api: ', dataset);
      this.dataset = dataset;
      if (this.dataset.languages) {
        this.availableLanguages.forEach((language, languageIndex, languageArray) => {
          dataset.languages.forEach((datasetLanguage, datasetLanguageIndex, datasetLanguageArray) => {
            if (language.uri === datasetLanguage.uri) {
              languageArray[languageIndex].selected = true;
            }
          })
        })
      }
      this.buildGeoTimeSummaries(this.dataset);

      // Make sure all arrays are set or empty
      // catalog and publisher is set by api
      this.dataset.keywords = this.dataset.keywords || [];
      this.dataset.accessRightsComments = this.dataset.accessRightsComments || [];
      this.dataset.subjects = this.dataset.subjects || [];
      this.dataset.themes = this.dataset.themes || [];
      this.dataset.spatials = this.dataset.spatials || [];
      this.dataset.landingPages = this.dataset.landingPages || [];
      this.dataset.identifiers = this.dataset.identifiers || [];
      this.dataset.contactPoints = this.dataset.contactPoints || [];
      //Only allow one contact point per dataset
      this.dataset.contactPoints[0] = this.dataset.contactPoints[0] || {};
      this.dataset.conformsTos = this.dataset.conformsTos || [];
      this.dataset.distributions = this.dataset.distributions || [];
      this.dataset.samples = this.dataset.samples || [];
      this.dataset.languages = this.dataset.languages || [];
      this.dataset.temporals = this.dataset.temporals || [];
      this.dataset.legalBasisForRestrictions = dataset.legalBasisForRestrictions || [];
      this.dataset.legalBasisForProcessings = dataset.legalBasisForProcessings || [];
      this.dataset.legalBasisForAccesses = dataset.legalBasisForAccesses || [];
      // construct controller
      this.datasetForm = this.toFormGroup(this.dataset);
      
      this.datasetSavingEnabled = false;
      setTimeout(() => this.datasetSavingEnabled = true, this.saveDelay + 2000);
      this.datasetForm.valueChanges // when fetching back data, de-flatten the object
        .subscribe(dataset => {
          console.log('saving dataset:', dataset);

          // converting attributes for saving
          this.dataset.languages = [];
          dataset.checkboxArray.forEach((checkbox, checkboxIndex) => {
            this.availableLanguages.forEach((language, index) => {
              if ((index === checkboxIndex) && checkbox) this.dataset.languages.push(language);
            });
          });

          if (dataset.distributions) {
            dataset.distributions.forEach(distribution => {
              distribution.title = typeof distribution.title === 'object' ? distribution.title : {'nb': distribution.title};
              distribution.description = typeof distribution.description === 'object' ? distribution.description : {'nb': distribution.description};
            })
          }
          if (dataset.samples) {
            dataset.samples.forEach(distribution => {
              distribution.title = typeof distribution.title === 'object' ? distribution.title : {'nb': distribution.title};
              distribution.description = typeof distribution.description === 'object' ? distribution.description : {'nb': distribution.description};
            })
          }
          if (dataset.modified && dataset.modified.formatted) {
            dataset.modified = dataset.modified.formatted.replace(/\./g, "-");
          }
          if (dataset.issued && dataset.issued.formatted) {
              dataset.issued = DatasetComponent.convertDateStringFormat(dataset.issued.formatted, ".", "-");
          }
          
          if (_.isEmpty(dataset.issued)) {
            dataset.issued = null;
          }
          if (_.isEmpty(dataset.modified)) {
            dataset.modified = null;
          }      
          
          console.log("temporals before", dataset.temporals);    
          if (dataset.temporals) {
            dataset.temporals.forEach(temporal => {
                if (temporal.startDate && temporal.startDate.formatted) {
                    temporal.startDate = temporal.startDate.epoc;
                } else {
                    delete temporal.startDate;
                }
                if (temporal.endDate && temporal.endDate.formatted) {
                    temporal.endDate = temporal.endDate.epoc;
                } else {
                    delete temporal.endDate;
                }
            });
            /*for (let i=0; i<dataset.temporals.length; i++) {
                if (!(dataset.temporals[i].startDate) && this.dataset.temporals[i].startDate) {
                    delete this.dataset.temporals[i].startDate;
                }
                if (!(dataset.temporals[i].endDate) === null && this.dataset.temporals[i].endDate) {
                    delete this.dataset.temporals[i].endDate;
                }
            }*/
          } else {
            dataset.temporals = [];
          }
          if(dataset.published){
            this.dataset.registrationStatus = "PUBLISH";
          }else{
            this.dataset.registrationStatus = "DRAFT";
          }
          console.log('dataset.temporals ', dataset.temporals)
          this.dataset = _.merge(this.dataset, dataset);

          
          console.log('this.dataset.temporals ', this.dataset.temporals)
          this.cdr.detectChanges();
          var that = this;
          this.delay(() => {
            if (this.datasetSavingEnabled) {
              that.save.call(that);
            }
          }, this.saveDelay);
        });
    });
  }
    
    buildGeoTimeSummaries(dataset): void {
        this.summaries.geotime = "";

        // Add spatial count to summary if exists.
        if (dataset.spatials && dataset.spatials.length > 0) {
            if (dataset.spatials.length == 1)
                this.summaries.geotime += "1 geografisk avgrensing. ";
            else 
                this.summaries.geotime += dataset.spatials.length + " geografiske avgrensinger. ";
        }
        
        // Add temporal count to summary if exists.
        if (dataset.temporals && dataset.temporals.length > 0) {
            if (dataset.temporals.length == 1) {
                if (dataset.temporals[0].startDate || dataset.temporals[0].endDate) {
                    this.summaries.geotime += "1 tidsmessig avgrensing. ";
                }
            } else {
                let count: number = 0;
                this.dataset.temporals.forEach( temporal => {
                    if (temporal.startDate && temporal.endDate) {
                        count++;
                    }
                });
                if (count > 0) {
                    this.summaries.geotime += dataset.temporals.length + " tidsmessige avgrensinger. ";
                }
            }
        }
        
        // Add issued to summary if exists.
        if (dataset.issued) {
            this.summaries.geotime += "Utgitt den " + DatasetComponent.convertDateStringFormat(dataset.issued, "-", ".") + ". ";
        }
        
        // Add language count to summary if exists.
        if (dataset.languages && dataset.languages.length > 0) {
            if (dataset.languages.length == 1)
                this.summaries.geotime += "Ett språk. ";
            else 
                this.summaries.geotime += dataset.languages.length + " språk. ";
        }

        this.summaries.geotime = this.summaries.geotime || "Klikk for å fylle ut";
    }


   /**
     * Splits on splitChar, then reverse the array to get to swap year and day placement.
     * Return new string separated by toChar.
     * @param dateIn Date string to be formatted.
     * @param splitChar Split date string based on this character
     * @param toChar Returns date string separated by this chaaracter.
     */
    public static convertDateStringFormat(dateIn: string, splitChar: string, toChar: string): string {
        if (dateIn && dateIn.length > 0) {         
            var dateSplit: string[] = dateIn.split(splitChar);

            if (dateSplit.length == 3) {
                dateSplit.forEach(date => {
                    if (date.length == 1) {
                        date = "0" + date;
                    }
                });
                
                return dateSplit[2] + toChar + dateSplit[1] + toChar + dateSplit[0];
            }
            return dateIn;
        }
        return dateIn;
    }

    onSave(ok: boolean): void {
        this.save();
    }

    save(): void {
        this.buildGeoTimeSummaries(this.dataset);
        this.datasetSavingEnabled = false;
        this.service.save(this.catId, this.dataset)
            .then(() => {
                this.saved = true;
                var d = new Date();
                this.lastSaved = ("0" + d.getHours()).slice(-2) + ':' + ("0" + d.getMinutes()).slice(-2) + ':' + ("0" + d.getSeconds()).slice(-2);
                this.datasetSavingEnabled = true;
            })
    }

    valuechange(): void {
        var that = this;
        this.delay(() => {
            if (this.datasetSavingEnabled) {
                that.save.call(that);
            }
        }, this.saveDelay);

    }

    delay(callback, ms): void {
        clearTimeout(this.timer);
        this.timer = setTimeout(callback, ms);
    }

    back(): void {
        this.router.navigate(['/catalogs', this.catId]);
    }

    delete(): void {
        this.service.delete(this.catId, this.dataset)
            .then(() => {
                this.back()
            })
    }

    showConfirmDelete() {
        let disposable = this.dialogService.addDialog(ConfirmComponent, {
            title: 'Slett datasett',
            message: 'Vil du virkelig slette datasett ' + this.dataset.title[this.language] + '?'
        })
            .subscribe((isConfirmed) => {
                //We get dialog result
                if (isConfirmed) {
                    this.delete();
                }
            });
        //If dialog was not closed manually close it by timeout
        setTimeout(() => {
            disposable.unsubscribe();
        }, 10000);
    }


    private getDatasett(): Promise<Dataset> {
        // Insert mock object here.  Likely provided via a resolver in a
        // real world scenario
        let datasetId = this.route.snapshot.params['dataset_id'];
        return this.service.get(this.catId, datasetId);
    }

    private getDateObjectFromUnixTimestamp(timestamp: string) {
        if (!timestamp) {
            return {};
        }
        let date = new Date(timestamp);
        return {
            date: {
                year: date.getFullYear(),
                month: date.getMonth() + 1,
                day: date.getDate()
            },
            formatted: date.getFullYear() + '-' + ('0' + date.getMonth()).slice(-2) + '-' + date.getDate()
        }
    }



  private toFormGroup(data: Dataset): FormGroup {

    const formGroup = this.formBuilder.group({


      description: [data.description],
      catalog: [data.catalog],
      landingPages: [data.landingPages],
      publisher: [data.publisher],
      contactPoints: this.formBuilder.array([]),
      distributions: this.formBuilder.array([]),
      temporals: this.formBuilder.array([]),
      issued: [this.getDateObjectFromUnixTimestamp(data.issued)],
      modified: [this.getDateObjectFromUnixTimestamp(data.modified)],
      samples: this.formBuilder.array([]),
      checkboxArray: this.formBuilder.array(this.availableLanguages.map(s => {
        return this.formBuilder.control(s.selected)
      })),
      published: data.registrationStatus == "PUBLISH"
    });

        return formGroup;
    }
}
