import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {CatalogService} from "./catalog.service";
import "rxjs/add/operator/switchMap";
import {Catalog} from "./catalog";
import {DatasetService} from "../dataset/dataset.service";
import {Dataset} from "../dataset/dataset";
import {ModalComponent} from "../modal/modal.component";
import * as _ from "lodash";
import {LocalStorage, LocalStorageService} from 'ngx-webstorage';


@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css']
})
export class CatalogComponent implements OnInit {
  title = 'Registrer katalog';
  catalog: Catalog;
  datasets: Dataset[] = [];
  description: string;
  language: string;
  timer: number;
  saved: boolean;
  lastSaved: string;
  import: any = {};

  @LocalStorage() sortDatasetOn: string;
  @LocalStorage() sortDatasetOrderAscending: boolean;
  neverSorted: boolean = true;


  constructor(private route: ActivatedRoute,
              private router: Router,
              private service: CatalogService,
              private datasetService: DatasetService) {
  }

  ngOnInit() {
    if (!this.sortDatasetOn) {
      this.sortDatasetOn = "title";
    }
    if (this.sortDatasetOrderAscending == null) {
      this.sortDatasetOrderAscending = true;
    }


    this.language = 'nb';
    // snapshot alternative
    let id = this.route.snapshot.params['cat_id'];
    this.service.get(id).then((catalog: Catalog) => {
      if (!catalog.description || !catalog.description.nb) {
        catalog.description = {nb: ""}
      }
      if (!catalog.title || !catalog.title.nb) {
        catalog.title = {nb: ""}
      }
      if (!catalog.publisher) {
        catalog.publisher = {name: "", uri: "", id: ""}
      }
      this.catalog = catalog
    });
    this.getAllDatasets();
  }

  getAllDatasets() {
    let id = this.route.snapshot.params['cat_id'];
    this.datasetService.getAll(id).then((datasets: Dataset[]) => {

      this.datasets = datasets;
      this.sortDatasets();

    });
  }

  save(): void {
    this.service.save(this.catalog)
      .then(() => {
        this.saved = true
        var d = new Date();
        this.lastSaved = ("0" + d.getHours()).slice(-2) + ':' + ("0" + d.getMinutes()).slice(-2) + ':' + ("0" + d.getSeconds()).slice(-2);
      })
  }

  selectDataset(catalog, dataset) {
    this.router.navigate(['/catalogs', catalog.id, 'datasets', dataset.id]);
  }

  deleteDataset(catalog, dataset): void {
    this.datasetService.delete(catalog.id, dataset)
      .then(() => {
        this.getAllDatasets();
        console.log('deleted!');
      })
  }

  formatDate(dateToFormat: Date): Date {
    if (dateToFormat == null) {
      return new Date('01-01-2000');
    }
    return new Date(dateToFormat);
  }

  valuechange(a, b, c): void {
    var that = this;
    this.delay(function () {
      that.save.call(that)
    }, 1000);
  }

  delay(callback, ms): void {
    clearTimeout(this.timer);
    this.timer = setTimeout(callback, ms);
  };

  getTitle(dataset: Dataset): string {
    if (dataset.title == null) {
      return '';
    }
    return dataset.title[this.language];
  }

  newDataset(): boolean {
    this.datasets.unshift(<Dataset>{
      id: "",
      _lastModified: "",
      title: {nb: "Laster ..."},
      catalog: "",
      "identifiers": [""]
    });
    this.datasetService.create(this.catalog.id)
      .then(dataset => this.selectDataset(this.catalog, dataset));

    return false;
  }

  back(): void {
    this.router.navigate(['/']);
  }


  modalAbort(modal): void {
    modal.hide();
    this.import = {};
  }

  datasetImport(modal): void {

    if (this.import.datasetImportUrl && this.import.datasetImportUrl != "") {
      this.import.importLoading = true;
      this.service.import(this.catalog, this.import.datasetImportUrl).then(() => {
        modal.hide();
        this.import.importLoading = false;
        this.getAllDatasets();

      }).catch((error) => {
        this.import.importLoading = false;
        this.import.importErrorMessage = "Ukjent feil";
        try {
          this.import.importErrorMessage = JSON.parse(error._body).message;
        } catch (error) {
          console.error(error);
        }
      });
    } else {
      this.import.importErrorMessage = "URL kan ikke være tom";
    }

  }


  registrationStatus: { [key: string]: { [key: string]: string } } = {
    "DRAFT": {
      nb: "Utkast",
      color: "var(--color4)"
    },
    "PUBLISH": {
      nb: "Publisert",
      color: "var(--color-green)"
    }
  };

  getColorForRegistrationStatus(status: any): String {
    return this.registrationStatus[status].color;
  }

  getTextForRegistrationStatus(status: any): String {
    return this.registrationStatus[status][this.language];
  }

  sortDatasetsOn(field: any): void {
    if (field !== this.sortDatasetOn) {
      this.sortDatasetOn = field;
      this.sortDatasetOrderAscending = true;
    } else {
      this.sortDatasetOrderAscending = !this.sortDatasetOrderAscending;
    }

    this.sortDatasets();
  }

  private sortDatasets() {

    if (this.sortDatasetOn === "title") {
      this.datasets = _.sortBy(this.datasets, [a => this.getTextForRegistrationStatus(a.registrationStatus)]);
      this.datasets = _.sortBy(this.datasets, [a => a.title.nb || ""]);
    }

    else if (this.sortDatasetOn === "registrationStatus") {
      this.datasets = _.sortBy(this.datasets, [a => a.title.nb || ""]);
      this.datasets = _.sortBy(this.datasets, [a => this.getTextForRegistrationStatus(a.registrationStatus)]);
    }

    if (!this.sortDatasetOrderAscending) {
      this.datasets = this.datasets.reverse()
    }

  }


}
