import {Injectable} from "@angular/core";
import {Http, Headers} from "@angular/http";
import "rxjs/add/operator/toPromise";
import {Dataset} from "./dataset";
import {environment} from "../../environments/environment";
import {pluralizeObjectKeys, singularizeObjectKeys} from "../../utilities/pluralizeOrSingularizeObjectKeys";

const TEST_DATASETS: Dataset[] = [
  {
    "id" : "1009",
    "title": {
      "nb" : "Enhetsregisteret testdatasett"
    },
    "description": {
      "nb": "Datasett med mange attributter"
    },
    "keywords": {'nb':['keyword1','keyword1']},
    "subject":["term1", "term2", "term3"],
    "themes":[],
    "catalog": "974760673",
    "landingPages" : ["http://www.brreg.no", "http://www.difi.no"],
    "_lastModified": "2012-04-23"
  }
]

@Injectable()
export class DatasetService {

  constructor(private http: Http) {
  }

  private catalogsUrl = environment.api + "/catalogs"
  private datasetPath = "/datasets/"

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
      const datasetUrl = `${this.catalogsUrl}/${catId}/${this.datasetPath}${datasetId}/`;
      return this.http.get(datasetUrl)
        .toPromise()
        .then(response => pluralizeObjectKeys(response.json()) as Dataset)
        .catch(this.handleError);
  }

  save(catId: string, dataset: Dataset) : Promise<Dataset> {
    const datasetUrl = `${this.catalogsUrl}/${catId}${this.datasetPath}${dataset.id}/`;

    let authorization : string = localStorage.getItem("authorization");
    this.headers.append("Authorization", "Basic " + authorization);

    return this.http
      .put(datasetUrl, JSON.stringify(singularizeObjectKeys(dataset)), {headers: this.headers})
      .toPromise()
      .then(() => dataset)
      .catch(this.handleError)
  }

  delete(catId: string, dataset: Dataset) : Promise<Dataset> {
    const datasetUrl = `${this.catalogsUrl}/${catId}${this.datasetPath}${dataset.id}`;

    let authorization : string = localStorage.getItem("authorization");
    this.headers.append("Authorization", "Basic " + authorization);

    return this.http
      .delete(datasetUrl, {headers: this.headers})
      .toPromise()
      .then(() => dataset)
      .catch(this.handleError)
  }

  create(catId: string) : Promise<Dataset> {
    var created: Dataset;

    let authorization : string = localStorage.getItem("authorization");
    this.headers.append("Authorization", "Basic " + authorization);

    const datasetUrl = `${this.catalogsUrl}/${catId}${this.datasetPath}`;
    return this.http
      .post(datasetUrl, {}, {headers: this.headers})
      .toPromise()
      .then(res => res.json())
      .catch(this.handleError)
  }

  private clone(object: any) {
    return JSON.parse(JSON.stringify(object))
  }

}
