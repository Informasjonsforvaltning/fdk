import {Injectable} from "@angular/core";
import {Catalog} from "./catalog";

const TEST_CATALOGS : Catalog[] = [
  {
    "id": "974760673",
    "title": {"nb" : "Datakatalog for Brønnøysundregistrene"},
    "description": {"nb": "Katalog med datasett fra Brønnøysundregistrene"}
  },
  {
    "id": "974761076",
    "title": {"nb" : "Skatteetaten"},
    "description": {"nb": "Katalog med datasett fra Skatt"}
  }
]

@Injectable()
export class CatalogService {

  constructor() { }

  getAll() : Promise<Catalog[]> {
    return Promise.resolve(TEST_CATALOGS.map(c => this.clone(c)));
  }

  get(id: string) : Promise<Catalog> {
    return Promise.resolve(this.clone(TEST_CATALOGS.find(c => c.id === id)));
  }

  save(catalog: Catalog){
    let originalCatalog = TEST_CATALOGS.find(c => c.id === catalog.id);
    if (originalCatalog) Object.assign(originalCatalog, catalog)
  }

  private clone(object: any){
    return JSON.parse(JSON.stringify(object))
  }

}
