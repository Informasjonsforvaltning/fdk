import {Injectable} from "@angular/core";
import {Headers, Http, Response} from "@angular/http";
import {Observable} from "rxjs";
import "rxjs/add/operator/map";
import {environment} from "../../environments/environment";

@Injectable()
export class AuthenticationService {
  public authorization : string;

  public username: string = 'bjg';
  public password: string = '123';

  constructor(private http: Http) {
    // var authorization: string;
    // this.token = currentUser && currentUser.token;
  }

  login(): Observable<boolean> {
    let headers = new Headers();
    let authorization : string = btoa(this.username + ":" + this.password);
    headers.append("Authorization", "Basic " + authorization);
    return this.http.post(environment.api +'/login', '', {headers: headers})
      .map((response: Response) => {
        // login successful if there's a jwt token in the response
        if (response.ok) {
          // store username and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('authorization', authorization);
          localStorage.setItem('username', response.text());
          this.authorization = authorization;
          // return true to indicate successful login
          return true;
        } else {
          // return false to indicate failed login
          return false;
        }
      });
  }

  logout(): void {
    // clear token remove user from local storage to log user out
    this.authorization = null;
    localStorage.removeItem('authorization');
    localStorage.removeItem('username');
  }

}
