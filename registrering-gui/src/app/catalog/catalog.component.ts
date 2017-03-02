import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router, Params} from "@angular/router";
import {CatalogService} from "./catalog.service";
import "rxjs/add/operator/switchMap";
import {Catalog} from "./catalog";

const language = 'nb';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css']
})
export class CatalogComponent implements OnInit {

  catalog: Catalog;
  title: string;
  description: string;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: CatalogService
  ) { }

  ngOnInit() {
    // snapshot alternative
    // let id = this.route.snapshot.params['id'];
    // this.service.get(id).then((catalog: Catalog) => this.catalog = catalog);

    this.route.params
      .switchMap((params: Params) => this.service.get(params['id']))
      .subscribe((catalog: Catalog) => this.catalog = catalog);

    this.title = this.catalog.title[language];
    this.description = this.catalog.description[language];

  }

}
