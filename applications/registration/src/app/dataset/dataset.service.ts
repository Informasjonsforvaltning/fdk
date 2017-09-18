import {Injectable} from "@angular/core";
import {Http, Headers} from "@angular/http";
import "rxjs/add/operator/toPromise";
import {Dataset} from "./dataset";
import {environment} from "../../environments/environment";
import {pluralizeObjectKeys, singularizeObjectKeys} from "../../utilities/pluralizeOrSingularizeObjectKeys";

const TEST_DATASETS: Dataset[] = [
  {
    "id": "1009",
    "title": {
      "nb": "Enhetsregisteret testdatasett"
    },
    "description": {
      "nb": "Datasett med mange attributter"
    },
    "keywords": [{'nb': 'keyword1'}],
    "subjects": ["term1", "term2", "term3"],
    "themes": [],
    "catalog": "974760673",
    "landingPages": ["http://www.brreg.no", "http://www.difi.no"],
    "identifiers": ["http://brreg.no/identifier/1009"],
    "spatials": [{'uri': 'http://sws.geonames.org/3144096/', 'prefLabel': {'nb': 'Norge'}}],
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
    const datasetUrl = `${this.catalogsUrl}/${catId}/${this.datasetPath}?size=1000&page=0`;
    return this.http.get(datasetUrl)
      .toPromise()
      .then(response => {
        if (response.json()._embedded) {
          return response.json()._embedded.datasets as Dataset[]
        }else{
          return [] as Dataset[];
        }
      })
      ;
  }



  get(catId: string, datasetId: string): Promise<Dataset> {
    const datasetUrl = `${this.catalogsUrl}/${catId}/${this.datasetPath}${datasetId}/`;
    return this.http.get(datasetUrl)
      .toPromise()
      .then((response) => {
        const dataset = pluralizeObjectKeys(response.json());
        dataset.distributions = dataset.distributions || []; // use the model to create empty arrays
        return dataset as Dataset
      })
      ;
  }

  save(catId: string, dataset: Dataset): Promise<Dataset> {
    const datasetUrl = `${this.catalogsUrl}/${catId}${this.datasetPath}${dataset.id}/`;

    let authorization: string = localStorage.getItem("authorization");
    this.headers.append("Authorization", "Basic " + authorization);
    let datasetCopy = JSON.parse(JSON.stringify(dataset));
    let payload = JSON.stringify(singularizeObjectKeys(datasetCopy));

    return this.http
      .put(datasetUrl, payload, {headers: this.headers})
      .toPromise()
      .then(() => dataset)
      ;
  }

  delete(catId: string, dataset: Dataset): Promise<Dataset> {
    const datasetUrl = `${this.catalogsUrl}/${catId}${this.datasetPath}${dataset.id}`;

    let authorization: string = localStorage.getItem("authorization");
    this.headers.append("Authorization", "Basic " + authorization);

    return this.http
      .delete(datasetUrl, {headers: this.headers})
      .toPromise()
      .then(() => dataset)
      ;
  }

  create(catId: string): Promise<Dataset> {
    var created: Dataset;

    let authorization: string = localStorage.getItem("authorization");
    this.headers.append("Authorization", "Basic " + authorization);

    const datasetUrl = `${this.catalogsUrl}/${catId}${this.datasetPath}`;
    return this.http
      .post(datasetUrl, {}, {headers: this.headers})
      .toPromise()
      .then(res => res.json())
      ;
  }

  private clone(object: any) {
    return JSON.parse(JSON.stringify(object))
  }

}
