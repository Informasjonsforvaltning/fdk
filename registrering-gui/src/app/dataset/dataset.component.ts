import {Component, OnInit} from "@angular/core";
import {Catalog} from "../catalog/catalog";
import {ActivatedRoute, Router} from "@angular/router";
import {DatasetService} from "./dataset.service";
import {CatalogService} from "../catalog/catalog.service";
import {Dataset} from "./dataset";

@Component({
  selector: 'app-dataset',
  templateUrl: './dataset.component.html',
  styleUrls: ['./dataset.component.css']
})
export class DatasetComponent implements OnInit {
  catalog: Catalog;
  dataset: Dataset;
  title: string;
  description: string;
  language: string;
  saved: boolean;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: DatasetService,
    private catalogService: CatalogService
  ) { }

  ngOnInit() {
    this.language = 'nb';
    // snapshot alternative
    let catId = this.route.snapshot.params['cat_id'];
    this.catalogService.get(catId).then((catalog: Catalog) => this.catalog = catalog);
    let datasetId = this.route.snapshot.params['cat_id'];
    this.service.get(catId, datasetId).then((dataset: Dataset) => this.dataset = dataset);
  }

}
