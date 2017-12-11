import {Injectable} from "@angular/core";
import {Http, Response} from "@angular/http";
import {Observable} from "rxjs";
import "rxjs/add/operator/map";
import {environment} from "../../environments/environment";
import {User} from "./user";
import { TimeoutService } from "app/dataset/timeout.service";

@Injectable()
export class AuthenticationService {
  public authorization : string;


  constructor(private http: Http, private timeoutService: TimeoutService) {
    // var authorization: string;
    // this.token = currentUser && currentUser.token;
  }

  user(): Observable<User> {
    return this.http.get(environment.api +'/innloggetBruker', '', )
      .map((response: Response) => {
        if (response.ok) {
          this.timeoutService.active();
          return response.json();
        } else {
          return null;
        }
      });
  }

}
