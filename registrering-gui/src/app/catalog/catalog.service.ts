import {Injectable} from "@angular/core";
import {Catalog} from "./catalog";
import {Http} from "@angular/http";
import "rxjs/add/operator/toPromise";

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

  constructor(private http: Http) {
  }

  //TODO don't hard code
  private catalogsUrl = "http://localhost:8099/catalogs"

  getAll(): Promise<Catalog[]> {
    return this.http.get(this.catalogsUrl)
      .toPromise()
      .then(response => response.json().content as Catalog[])
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any>{
    console.error('An error occured', error); //todo implement proper error handling and logging
    return Promise.reject(error.message || error);
  }

  get(id: string): Promise<Catalog> {
    return this.http.get(this.catalogsUrl + '/' + id)
      .toPromise()
      .then(response => response.json() as Catalog)
      .catch(this.handleError);

    // return Promise.resolve(this.clone(TEST_CATALOGS.find(c => c.id === id)));
  }

  save(catalog: Catalog) {
    let originalCatalog = TEST_CATALOGS.find(c => c.id === catalog.id);
    if (originalCatalog) Object.assign(originalCatalog, catalog)
  }

  private clone(object: any) {
    return JSON.parse(JSON.stringify(object))
  }

}
