import { Component } from '@angular/core';
import { DialogComponent, DialogService } from 'ng2-bootstrap-modal';

export interface TimeoutModalModel {}
@Component({
  selector: 'timeout',
  styleUrls: [],
  template: `
    <div class="modal-dialog">
      <div class="modal-content fdk-modal">
        <div class="modal-header">
          <i class="fa fa-warning fdk-modal-fa"></i>
          <h4 class="modal-title">{{title}}</h4>
        </div>
        <div class="modal-body">
          <p>
            {{text}}
            <br>
            {{endText}}
          </p>
        </div>
        <div class="modal-footer">
          <button type="button" class="fdk-button fdk-button-default fdk-modal-ok-button" (click)="confirm()">
            Ja, forbli innlogget
          </button>
          <button type="button" class="fdk-button fdk-button-cta fdk-modal-close-button" (click)="close()" >
            Nei, logg ut
          </button>
        </div>
      </div>
    </div>
    <div class="fade in modal-backdrop">
    </div>
  `
})
export class TimeoutModalComponent extends DialogComponent<TimeoutModalModel, Boolean> implements TimeoutModalModel {
  seconds: number;
  minutes: number;
  text: string;
  endText: string;
  title: string;
  secondsCounter;

  constructor(public dialogService: DialogService) {
    super(dialogService);
    this.seconds = 60 * 2; // Allow user 2 minutes to stay logged in.
    this.minutes = Math.floor(this.seconds / 60);    
    this.title = 'Sesjonen blir snart avbrutt';
    this.text = 'Du vil bli logget ut om ' + this.minutes + ' minutter og ' + this.seconds % 60 + 'sekunder.';
    this.endText = 'Ønsker du å forbli innlogget?';
    this.startCountdown(); // Countdown starts as soon as modal is created;
  }

  // Handles closing and giving affirmative result to watcher.
  confirm() {
    this.result = true;
    this.close(); 
  }

  // Starts 1 second interval for modal countdown.
  startCountdown() {
    this.secondsCounter = setInterval(() => this.updateSeconds(), 1000);
  }

  // Counts down seconds and updates minutes.
  // Handles removing countdown and closing modal when time runs out.
  updateSeconds() {
    this.seconds = this.seconds - 1; 
    this.minutes = Math.floor(this.seconds / 60);
    this.updateText();
    if (this.seconds <= 0) {
      this.seconds = 0;
      clearInterval(this.secondsCounter);
      this.close();
    }
  }

  // Update text based on edge cases for minutes or seconds.
  updateText() {
    let startText = 'Du vil bli logget ut om ';
    let minutesText = this.minutes + ' minutter og ';
    let secondsText = this.seconds % 60 + ' sekunder.';
    if (this.minutes === 0) {
      minutesText = '';
    } else if (this.minutes === 1) {
      minutesText = this.minutes + ' minutt og ';
    }
    if (this.seconds % 60 === 1) {      
      secondsText = this.seconds % 60 + ' sekund.';
    } 
    this.text = startText + minutesText + secondsText;
  }
}
