import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {DatasetService} from "./dataset.service";
import {CatalogService} from "../catalog/catalog.service";
import {Dataset} from "./dataset";

@Component({
  selector: 'app-dataset',
  templateUrl: './dataset.component.html',
  styleUrls: ['./dataset.component.css', '../../assets/css/designsystem.css', '../../assets/css/registrering.css']
})
export class DatasetComponent implements OnInit {
  title = 'Registrer datasett';
  dataset: Dataset;
  // title: string;
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
    let datasetId = this.route.snapshot.params['dataset_id'];
    this.service.get(catId, datasetId).then((dataset: Dataset) => this.dataset = dataset);
  }

}
