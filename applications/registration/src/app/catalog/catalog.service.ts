import {Injectable} from "@angular/core";
import {Catalog} from "./catalog";
import {Headers, Http} from "@angular/http";
import "rxjs/add/operator/toPromise";
import {AuthenticationService} from "../security/authentication.service";
import {Router} from "@angular/router";
import {environment} from "../../environments/environment";

const TEST_CATALOGS: Catalog[] = [
  {
    "id": "974760673",
    "title": {"nb": "Datakatalog for Brønnøysundregistrene"},
    "description": {"nb": "Katalog med datasett fra Brønnøysundregistrene"}
  },
  {
    "id": "974761076",
    "title": {"nb": "Skatteetaten"},
    "description": {"nb": "Katalog med datasett fra Skatt"}
  }
]

@Injectable()
export class CatalogService {

  constructor(private http: Http,
              private router: Router,
              private authenticationService: AuthenticationService) {
  }

  //TODO don't hard code
  private catalogsUrl = environment.api + "/catalogs"
  private headers = new Headers({'Content-Type': 'application/json'});

  getAll(): Promise<Catalog[]> {
      let authorization : string = localStorage.getItem("authorization");
      this.headers.append("Authorization", "Basic " + authorization);

    return this.http
        .get(this.catalogsUrl + '?page=0&size=1000', {headers: this.headers})
        .toPromise()
        .then(response => {
          if(response.json()._embedded){
            return response.json()._embedded.catalogs as Catalog[]
          }else {
            return [] as Catalog[];
          }

        });
  }



  get(id: string): Promise<Catalog> {
    const url = `${this.catalogsUrl}/${id}/`
    return this.http.get(url)
      .toPromise()
      .then(response => response.json() as Catalog);
  }

  save(catalog: Catalog) : Promise<Catalog> {
    const url = `${this.catalogsUrl}/${catalog.id}/`

    let authorization : string = localStorage.getItem("authorization");
    this.headers.append("Authorization", "Basic " + authorization);

    return this.http
      .put(url, JSON.stringify(catalog), {headers: this.headers})
      .toPromise()
      .then(() => catalog);
  }

  import(catalog: Catalog, url: string) : Promise<Catalog> {
      const postUrl = `${this.catalogsUrl}/${catalog.id}/import`;

      let authorization : string = localStorage.getItem("authorization");
      this.headers.append("Authorization", "Basic " + authorization);

      return this.http
          .post(postUrl, url, {headers: this.headers})
          .toPromise()
          .then(() => catalog);

  }

  private clone(object: any) {
    return JSON.parse(JSON.stringify(object))
  }

}
