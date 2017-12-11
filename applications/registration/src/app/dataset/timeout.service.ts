import {Injectable} from '@angular/core';

@Injectable()
export class TimeoutService {
  private inactivityLogout = false;
  private timer;

  public active(): void {
    console.log("IM ACTIVE")
    if (this.timer) clearTimeout(this.timer);
    this.start();
  }

  public start(): void {
    this.inactivityLogout = false;
    this.timer = setTimeout(() => this.logout(), 10 * 1000);
  }

  private logout(): void {
    this.inactivityLogout = true;
    console.log('LOGGED OUT');
    //window.location.href = window.location.origin + '/logout';
  }

  public wasTimedOut(): boolean {
    return this.inactivityLogout;
  }
}
