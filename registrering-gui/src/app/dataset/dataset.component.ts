import {Component, OnInit, ViewChild} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {FormGroup, FormControl} from "@angular/forms";
import {DatasetService} from "./dataset.service";
import {CatalogService} from "../catalog/catalog.service";
import {Dataset} from "./dataset";
import { Observable } from 'rxjs';
import { Http, Response } from '@angular/http';
import {NgModule} from '@angular/core';
import {environment} from "../../environments/environment";

@Component({
  selector: 'app-dataset',
  templateUrl: './dataset.component.html',
  styleUrls: ['./dataset.component.css', '../../assets/css/designsystem.css', '../../assets/css/registrering.css']
})// class Select

export class DatasetComponent implements OnInit {
  title = 'Registrer datasett';
  dataset: Dataset;
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
  valueChangeEnabled: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: DatasetService,
    private catalogService: CatalogService,
    private http: Http
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
    this.service.get(this.catId, datasetId).then((dataset: Dataset) => {
      this.dataset = dataset;
      this.dataset.keywords = {'nb':['keyword1','keyword1']};
      this.dataset.terms = ['term1', 'term'];
      this.http
          .get(environment.queryUrl + `/themes`)
          .map(data => data.json().hits.hits.map(item => {
            return {
              value: item._source.code,
              label: item._source.title[this.language]
            }
          })).toPromise().then((data) => {
              this.themes = data;
              setTimeout(()=>this.form.setValue({'selectMultiple':this.dataset.theme.map((tema)=>{return tema.code})}),1); // wait for selectMultiple to init :(
              this.valueChangeEnabled = true;
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
  valuechange(value): void {
    if(this.valueChangeEnabled) this.delay(()=>this.save.call(this), 1000);
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

}
