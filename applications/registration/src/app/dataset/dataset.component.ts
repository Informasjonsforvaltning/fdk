import {ChangeDetectorRef, Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {DatasetService} from "./dataset.service";
import {CodesService} from "./codes.service";
import {CatalogService} from "../catalog/catalog.service";
import {Dataset} from "./dataset";
import {Catalog} from "../catalog/catalog"
import {Http} from '@angular/http';
import {ConfirmComponent} from "../confirm/confirm.component";
import {DialogService} from "ng2-bootstrap-modal";
import * as _ from 'lodash';
import {ThemesService} from "./themes.service";
import {IMyDpOptions} from 'mydatepicker';
import {AccessRightsService} from "./accessRights/accessRights.service";
import {SkosConcept} from "./skosConcept";
import {DistributionFormComponent} from "./distribution/distribution.component";

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
        private cdr: ChangeDetectorRef,
        private accessRightsService: AccessRightsService) {
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

      // Make sure all arrays are set or empty
      // catalog and publisher is set by api
      this.dataset.title = this.dataset.title || {"nb": ""};
      this.dataset.description = this.dataset.description || {"nb": ""};
      this.dataset.objective = this.dataset.objective || {"nb": ""};
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
      this.dataset.legalBasisForRestrictions = this.dataset.legalBasisForRestrictions || [];
      this.dataset.legalBasisForProcessings = this.dataset.legalBasisForProcessings || [];
      this.dataset.legalBasisForAccesses = this.dataset.legalBasisForAccesses || [];
      this.dataset.informationModels = this.dataset.informationModels || [];
      this.dataset.informationModels[0] = this.dataset.informationModels[0] || {uri: '', prefLabel: {'nb' : ''}};
      // construct controller
      this.datasetForm = this.toFormGroup(this.dataset);

      this.buildSummaries();

      this.datasetSavingEnabled = false;
      setTimeout(() => this.datasetSavingEnabled = true, this.saveDelay + 2000);
      this.datasetForm.valueChanges // when fetching back data, de-flatten the object
        .subscribe(dataset => {

          // converting attributes for saving
          this.dataset.languages = [];
          dataset.checkboxArray.forEach((checkbox, checkboxIndex) => {
            this.availableLanguages.forEach((language, index) => {
              if ((index === checkboxIndex) && checkbox) this.dataset.languages.push(language);
            });
          });

          dataset.distributions = DistributionFormComponent.setDistributions(dataset.distributions);
          console.log(dataset.samples);
          dataset.samples = DistributionFormComponent.setDistributions(dataset.samples);
          console.log(dataset.samples);

          if (dataset.issued && dataset.issued.formatted) {
              dataset.issued = DatasetComponent.convertDateStringFormat(dataset.issued.formatted, ".", "-");
          }

          if (_.isEmpty(dataset.issued)) {
            dataset.issued = null;
          }

          if (dataset.temporals) {
            dataset.temporals.forEach(temporal => {
                if (temporal.startDate && temporal.startDate.epoc && !_.isEmpty(temporal.startDate)) {
                    temporal.startDate = temporal.startDate.epoc;
                    if (temporal.startDate.toString().length === 10) {
                        temporal.startDate = parseInt(temporal.startDate.toString() + "000");
                    }
                } else {
                    delete temporal.startDate;
                }
                if (temporal.endDate && temporal.endDate.epoc && !_.isEmpty(temporal.endDate)) {
                    temporal.endDate = temporal.endDate.epoc;
                    if (temporal.endDate.toString().length === 10) {
                        temporal.endDate = parseInt(temporal.endDate.toString() + "000");
                    }
                } else {
                    delete temporal.endDate;
                }
            });

          } else {
            dataset.temporals = [];
          }

          if(dataset.published){
            this.dataset.registrationStatus = "PUBLISH";
          }else{
            this.dataset.registrationStatus = "DRAFT";
          }
          this.dataset = _.merge(this.dataset, dataset);
          this.buildSummaries();
          this.cdr.detectChanges();
          var that = this;
          this.delay(() => {
            if (this.datasetSavingEnabled) {
              that.save.call(that);
            }
          }, this.saveDelay);
        });
    })
  }
  buildSummaries() {
    this.buildGeoTimeSummaries();
    this.buildProvenanceSummary();
    this.buildInformationModelSummary();
    this.buildAccessRightsSummary();
  }

    buildInformationModelSummary(): void {
        // Add informationModel to summary if exists.
        if (this.dataset.informationModels && this.dataset.informationModels[0] && this.dataset.informationModels[0].prefLabel && this.dataset.informationModels[0].prefLabel["nb"]) {
            this.summaries.informationModel = this.dataset.informationModels[0].prefLabel["nb"];
        } else {
            this.summaries.informationModel = "Klikk for å fylle ut";
        }
    }

  buildAccessRightsSummary(): void {
    // Add informationModel to summary if exists.
    if (this.dataset.accessRights) {
      this.summaries.accessRights = this.accessRightsService.get(this.dataset.accessRights.uri).label;
    } else {
      this.summaries.accessRights = "Klikk for å fylle ut";
    }
  }

    buildGeoTimeSummaries(): void {
        this.summaries.geotime = "";

        // Add spatial count to summary if exists.
        if (this.dataset.spatials && this.dataset.spatials.length > 0) {
            if (this.dataset.spatials.length == 1)
                this.summaries.geotime += "1 geografisk avgrensing. ";
            else
                this.summaries.geotime += this.dataset.spatials.length + " geografiske avgrensinger. ";
        }

        // Add temporal count to summary if exists.
        if (this.dataset.temporals && this.dataset.temporals.length > 0) {
            if (this.dataset.temporals.length == 1) {
                if (this.dataset.temporals[0].startDate || this.dataset.temporals[0].endDate) {
                    this.summaries.geotime += "1 tidsmessig avgrensing. ";
                }
            } else {
                let count: number = 0;
                this.dataset.temporals.forEach( temporal => {
                    if (temporal.startDate || temporal.endDate) {
                        count++;
                    }
                });
                if (count > 0) {
                    this.summaries.geotime += count + " tidsmessige avgrensinger. ";
                }
            }
        }

        // Add issued to summary if exists.
        if (this.dataset.issued) {
            this.summaries.geotime += "Utgitt den " + DatasetComponent.convertDateStringFormat(this.dataset.issued, "-", ".") + ". ";
        }

        // Add language count to summary if exists.
        if (this.dataset.languages && this.dataset.languages.length > 0) {
            if (this.dataset.languages.length == 1)
                this.summaries.geotime += "Ett språk. ";
            else
                this.summaries.geotime += this.dataset.languages.length + " språk. ";
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
        this.datasetSavingEnabled = false;
        this.service.save(this.catId, this.dataset)
            .then(() => {
                this.saved = true;
                var d = new Date();
                this.lastSaved = ("0" + d.getHours()).slice(-2) + ':' + ("0" + d.getMinutes()).slice(-2) + ':' + ("0" + d.getSeconds()).slice(-2);
                this.datasetSavingEnabled = true;
            })
          .catch(error => {
            console.log(error);
            this.showModal(
              `Error: ${error.status}`,
              `Det har skjedd en feil ved lagring av data til registration-api. Vennligst prøv igjen senere`,
              false
            );
          });
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

    showModal(title, text, showFooter) {
      let disposable = this.dialogService.addDialog(ConfirmComponent, {
        title: title,
        message: text,
        showFooter: showFooter
      })
        .subscribe((isClose) => {
          this.datasetSavingEnabled = true;
          this.back();
        })
    }


    private getDatasett(): Promise<Dataset> {
        // Insert mock object here.  Likely provided via a resolver in a
        // real world scenario
        let datasetId = this.route.snapshot.params['dataset_id'];
        return this.service.get(this.catId, datasetId);
    }

    public static getDateObjectFromUnixTimestamp(timestamp: string): any {
        if (!timestamp) {
            return {};
        }
        let timestamp2 = parseInt(timestamp);
        if (timestamp2.toString().length === 10) {
            timestamp2 = parseInt(timestamp.toString() + "000");

        }
        let date = new Date(timestamp2);
        return {
            date: {
                year: date.getFullYear(),
                month: date.getMonth() + 1,
                day: date.getDate()
            },
            formatted: date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + date.getDate()
        }
    }

  public buildContentSummary() {
    this.summaries.content = "";

    if (this.dataset.conformsTos[0] && this.dataset.conformsTos[0].prefLabel) {
        this.summaries.content = this.dataset.conformsTos[0].prefLabel['nb'] + ". ";
    }

    if (this.dataset.hasRelevanceAnnotation &&  this.dataset.hasRelevanceAnnotation.hasBody && this.dataset.hasRelevanceAnnotation.hasBody['no'] !== "") {
      this.summaries.content += this.dataset.hasRelevanceAnnotation.hasBody['no'] + ". ";
    }

    if (this.dataset.hasCompletenessAnnotation && this.dataset.hasCompletenessAnnotation.hasBody && this.dataset.hasCompletenessAnnotation.hasBody['no']  !== "") {
      this.summaries.content += this.dataset.hasCompletenessAnnotation.hasBody['no'] + ". ";
    }

    if (this.dataset.hasAccuracyAnnotation && this.dataset.hasAccuracyAnnotation.hasBody && this.dataset.hasAccuracyAnnotation.hasBody['no']  !== "") {
      this.summaries.content += this.dataset.hasAccuracyAnnotation.hasBody['no'] + ". ";
    }

    if (this.dataset.hasAvailabilityAnnotation && this.dataset.hasAvailabilityAnnotation.hasBody &&this.dataset.hasAvailabilityAnnotation.hasBody['no'] !== "") {
      this.summaries.content += this.dataset.hasAvailabilityAnnotation.hasBody['no'] + ". ";
    }

  }


  public buildProvenanceSummary() {
      let provenance = "";
      if (this.dataset.provenance && this.dataset.provenance.prefLabel && this.dataset.provenance.prefLabel['nb'] !== '') {
        provenance = this.dataset.provenance.prefLabel['nb'];
      }
      let frequency   = "";
      if (this.dataset.accrualPeriodicity && this.dataset.accrualPeriodicity.prefLabel && this.dataset.accrualPeriodicity.prefLabel['no'] !== '') {
        frequency = this.dataset.accrualPeriodicity.prefLabel['no'];
      }

      let modified    = this.dataset.modified ? this.dataset.modified : '';

      let currentness = "";
      if (this.dataset.hasCurrentnessAnnotation && this.dataset.hasCurrentnessAnnotation.hasBody && this.dataset.hasCurrentnessAnnotation.hasBody['no'] !== ''){
        currentness = this.dataset.hasCurrentnessAnnotation.hasBody['no'];
      }

      this.summaries.provenance = "";
      if (provenance.length > 0) {
        this.summaries.provenance =  provenance ;
      }
      if (frequency.length > 0) {
        this.summaries.provenance += " " +frequency;
      }
      if (modified.length > 0) {
        this.summaries.provenance += " " + DatasetComponent.convertDateStringFormat(modified, "-", ".");
      }

      if (currentness.length > 0) {
        this.summaries.provenance += " " + currentness;
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
      issued: [DatasetComponent.getDateObjectFromUnixTimestamp(data.issued)],
      samples: this.formBuilder.array([]),
      references: this.formBuilder.array([]),
      checkboxArray: this.formBuilder.array(this.availableLanguages.map(s => {
        return this.formBuilder.control(s.selected)
      })),
      published: data.registrationStatus == "PUBLISH"
    });

        return formGroup;
    }
}
