import {Injectable} from "@angular/core";
import {Http, Headers} from "@angular/http";
import "rxjs/add/operator/toPromise";
import {environment} from "../../environments/environment";


@Injectable()
export class CodesService {

  constructor(private http: Http) {
  }

  //private codesUrl = environment.api + "/codes";
  private codesUrl = environment.queryUrl + "/codes";

  fetchedCodeIds: string[] = [];

  private headers = new Headers({'Content-Type': 'application/json'});

  private handleError(error: any): Promise<any>{
    console.error('An error occured', error); //todo implement proper error handling and logging
    return Promise.reject(error.message || error);
  }

  makeSingular(codeType: string): string {
    return codeType.indexOf('ies') === codeType.length-3 ? codeType.substr(0, codeType.length-3) + 'y' : codeType.substr(0, codeType.length-1);
  }

  get(codeType: string): Promise<any> {
      const datasetUrl = `${this.codesUrl}/${this.makeSingular(codeType)}`;
      return this.http.get(datasetUrl)
        .toPromise()
        .then(response => response.json().codes)
        .catch(this.handleError);
  }

  fetchCodes (codeType:string, lang:string): Promise<any[]> {
       // if (this.fetchedCodeIds.indexOf(codeType.trim()) === -1) {

            return this.get(codeType).then(data => {
                this.fetchedCodeIds.push(codeType);
                return data.map(code => {
                    return {value: code.uri, label: code.prefLabel[lang] }
                });

            });
        }
    //}
}
