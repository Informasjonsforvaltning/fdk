import {Component, ViewEncapsulation} from "@angular/core";
import {AuthenticationService} from "./security/authentication.service";
import {Router} from "@angular/router";
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import {ModalComponent} from "./modal/modal.component";

@Component({
  selector: 'app-root',
  styleUrls:["./app.component.css"],
  templateUrl: './app.component.html',
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  loading = false;
  error = '';
  title = 'Registrer datakatalog';

  constructor(private router: Router,
              private authenticationService: AuthenticationService) {
  }

  isAuthenticated(): boolean {
    return localStorage.getItem('username') != null && localStorage.getItem('authorization') != null;
  }

  getUsername(): string {
    return localStorage.getItem('username');
  }

  login() : boolean{
    this.loading = true;
    this.authenticationService.login()
      .subscribe(result => {
        if (result === true) {
          // login successful
            window.location.reload(true);
        } else {
          // login failed
          this.error = 'Innlogging feilet';
          this.loading = false;
        }
      });
    return false;
  }

  logout() : boolean {
    this.authenticationService.logout();
    this.router.navigate(['/']).then(()=>{window.location.reload(true)});
    return false;
  }
}
