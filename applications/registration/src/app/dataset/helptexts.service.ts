import {Injectable} from "@angular/core";
import {Http, Headers} from "@angular/http";
import "rxjs/add/operator/toPromise";
import {environment} from "../../environments/environment";


@Injectable()
export class HelptextsService {

  constructor(private http: Http) {
  }

  private serviceUrl = environment.queryUrl + "/helptexts";
  private cachedHelptexts: any = {};
  private helptextType = 'data-helptext';

  private headers = new Headers({'Content-Type': 'application/json'});


  makeSingular(codeType: string): string {
    return codeType.indexOf('ies') === codeType.length - 3 ? codeType.substr(0, codeType.length - 3) + 'y' : codeType.substr(0, codeType.length - 1);
  }

  private get(language: string): Promise<any> {
    return this.http.get(this.serviceUrl)
      .map(data => data.json().map((item, index) => {
        return {
          id: item.id,
          shortdesc: item.shortdesc[language],
          description: item.description[language]
        }
      })).toPromise()
      .then(response => response)
      ;
  }


  public fetchHelptexts(lang: string): Promise<any[]> {
    if (this.cachedHelptexts[this.helptextType]) {

      return new Promise((resolve, reject) => {
        resolve(this.cachedHelptexts[this.helptextType]);
      });

    } else {

      return this.get(lang).then(data => {
        this.cachedHelptexts[this.helptextType] = data;
        return this.cachedHelptexts[this.helptextType];
      });

    }
  }
}
