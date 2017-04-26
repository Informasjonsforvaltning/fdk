import {Injectable} from "@angular/core";
import {Http, Headers} from "@angular/http";
import "rxjs/add/operator/toPromise";
import {environment} from "../../environments/environment";


@Injectable()
export class CodesService {

  constructor(private http: Http) {
  }

  //private codesUrl = environment.api + "/codes";
  private codesUrl = "http://fdkapi.getforge.io/static";

  private headers = new Headers({'Content-Type': 'application/json'});

  private handleError(error: any): Promise<any>{
    console.error('An error occured', error); //todo implement proper error handling and logging
    return Promise.reject(error.message || error);
  }

  get(codeType: string): Promise<any> {
      const datasetUrl = `${this.codesUrl}/${codeType}.html`;
      return this.http.get(datasetUrl)
        .toPromise()
        .then(response => response.json())
        .catch(this.handleError);
  }
}
