import {Injectable} from "@angular/core";
import {Http, Headers} from "@angular/http";
import "rxjs/add/operator/toPromise";
import {environment} from "../../environments/environment";


@Injectable()
export class ThemesService {

    constructor(private http: Http) {
    }

    private serviceUrl = "http://localhost:8100" + "/themes";
    private cachedThemes: any = {};
    private themeType = 'data-theme';

    private headers = new Headers({'Content-Type': 'application/json'});

    private handleError(error: any): Promise<any> {
        console.error('An error occured', error); //todo implement proper error handling and logging
        return Promise.reject(error.message || error);
    }

    makeSingular(codeType: string): string {
        return codeType.indexOf('ies') === codeType.length - 3 ? codeType.substr(0, codeType.length - 3) + 'y' : codeType.substr(0, codeType.length - 1);
    }

    private get(language: string): Promise<any> {
        return this.http.get(this.serviceUrl)
            .map(data => data.json().map(item => {
                return {
                    value: item.id,
                    label: item.title[language]
                }
            })).toPromise()
            .then(response => response)
            .catch(this.handleError);
    }


    public fetchThemes(lang: string): Promise<any[]> {
        if (this.cachedThemes[this.themeType]) {

            return new Promise((resolve, reject) => {
                resolve(this.cachedThemes[this.themeType]);
            });

        } else {

            return this.get(lang).then(data => {
                this.cachedThemes[this.themeType] = data;
                return this.cachedThemes[this.themeType];
            });

        }

    }
}
