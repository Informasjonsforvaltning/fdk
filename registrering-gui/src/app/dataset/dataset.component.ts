import {Component, OnInit, ViewChild} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {FormGroup, FormControl} from "@angular/forms";
import {DatasetService} from "./dataset.service";
import {CatalogService} from "../catalog/catalog.service";
import {Dataset} from "./dataset";
import { Observable } from 'rxjs';
import { Http, Response } from '@angular/http';
import {NgModule} from '@angular/core';

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
  saved: boolean;
  catId: string;
  tags:any;

  form: FormGroup;

  themes: Array<any>;
  selection: Array<string>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: DatasetService,
    private catalogService: CatalogService,
    private http: Http
  ) {  }

  ngOnInit() {
    this.language = 'nb';
    // snapshot alternative
    this.catId = this.route.snapshot.params['cat_id'];
    let datasetId = this.route.snapshot.params['dataset_id'];
    this.service.get(this.catId, datasetId).then((dataset: Dataset) => this.dataset = dataset);

    this.http
        .get(`http://localhost:8083/themes`)
        .map(data => data.json().hits.hits.map(item => {
          return {
            value: item._source.code,
            label: item._source.title[this.language]
          }
        })).toPromise().then((data)=>this.themes = data);

    this.form = new FormGroup({});
    this.form.addControl('selectMultiple', new FormControl(''));
  }

  save(): void {
    this.service.save(this.catId, this.dataset)
      .then(() => this.saved = true)
  }

  back(): void {
    this.router.navigate(['/catalogs', this.catId]);
  }

}
