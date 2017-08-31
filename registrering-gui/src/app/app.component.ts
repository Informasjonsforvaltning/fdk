import {Component, ViewEncapsulation} from "@angular/core";
import {AuthenticationService} from "./security/authentication.service";
import {Router} from "@angular/router";
import {User} from "./security/user";
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import {ModalComponent} from "./modal/modal.component";

@Component({
  selector: 'app-root',
  styleUrls:["./app.component.css"],
  templateUrl: './app.component.html',
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {

  error = '';
  title = 'Registrer datakatalog';
  loggedInUser : User;

  constructor(private router: Router,
              private authenticationService: AuthenticationService) {
  }

  ngOnInit() {
    this.authenticationService.user().subscribe(user => {this.loggedInUser = user});
  }

  isAuthenticated(): boolean {
    return this.loggedInUser != null;
  }

  getUsername(): string {
    return this.loggedInUser.name;
  }

  login() : boolean{

    //this.router.navigate(['/login']).then(()=>{window.location.reload(true)});
    window.location.href = window.location.origin + "/login";

    return false;
  }

  logout() : boolean {
//    this.router.navigate(['/logout']).then(()=>{window.location.reload(true)});
    window.location.href = window.location.origin + "/logout";

    return false;
  }
}
