import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {CatalogService} from "./catalog.service";
import "rxjs/add/operator/switchMap";
import {Catalog} from "./catalog";
import {DatasetService} from "../dataset/dataset.service";
import {Dataset} from "../dataset/dataset";


@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css', '../../assets/css/designsystem.css', '../../assets/css/registrering.css']
})
export class CatalogComponent implements OnInit {
  title = 'Registrer katalog';
  catalog: Catalog;
  datasets: Dataset[];
  description: string;
  language: string;
  saved: boolean;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: CatalogService,
    private datasetService: DatasetService
  ) { }

  ngOnInit() {
    this.language = 'nb';
    // snapshot alternative
    let id = this.route.snapshot.params['cat_id'];
    this.service.get(id).then((catalog: Catalog) => this.catalog = catalog);
    this.datasetService.getAll(id).then((datasets: Dataset[]) => this.datasets = datasets);
  }

  save(): void {
    this.service.save(this.catalog)
      .then(() => this.saved = true)
  }

  selectDataset(catalog, dataset) {
    this.router.navigate(['/catalogs', catalog.id, 'datasets', dataset.id]);
  }

  formatDate(dateToFormat: Date): Date {
    if (dateToFormat == null) {
      return new Date('01-01-2000');
    }
    return new Date(dateToFormat);
  }

  getTitle(dataset: Dataset): string {
    if (dataset.title == null) {
      return '';
    }
    return dataset.title[this.language];
  }

  newDataset(): void {
    this.datasetService.create(this.catalog.id)
      .then(dataset => this.selectDataset(this.catalog, dataset));
  }

  back(): void {
    this.router.navigate(['/']);
  }


}
