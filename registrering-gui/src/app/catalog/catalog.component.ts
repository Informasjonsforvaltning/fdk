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
    styleUrls: ['./catalog.component.css', '../../assets/css/designsystem.css', '../../assets/css/registrering.css', '../../assets/css/registration.css']
})
export class CatalogComponent implements OnInit {
    title = 'Registrer katalog';
    catalog: Catalog;
    datasets: Dataset[];
    description: string;
    language: string;
    timer: number;
    saved: boolean;
    lastSaved: string;


    constructor(private route: ActivatedRoute,
                private router: Router,
                private service: CatalogService,
                private datasetService: DatasetService) {
    }

    ngOnInit() {
        this.language = 'nb';
        // snapshot alternative
        let id = this.route.snapshot.params['cat_id'];
        this.service.get(id).then((catalog: Catalog) => {
          if(!catalog.description || !catalog.description.nb) {
            catalog.description = {nb: ""}
          }
          if(!catalog.title || !catalog.title.nb) {
            catalog.title = {nb: ""}
          }
          if(!catalog.publisher) {
            catalog.publisher = {name: "", uri: "", id: ""}
          }
          this.catalog = catalog
        });
        this.getAllDatasets();
    }
    getAllDatasets() {
      let id = this.route.snapshot.params['cat_id'];
      this.datasetService.getAll(id).then((datasets: Dataset[]) => {
        this.datasets = datasets.sort(function(a,b) {return (a.title['nb'] > b.title['nb']) ? 1 : ((b.title['nb'] > a.title['nb']) ? -1 : 0);} );
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

    newDataset(): void {
        this.datasetService.create(this.catalog.id)
            .then(dataset => this.selectDataset(this.catalog, dataset));
    }

    back(): void {
        this.router.navigate(['/']);
    }


}
