import {Injectable, ErrorHandler} from "@angular/core";
import {Http, Headers} from "@angular/http";
import "rxjs/add/operator/toPromise";
import {Dataset} from "./dataset";
import {environment} from "../../environments/environment";
import {pluralizeObjectKeys, singularizeObjectKeys} from "../../utilities/pluralizeOrSingularizeObjectKeys";

const TEST_DATASETS: Dataset[] = [
  {
    "id": "1009",
    "uri": "http://brreg/catalogs/1/datasets/1",
    "title": {
      "nb": "Enhetsregisteret testdatasett"
    },
    "description": {
      "nb": "Datasett med mange attributter"
    },
    "keywords": [{'nb': 'keyword1'}],
    "subjects": [{"uri":"https://data-david.github.io/Begrep/begrep/Hovedenhet","prefLabel":{"no":"hovedenhet"}}],
    "themes": [],
    "catalogId": "974760673",
    "landingPages": ["http://www.brreg.no", "http://www.difi.no"],
    "identifiers": ["http://brreg.no/identifier/1009"],
    "spatials": [{'uri': 'http://sws.geonames.org/3144096/', 'prefLabel': {'nb': 'Norge'}}],
    "_lastModified": "2012-04-23"
  }
]

@Injectable()
export class DatasetService {

  constructor(private http: Http, private errorHandler: ErrorHandler) {
  }

  private catalogsUrl = environment.api + "/catalogs"
  private datasetPath = "datasets/"

  private headers = new Headers({'Content-Type': 'application/json', 'Accept': 'application/json'});

  getAll(catId: String): Promise<any> {
    const datasetUrl = `${this.catalogsUrl}/${catId}/${this.datasetPath}?size=1000&page=0`;
    return this.http.get(datasetUrl,  {headers: this.headers})
      .toPromise()
      .then(response => {
        if (response.json()._embedded) {
          return response.json()._embedded.datasets as Dataset[]
        }else{
          return [] as Dataset[];
        }
      })
      .catch(this.errorHandler.handleError)
      ;
  }



  get(catId: string, datasetId: string): Promise<Dataset | void> {
    const datasetUrl = `${this.catalogsUrl}/${catId}/${this.datasetPath}${datasetId}/`;
    return this.http.get(datasetUrl, {headers: this.headers})
      .toPromise()
      .then((response) => {
        const dataset = pluralizeObjectKeys(response.json());
        return dataset as Dataset
      })
      .catch(this.errorHandler.handleError)
      ;
  }

  save(catId: string, dataset: Dataset): Promise<Dataset | void> {
    const datasetUrl = `${this.catalogsUrl}/${catId}${this.datasetPath}${dataset.id}/`;
    let authorization: string = localStorage.getItem("authorization");
    this.headers.append("Authorization", "Basic " + authorization);
    let datasetCopy = JSON.parse(JSON.stringify(dataset));
    let payload = JSON.stringify(singularizeObjectKeys(datasetCopy));
    /*
    special treatment for field dcat:references
    - it is spelled "plural-like" and is unintentionally singularized
    it therfore has to be changed back to its correct form

    singularize does not singularize plurals of null object.
    Any list that has a plural name, but has null value will not have its name singularized.
    Therefore all plural names
    */
    payload = payload.replace('"identifiers":', '"identifier":');
    payload = payload.replace('"samples":', '"sample":');
    payload = payload.replace('"distributions":', '"distribution":');
    payload = payload.replace('"contactPoints":', '"contactPoint":');
    payload = payload.replace('"accessRightsComments":', '"accessRightsComment":');
    payload = payload.replace('"conformsTos":', '"conformsTo":');
    payload = payload.replace('"informationModels":', '"informationModel":');
    payload = payload.replace('"keywords":', '"keyword":');
    payload = payload.replace('"accessRight":', '"accessRights":');
    payload = payload.replace('"landingPages":', '"landingPage":');
    payload = payload.replace('"languages":', '"language":');
    payload = payload.replace('"legalBasisForAccesses":', '"legalBasisForAccess":');
    payload = payload.replace('"legalBasisForProcessings":', '"legalBasisForProcessing":');
    payload = payload.replace('"legalBasisForRestrictions":', '"legalBasisForRestriction":');
    payload = payload.replace('"reference":', '"references":');
    payload = payload.replace('"spatials":', '"spatial":');
    payload = payload.replace('"subjects":', '"subject":');
    payload = payload.replace('"temporals":', '"temporal":');
    payload = payload.replace('"themes":', '"theme":');
    return this.http
      .put(datasetUrl, payload, {headers: this.headers})
      .toPromise()
      .then(() => dataset)
      .catch(this.errorHandler.handleError)
      ;
  }

  delete(catId: string, dataset: Dataset): Promise<Dataset | void> {
    const datasetUrl = `${this.catalogsUrl}/${catId}/${this.datasetPath}${dataset.id}`;

    let authorization: string = localStorage.getItem("authorization");
    this.headers.append("Authorization", "Basic " + authorization);

    return this.http
      .delete(datasetUrl, {headers: this.headers})
      .toPromise()
      .then(() => dataset)
      .catch(this.errorHandler.handleError)
      ;
  }

  create(catId: string): Promise<Dataset> {
    var created: Dataset;

    let authorization: string = localStorage.getItem("authorization");
    this.headers.append("Authorization", "Basic " + authorization);

    const datasetUrl = `${this.catalogsUrl}/${catId}/${this.datasetPath}`;
    return this.http
      .post(datasetUrl, {}, {headers: this.headers})
      .toPromise()
      .then(res => res.json())
      .catch(this.errorHandler.handleError)
      ;
  }

  private clone(object: any) {
    return JSON.parse(JSON.stringify(object))
  }

}
