import {Injectable} from "@angular/core";
import {Http, Response} from "@angular/http";
import {Observable} from "rxjs";
import "rxjs/add/operator/map";
import {environment} from "../../environments/environment";
import {User} from "./user";

@Injectable()
export class AuthenticationService {
  public authorization : string;

  public username: string = 'bjg';
  public password: string = '123';

  constructor(private http: Http) {
    // var authorization: string;
    // this.token = currentUser && currentUser.token;
  }

  user(): Observable<User> {
    return this.http.get(environment.api +'/innloggetBruker', '', )
      .map((response: Response) => {
        if (response.ok) {
          return response.json();
        } else {
          return null;
        }
      });
  }

}
