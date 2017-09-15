import { Component, Input, Output, OnInit, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { RestricedPursuantToLegalBasis } from './restricedPursuantToLegalBasis';

import { TagInputModule } from 'ngx-chips';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // this is needed!

@Component({
    selector: 'restriction-legal-basis',
    templateUrl: './RestricedPursuantToLegalBasis.component.html',
    styleUrls: [ './restricedPursuantToLegalBasis.component.css' ]
  })

export class RestricedPursuantToLegalBasisFormComponent implements OnInit {
    language:string = 'nb';
    showForm:boolean = false;
    @Input('formArray')
    public restricedPursuantToLegalBasisListFormArray: FormArray;
    
    @Input('restricedPursuantToLegalBasis')
    public restricedPursuantToLegalBasis: RestricedPursuantToLegalBasis;

    @Input('restricedPursuantToLegalBasisIndex')
    public restricedPursuantToLegalBasisIndex: number;

    @Output()
    deleteRestricedPursuantToLegalBasis:EventEmitter<string> = new EventEmitter();

    public restricedPursuantToLegalBasisForm: FormGroup;

    constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef) {}

    ngOnInit() {
       if(this.restricedPursuantToLegalBasis.ui_visible) this.showForm = true;
       this.restricedPursuantToLegalBasisForm = this.toFormGroup(this.restricedPursuantToLegalBasis);
       console.log('aaa');
       console.log('restricedPursuantToLegalBasisForm is ', this.restricedPursuantToLegalBasisForm.controls['prefLabel']);
       this.restricedPursuantToLegalBasisListFormArray.push(this.restricedPursuantToLegalBasisForm);
       console.log('bb');
    }

    private toFormGroup(restricedPursuantToLegalBasis: RestricedPursuantToLegalBasis) {
        const formGroup = this.fb.group({
            uri: [ restricedPursuantToLegalBasis.uri || '', Validators.required ],
            foafHomepage: [ restricedPursuantToLegalBasis.foafHomepage || '' ],
            prefLabel:[ restricedPursuantToLegalBasis.prefLabel ? restricedPursuantToLegalBasis.prefLabel[this.language] : '' ]
        });
        return formGroup;
    }
    toggleForm() {
      this.showForm = !this.showForm;
    }

    removeRestricedPursuantToLegalBasis(idx: number) {
      this.deleteRestricedPursuantToLegalBasis.emit(idx.toString());
       this.restricedPursuantToLegalBasisListFormArray.removeAt(idx);
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
