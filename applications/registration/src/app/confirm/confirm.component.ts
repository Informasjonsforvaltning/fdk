/**
 * Created by bjg on 05.04.2017.
 */

import { Component } from '@angular/core';
import { DialogComponent, DialogService } from "ng2-bootstrap-modal";
export interface ConfirmModel {
  title:string;
  message:string;
  showFooter:boolean;
}
@Component({
  selector: 'confirm',
  styleUrls: [],
  template: `<div class="modal-dialog">
                <div class="modal-content">
                   <div class="modal-header">
                     <button type="button" class="close" (click)="close()" >&times;</button>
                     <h4 class="modal-title fdk-text-regular">{{title || 'Bekreft'}}</h4>
                   </div>
                   <div class="modal-body fdk-text-regular">
                     <p>{{message || 'Er du sikker?'}}</p>
                   </div>
                   <div class="modal-footer" *ngIf=showFooter>
                     <button type="button" class="btn btn-primary fdk-label fdk-label-default" (click)="confirm()">OK</button>
                     <button type="button" class="btn btn-default fdk-label fdk-label-default" (click)="close()" >Avbryt</button>
                   </div>
                 </div>
              </div>
              <div class="fade in modal-backdrop"></div>`
})
export class ConfirmComponent extends DialogComponent<ConfirmModel, boolean> implements ConfirmModel {
  title: string;
  message: string;
  showFooter: boolean = true;
  constructor(dialogService: DialogService) {
    super(dialogService);
  }
  confirm() {
    // we set dialog result as true on click on confirm button,
    // then we can get dialog result from caller code
    this.result = true;
    this.close();
  }
}
