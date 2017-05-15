import {Component, ViewEncapsulation} from "@angular/core";
import {AuthenticationService} from "./security/authentication.service";
import {Router} from "@angular/router";

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

  constructor(private router: Router,
              private authenticationService: AuthenticationService) {
  }

  isAuthenticated(): boolean{
    return localStorage.getItem('username') != null && localStorage.getItem('authorization') != null;
  }

  getUsername(): string {
    return localStorage.getItem('username');
  }

  login() {
    this.loading = true;
    this.authenticationService.login()
      .subscribe(result => {
        if (result === true) {
          // login successful
          // this.router.navigate(['/']);
        } else {
          // login failed
          this.error = 'Innlogging feilet';
          this.loading = false;
        }
      });
  }

  logout(): void {
    this.authenticationService.logout();
    this.router.navigate(['/'])
  }

}
