import {Injectable} from "@angular/core";
import {Http, Headers} from "@angular/http";
import "rxjs/add/operator/toPromise";
import {environment} from "../../environments/environment";


@Injectable()
export class HelptextsService {

  private serviceUrl = environment.queryUrl + "/helptexts";
  private cachedHelptexts: any = {};

  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: Http) {
  }

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
    if (this.cachedHelptexts[lang]) {
      return new Promise((resolve, reject) => {
        resolve(this.cachedHelptexts[lang]);
      });

    } else {
      this.cachedHelptexts[lang] =  this.get(lang).then(data => {
        return data;
      });

    }
    return this.cachedHelptexts[lang];
  }
}
