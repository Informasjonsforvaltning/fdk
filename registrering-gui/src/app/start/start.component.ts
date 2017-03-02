import {Component, OnInit} from "@angular/core";
import {CatalogService} from "../catalog/catalog.service";
import {Catalog} from "../catalog/catalog";
import {Router} from "@angular/router";

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.css']
})
export class StartComponent implements OnInit {
  catalogs: Catalog[] = [];
  selectedCatalog: Catalog;

  constructor(
    private _catalogService : CatalogService,
    private router : Router
  ) {  }

  ngOnInit() {
    this._catalogService.getAll()
      .then(catalogs => this.catalogs = catalogs);
  }

  selectCatalog(catalog){
    this.router.navigate(['/catalogs', catalog.id])
  }

}
