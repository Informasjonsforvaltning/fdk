import {Component, OnInit, ViewChild} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {FormGroup, FormControl} from "@angular/forms";
import {DatasetService} from "./dataset.service";
import {CatalogService} from "../catalog/catalog.service";
import {Dataset} from "./dataset";
import {Catalog} from "../catalog/catalog"
import { Observable } from 'rxjs';
import { Http, Response } from '@angular/http';
import {NgModule} from '@angular/core';
import {environment} from "../../environments/environment";
import {ConfirmComponent} from "../confirm/confirm.component";
import { DialogService } from "ng2-bootstrap-modal";

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
  selection: Array<string>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: DatasetService,
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
    this.form.addControl('selectMultiple', new FormControl([]));
    let datasetId = this.route.snapshot.params['dataset_id'];
    this.catalogService.get(this.catId).then((catalog: Catalog) => this.catalog = catalog);
    this.service.get(this.catId, datasetId).then((dataset: Dataset) => {
      this.dataset = dataset;
      this.dataset.keywords = {'nb':['keyword1','keyword1']};
      this.dataset.terms = ['term1', 'term'];

      //set default publisher to be the same as catalog
      if(this.dataset.publisher == null) {
        //will probably need to be modified later, when publisher is stored as separate object in db
        this.dataset.publisher = this.catalog.publisher;
      }

      this.http
          .get(environment.queryUrl + `/themes`)
          .map(data => data.json().hits.hits.map(item => {
            return {
              value: item._source.code,
              label: item._source.title[this.language]
            }
          })).toPromise().then((data)=>{
              this.themes = data;
              setTimeout(()=>this.form.setValue({'selectMultiple':this.dataset.theme.map((tema)=>{return tema.code})}),50)
              this.form.setValue({'selectMultiple':this.dataset.theme.map((tema)=>{return tema.code})});
          });

    });


  }

  save(): void {
    this.dataset.theme = this.form.getRawValue().selectMultiple.map((code)=>{return {code: code}});
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
  };

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
