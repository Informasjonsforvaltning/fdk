import {Component, OnInit, ViewChild} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {FormGroup, FormControl} from "@angular/forms";
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
import {Distribution} from "../distribution/distribution";

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

  form: FormGroup;

  themes: string[];
  frequencies: {value?:string, label?:string}[];
  provenancestatements: {value?:string, label?:string}[];
  fetchedCodeIds: string[] = [];

  selection: Array<string>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: DatasetService,
    private codesService: CodesService,
    private catalogService: CatalogService,
    private http: Http,
    private dialogService: DialogService
  ) {  }

  ngOnInit() {
    this.language = 'nb';
    this.timer = 0;
    var that = this;
    // snapshot alternative
    this.catId = this.route.snapshot.params['cat_id'];
    this.form = new FormGroup({});
    this.form.addControl('themes', new FormControl([])); //initialized with empty values
    this.form.addControl('accrualPeriodicityControl', new FormControl(''));
    this.form.addControl('provenanceStatementControl', new FormControl(''));

    let datasetId = this.route.snapshot.params['dataset_id'];
    this.catalogService.get(this.catId).then((catalog: Catalog) => this.catalog = catalog);
    this.service.get(this.catId, datasetId).then((dataset: Dataset) => {
      this.dataset = dataset;
      this.dataset.keywords = {'nb':['keyword1','keyword1']};
      this.dataset.subject = ['term1', 'term'];

      //set default publisher to be the same as catalog
      if(this.dataset.publisher == null) {
        //will probably need to be modified later, when publisher is stored as separate object in db
        this.dataset.publisher = this.catalog.publisher;
      }
      this.dataset.contactPoint = this.dataset.contactPoint;
      this.dataset.contactPoint[0] = this.dataset.contactPoint[0] || {organizationName:"", organizationUnit:""};

      this.http
        .get(environment.queryUrl + `/themes`)
        .map(data => data.json().hits.hits.map(item => {
          return {
            value: item._source.id,
            label: item._source.title[this.language]
          }
        })).toPromise().then((data) => {
          this.themes = data;
        if(this.dataset.accrualPeriodicity) {
          this.frequencies = [{value:this.dataset.accrualPeriodicity.uri, label:this.dataset.accrualPeriodicity.prefLabel["no"]}];
        }
        if(this.dataset.provenance) {
          this.provenancestatements = [{value:this.dataset.provenance.uri, label:this.dataset.provenance.prefLabel["nb"]}];
        }
          setTimeout(()=>this.form.setValue (
            {
              'themes': this.dataset.theme ? this.dataset.theme.map((tema)=>{return tema.uri}) : [],
              'accrualPeriodicityControl': this.dataset.accrualPeriodicity ? this.dataset.accrualPeriodicity.uri : '',
              'provenanceStatementControl':this.dataset.provenance ? this.dataset.provenance.uri : ''
            }
          ),1)
        });
    });
  }

  fetchCodes (codeId:string): void {
    if (this.fetchedCodeIds.indexOf(codeId.trim()) === -1) {
      console.log('get!');
      this.codesService.get(codeId).then(data => {
        this[codeId] = data.map(code => {
          return {value: code.uri, label: code.prefLabel[this.language] || code.prefLabel['no']}
        });
        this.fetchedCodeIds.push(codeId);
      });
    }
  }

  save(): void {


    this.dataset.theme = this.form.getRawValue().themes.map((uri)=>{

      return {
        "uri": uri
      }
    });
    if(this.frequencies) {
      let frequencyLabel:string;
      this.frequencies.forEach(freqItem=>{
        if(freqItem.value===this.form.getRawValue().accrualPeriodicityControl) frequencyLabel = freqItem.label;
        console.log(freqItem,this.form.getRawValue().accrualPeriodicityControl)
      });
      console.log('frequencyLabel', frequencyLabel);
      this.dataset.accrualPeriodicity =  {uri:this.form.getRawValue().accrualPeriodicityControl, prefLabel: {"no": frequencyLabel}};
    }

    if(this.provenancestatements) {
        let provenancestatementLabel:string;
        this.provenancestatements.forEach(provenancestatementItem=>{
          if(provenancestatementItem.value===this.form.getRawValue().provenanceStatementControl)
            provenancestatementLabel = provenancestatementItem.label;
        });
        console.log('provenancestatementLabel', provenancestatementLabel);
        this.dataset.provenance =  {uri:this.form.getRawValue().provenanceStatementControl, prefLabel: {"nb": provenancestatementLabel}};
    }



    this.service.save(this.catId, this.dataset)
      .then(() => {
        this.saved = true;
        var d = new Date();
        this.lastSaved = ("0" + d.getHours()).slice(-2) + ':' + ("0" + d.getMinutes()).slice(-2) + ':' + ("0" + d.getSeconds()).slice(-2);
      })
  }

  valuechange(a,b,c): void {
    var that = this;
    this.delay(function() {that.save.call(that)}, 1000);
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
}
