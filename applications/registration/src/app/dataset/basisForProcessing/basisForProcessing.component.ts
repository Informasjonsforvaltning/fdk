import { Component, Input, Output, OnInit, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { BasisForProcessing } from './basisForProcessing';

import { TagInputModule } from 'ngx-chips';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // this is needed!

@Component({
    selector: 'restriction-legal-basis',
    templateUrl: './restriction-legal-basis.component.html',
    styleUrls: [ './restriction-legal-basis.component.css' ]
  })

export class BasisForProcessingFormComponent implements OnInit {
    language:string = 'nb';
    showForm:boolean = false;
    @Input('basisForProcessingsFormArray')
    public basisForProcessingsFormArray: FormArray;

    @Input('basisForProcessing')
    public basisForProcessing: BasisForProcessing;

    @Input('basisForProcessingIndex')
    public basisForProcessingIndex: number;

    @Output()
    deleteBasisForProcessing:EventEmitter<string> = new EventEmitter();

    public basisForProcessingForm: FormGroup;


    constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef) {}

    ngOnInit() {
       if(this.basisForProcessing.ui_visible) this.showForm = true;
       this.basisForProcessingForm = this.toFormGroup(this.basisForProcessing);
       this.basisForProcessingsFormArray.push(this.basisForProcessingForm);
    }

    private toFormGroup(basisForProcessing: BasisForProcessing) {
        const formGroup = this.fb.group({
            uri: [ basisForProcessing.uri || '', Validators.required ],
            foafHomepage: [ basisForProcessing.foafHomepage || '' ],
            prefLabel:[ basisForProcessing.prefLabel ? basisForProcessing.prefLabel[this.language] : '' ]
        });
        return formGroup;
    }
    toggleForm() {
      this.showForm = !this.showForm;
    }

    removeBasisForProcessing(idx: number) {
      this.deleteBasisForProcessing.emit(idx.toString());
       this.basisForProcessingsFormArray.removeAt(idx);
      return false;
    }

    focus(e) {
      e.target.childNodes.forEach(node=>{
        if(node.className && node.className.match(/\bng2-tag-input-form\b/)) {
          node.childNodes[1].focus();
        }
      })
    }
}
