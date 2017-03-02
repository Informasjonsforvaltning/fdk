import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {CatalogService} from "./catalog.service";
import "rxjs/add/operator/switchMap";
import {Catalog} from "./catalog";


@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css']
})
export class CatalogComponent implements OnInit {

  catalog: Catalog;
  title: string;
  description: string;
  language: string;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: CatalogService
  ) { }

  ngOnInit() {
    this.language = 'nb';
    // snapshot alternative
    let id = this.route.snapshot.params['id'];
    this.service.get(id).then((catalog: Catalog) => this.catalog = catalog);

  }

}
