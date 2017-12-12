import { Injectable } from '@angular/core';
import { DialogService } from 'ng2-bootstrap-modal';
import { TimeoutModalComponent } from './timeoutModal.component';
import { WasTimedOutModalComponent } from './wasTimedOutModal.component';
import { Http, Response } from "@angular/http";
import { environment } from "../../environments/environment";

@Injectable()
export class TimeoutService {
  private timer;

  constructor(private dialogService: DialogService, private http: Http) {
  }
  
  // Triggered on catalog or dataset save. 
  // Will remove previous timeout and start anew. 
  public active(): void {
    if (this.timer) clearTimeout(this.timer);
    this.start();
  }


  // Setting timer to 27 minutes and 30 seconds.
  // This is to ensure successful refresh of login before 30 minute timer passes.
  public start(): void {
    this.timer = setTimeout(() => this.startLogout(), 27 * 60 * 1000 + 30 * 1000);
  }  

  
  // Called to see if user previously was logged out by timeout.
  public wasTimedOut(): void {    
    setTimeout(() => {
      // If URL is tagged with a timeout user will get modal explaining what happened.
      if (window.location.hash === '#timed-out') {
        this.dialogService.addDialog(WasTimedOutModalComponent, {})
      }
    }, 1000);
  }

  
  // When timer ends we will start the timeout modal, 
  // which will count down before either logging out or refreshing login.
  private startLogout(): void { 
    this.showModal();
  }

  // Starts modal when timer ends. 
  private showModal(): void {
    this.dialogService
      .addDialog(TimeoutModalComponent, {})
      .subscribe((result) => {
        if (result) {
          // Refresh login for user.
          this.http.get(environment.api +'/innloggetBruker', '', )
            .toPromise()
            .then(response => {
              if (response.ok) {
                // Restart timer if referesh of login went OK.
                this.active();
              } else {
                // Logout if refresh of login failed.
                this.logout();
              }
            }
          );
        } else {
          // Log user out.
          this.logout();
        }
      }
    );
  }

  // Redirect to logout.
  private logout(): void {    
    window.location.href = window.location.origin + '/logout#timed-out';
  }
}
