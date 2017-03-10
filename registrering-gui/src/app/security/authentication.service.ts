import {Injectable} from "@angular/core";
import {Http, Headers, Response} from "@angular/http";
import {Observable} from "rxjs";
import "rxjs/add/operator/map";

@Injectable()
export class AuthenticationService {
  public authorization : string;

  constructor(private http: Http) {
    // var authorization: string;
    // this.token = currentUser && currentUser.token;
  }

  login(username: string, password: string): Observable<boolean> {
    let headers = new Headers();
    let authorization : string = btoa(username + ":" + password);
    headers.append("Authorization", "Basic " + authorization);
    return this.http.post('http://localhost:8099/catalogs/login', '', {headers: headers})
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
