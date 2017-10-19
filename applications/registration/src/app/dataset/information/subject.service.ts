import {Injectable} from "@angular/core";
import {Http, Headers} from "@angular/http";
import {environment} from "../../../environments/environment";
import "rxjs/add/operator/toPromise";

@Injectable()
export class SubjectService {

  constructor(private http: Http) {
  }

  private subjectsUrl = environment.api + "/referenceData/subjects";
  private headers = new Headers({'Content-Type': 'application/json'});

  get(url: string): Promise<any> {
    const datasetUrl = `${this.subjectsUrl}?uri=${url}`;
    return this.http.get(datasetUrl)
      .toPromise()
      .then((response) => {
        return response.json();
      });
  }
}
