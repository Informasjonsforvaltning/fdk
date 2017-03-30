import {Component, OnInit} from "@angular/core";
import {CatalogService} from "../catalog/catalog.service";
import {Catalog} from "../catalog/catalog";
import {Router} from "@angular/router";
import {AuthenticationService} from "../security/authentication.service";

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.css']
})
export class StartComponent implements OnInit {
  catalogs: Catalog[] = [];
  selectedCatalog: Catalog;
  model: any = {};
  loading = false;
  error = '';

  constructor(private _catalogService: CatalogService,
              private router: Router,
              private authenticationService: AuthenticationService) {
  }

  ngOnInit() {
    this._catalogService.getAll()
      .then(catalogs => this.catalogs = catalogs);
    this.authenticationService.logout();
  }

  selectCatalog(catalog) {
    this.router.navigate(['/catalogs', catalog.id])
  }


  login() {
    this.loading = true;
    this.authenticationService.login(this.model.username, this.model.password)
      .subscribe(result => {
        if (result === true) {
          // login successful
          this.router.navigate(['/']);
        } else {
          // login failed
          this.error = 'Innlogging feilet';
          this.loading = false;
        }
      });
  }

}
