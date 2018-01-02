import { Component } from '@angular/core';
import { DialogComponent, DialogService } from 'ng2-bootstrap-modal';

export interface WasTimedOutModalModel {}
@Component({
  selector: 'timeout',
  styleUrls: [],
  template: `
    <div class="modal-dialog">
      <div class="modal-content fdk-modal">
        <div class="modal-header">
          <h4 class="modal-title">
            Sesjonen ble avbrutt på grunn av inaktivitet
          </h4>
        </div>
        <div class="modal-footer">
          <button type="button" class="fdk-button fdk-button-cta fdk-modal-close-button" (click)="close()" >
            Lukk
          </button>
        </div>
      </div>
    </div>
    <div class="fade in modal-backdrop">
    </div>
  `
})
export class WasTimedOutModalComponent extends DialogComponent<WasTimedOutModalModel, Boolean> implements WasTimedOutModalModel {
  constructor(public dialogService: DialogService) {
    super(dialogService);
  }
}
