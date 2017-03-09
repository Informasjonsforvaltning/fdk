import {Injectable} from "@angular/core";
import {Http, Headers} from "@angular/http";
import "rxjs/add/operator/toPromise";
import {Dataset} from "./dataset";

const TEST_DATASETS: Dataset[] = [
  {
    "id" : "1001",
    "title": {
      "nb" : "Enhetsregisteret testdatasett"
    },
    "description": {
      "nb": "Datasett med mange attributter"
    },
    "catalog": "974760673",
    "_lastModified": "2012-04-23"
  }
]

@Injectable()
export class DatasetService {

  constructor(private http: Http) {
  }

  //TODO don't hard code
  private catalogsUrl = "http://localhost:8099/catalogs"
  private datasetPath = "/datasets"

  private headers = new Headers({'Content-Type': 'application/json'});

  getAll(catId: String): Promise<Dataset[]> {
    const datasetUrl = `${this.catalogsUrl}/${catId}/${this.datasetPath}`;
    return this.http.get(datasetUrl)
      .toPromise()
      .then(response => response.json().content as Dataset[])
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any>{
    console.error('An error occured', error); //todo implement proper error handling and logging
    return Promise.reject(error.message || error);
  }

  get(catId: string, datasetId: string): Promise<Dataset> {
    const datasetUrl = `${this.catalogsUrl}/${catId}/${this.datasetPath}/${datasetId}`;
    return this.http.get(datasetUrl)
      .toPromise()
      .then(response => response.json() as Dataset)
      .catch(this.handleError);
  }

  save(catId: string, datasetId: string, dataset: Dataset) : Promise<Dataset> {
    const datasetUrl = `${this.catalogsUrl}/${catId}/${this.datasetPath}/${datasetId}`;
    return this.http
      .put(datasetUrl, JSON.stringify(dataset), {headers: this.headers})
      .toPromise()
      .then(() => dataset)
      .catch(this.handleError)
  }

  private clone(object: any) {
    return JSON.parse(JSON.stringify(object))
  }

}
