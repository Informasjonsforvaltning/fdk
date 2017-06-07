import {Component, ViewEncapsulation} from "@angular/core";
import {AuthenticationService} from "./security/authentication.service";
import {Router} from "@angular/router";
import {User} from "./security/user";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css', '../assets/css/designsystem.css',
    '../assets/css/registrering.css', '../assets/css/font-awesome.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  loading = false;
  error = '';
  title = 'Registrer datakatalog';
  loggedInUser : User;

  constructor(private router: Router,
              private authenticationService: AuthenticationService) {
  }

  ngOnInit() {
    this.authenticationService.user().subscribe(user => {this.loggedInUser = user});
  }

  getUsername(): string {
    return this.loggedInUser.name;
  }

}
