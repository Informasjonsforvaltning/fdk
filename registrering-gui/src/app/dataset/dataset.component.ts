import {Component, OnInit, ViewChild, ChangeDetectorRef} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {FormGroup, FormControl, FormBuilder, FormArray, Validators} from "@angular/forms";
import {DatasetService} from "./dataset.service";
import {CodesService} from "./codes.service";
import {CatalogService} from "../catalog/catalog.service";
import {Dataset} from "./dataset";
import {Catalog} from "../catalog/catalog"
import { Observable } from 'rxjs';
import { Http, Response } from '@angular/http';
import {NgModule} from '@angular/core';
import {environment} from "../../environments/environment";
import {ConfirmComponent} from "../confirm/confirm.component";
import { DialogService } from "ng2-bootstrap-modal";
import {DistributionFormComponent} from "./distribution/distribution.component";
import * as _ from 'lodash';

@Component({
  selector: 'app-dataset',
  templateUrl: './dataset.component.html',
  styleUrls: ['./dataset.component.css', '../../assets/css/designsystem.css', '../../assets/css/registrering.css']
})// class Select

export class DatasetComponent implements OnInit {
  title = 'Registrer datasett';
  dataset: Dataset;
  catalog: Catalog;
  // title: string;
  description: string;
  language: string;
  timer: number;
  saved: boolean;
  catId: string;
  lastSaved: string;

  themesForm: FormGroup;
  accrualPeriodicityForm: FormGroup;
  provenanceForm: FormGroup;

  theme: string[];
  themes: string[];
  frequencies: {value?:string, label?:string}[];
  provenanceControls: {value?:string, label?:string}[];
  fetchedCodeIds: string[] = [];
  codePickers: {pluralizedNameFromCodesService:string, nameFromDatasetModel:string, languageCode:string}[];

  datasetSavingEnabled: boolean = false; // upon page init, saving is disabled

  selection: Array<string>;

  saveDelay:number = 1000;
  distributionsForm: FormGroup; // our form model
  datasetForm: FormGroup = new FormGroup({});


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: DatasetService,
    private codesService: CodesService,
    private catalogService: CatalogService,
    private http: Http,
    private dialogService: DialogService,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {  }


  ngOnInit() {
    this.language = 'nb';
    this.timer = 0;
    var that = this;
    // snapshot alternative
    this.catId = this.route.snapshot.params['cat_id'];
    this.themesForm = new FormGroup({});
    this.themesForm.addControl('themes', new FormControl([])); //initialized with empty values

    this.codePickers = [
      {
        pluralizedNameFromCodesService: 'provenancestatements',
        nameFromDatasetModel: 'provenance',
        languageCode: "nb"
      },
      {
        pluralizedNameFromCodesService: 'frequencies',
        nameFromDatasetModel: 'accrualPeriodicity',
        languageCode: "no"
      }
    ];
    this.initCustomSelectComponents();

    let datasetId = this.route.snapshot.params['dataset_id'];
    this.catalogService.get(this.catId).then((catalog: Catalog) => this.catalog = catalog);
    this.service.get(this.catId, datasetId).then((dataset: Dataset) => {
      this.dataset = dataset;

      this.dataset.keywords = {'nb':['keyword1','keyword1']};
      this.dataset.subject = ['term1', 'term'];

      this.dataset.contactPoints[0] = this.dataset.contactPoints[0] || {};

      //set default publisher to be the same as catalog
      if(this.dataset.publisher == null) {
        //will probably need to be modified later, when publisher is stored as separate object in db
        this.dataset.publisher = this.catalog.publisher;
      }
      this.setCustomSelectValues();
      /* eof */

      this.http
        .get(environment.queryUrl + `/themes`)
        .map(data => data.json().hits.hits.map(item => {
          return {
            value: item._source.id,
            label: item._source.title[this.language]
          }
        })).toPromise().then((data) => {
          this.themes = data;
          this.datasetSavingEnabled = false;
          setTimeout(()=>{
            this.themesForm.setValue ({'themes': this.dataset.themes ? this.dataset.themes.map((tema)=>{return tema.uri}) : []});
          },1)
        });

      this.datasetForm = this.toFormGroup(this.dataset);
      setTimeout(()=>this.datasetSavingEnabled = true, this.saveDelay);
      this.datasetForm.valueChanges // when fetching back data, de-flatten the object
          .subscribe(dataset => {
              if(dataset.distributions) {
                dataset.distributions.forEach((distribution)=>{
                  distribution.title = typeof distribution.title === 'object' ? distribution.title : {'nb': distribution.title};
                })
              }
              this.dataset = _.merge(this.dataset, dataset);
              this.cdr.detectChanges();
              var that = this;
              this.delay(()=>{
                if(this.datasetSavingEnabled){
                  that.save.call(that);
                }
              }, this.saveDelay);
          });

    });
  }


  initCustomSelectComponents() {
    this.codePickers.forEach(codePicker=>{
      const name = codePicker.nameFromDatasetModel;
      const controlName = name + 'Control';
      this[codePicker.pluralizedNameFromCodesService] = [];
      this[name + 'Form'] = new FormGroup({});
      this[name + 'Form'].addControl(controlName, new FormControl(''));
      var valueObject = {};
      valueObject[controlName] = ' ';
      this[name + 'Form'].patchValue(valueObject);
    })
  }
  setCustomSelectValues() {
    this.codePickers.forEach(codePicker=>{
      const name = codePicker.nameFromDatasetModel;
      if(this.dataset[name]) { // if the key doesn't exist, no value need to be set
        const controlName = name + 'Control';
        const valueObject = {};
        valueObject[controlName] = this.dataset[name] ? this.dataset[name].uri : '';
        this[codePicker.pluralizedNameFromCodesService] = [{value:this.dataset[name].uri, label:this.dataset[name].prefLabel[codePicker.languageCode]}];
        setTimeout(()=>this[name + 'Form'].patchValue(valueObject), 1);
      }
    })
  }
  retrieveCustomSelectValues() {
      this.codePickers.forEach(codePicker=>{
        const name = codePicker.nameFromDatasetModel;
          const controlName = name + 'Control';
          const valueObject = {};
          let label:string;
          let uri: string;
          this[codePicker.pluralizedNameFromCodesService].forEach((codeItem)=>{
            if(codeItem.value===this[name + 'Form'].getRawValue()[controlName]) {
              label = codeItem.label;
              uri = codeItem.value;
            };
          })
          const prefLabelObj = {};
          prefLabelObj[codePicker.languageCode] = label;
          this.dataset[name] =  {uri:uri, prefLabel: prefLabelObj};

      })
  }
  fetchCodes (codeId:string): void {
    if (this.fetchedCodeIds.indexOf(codeId.trim()) === -1) {
      this.codesService.get(codeId).then(data => {
        this[codeId] = data.map(code => {
          return {value: code.uri, label: code.prefLabel[this.language] || code.prefLabel['no']}
        });
        this.fetchedCodeIds.push(codeId);
      });
    }
  }

  save(): void {
    this.dataset.themes = this.themesForm.getRawValue().themes.map((uri)=>{
      return {
        "uri": uri
      }
    });
    this.retrieveCustomSelectValues();
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
    this.delay(()=>{
      if(this.datasetSavingEnabled){
        that.save.call(that);
      }
    }, this.saveDelay);

  }

  delay(callback, ms): void {
      clearTimeout (this.timer);
      this.timer = setTimeout(callback, ms);
  }

  back(): void {
    this.router.navigate(['/catalogs', this.catId]);
  }

  delete(): void {
    this.service.delete(this.catId, this.dataset)
      .then(() => {this.back()})
  }

  showConfirmDelete() {
    let disposable = this.dialogService.addDialog(ConfirmComponent, {
      title:'Slett datasett',
      message:'Vil du virkelig slette datasett ' + this.dataset.title[this.language] + '?'})
      .subscribe((isConfirmed)=>{
        //We get dialog result
        if(isConfirmed) {
          this.delete();
        }
      });
    //If dialog was not closed manually close it by timeout
    setTimeout(()=>{
      disposable.unsubscribe();
    },10000);
  }



  private getDatasett(): Promise<Dataset> {
      // Insert mock object here.  Likely provided via a resolver in a
      // real world scenario
      let datasetId = this.route.snapshot.params['dataset_id'];
      return this.service.get(this.catId, datasetId);
  }

  private toFormGroup(data: Dataset): FormGroup {
    const formGroup = this.formBuilder.group({
          //title: title,
          description: [ data.description],
          keywords: [ data.keywords],
          subject: [ data.subject],
          themes: [ data.themes],
          catalog: [ data.catalog],
          accrualPeriodicity: [ data.accrualPeriodicity],
          provenance: [ data.provenance],
          landingPages: [ data.landingPages],
          publisher: [ data.publisher],
          contactPoints: this.formBuilder.array([]),
          distributions: this.formBuilder.array([])
        });

      return formGroup;
  }

  private mergeCustomizer = (objValue, srcValue) => {
      if (_.isArray(objValue)) {
          if (_.isPlainObject(objValue[0]) || _.isPlainObject(srcValue[0])) {
              // If we found an array of objects, take our form values, and
              // attempt to merge them into existing values in the data model,
              // defaulting back to new empty object if none found.
              return srcValue.map(src => {
                  const obj = _.find(objValue, { id: src.id });
                  return _.mergeWith(obj || {}, src, this.mergeCustomizer);
              });
          }
          return srcValue;
      }
  }

}
