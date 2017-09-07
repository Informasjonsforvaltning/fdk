import { Component, Input, Output, OnInit, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { LegalBasisForAccess } from './legalBasisForAccess';

import { TagInputModule } from 'ngx-chips';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // this is needed!

@Component({
    selector: 'restriction-legal-basis',
    templateUrl: './restriction-legal-basis.component.html',
    styleUrls: [ './restriction-legal-basis.component.css' ]
  })

export class LegalBasisForAccessFormComponent implements OnInit {
    language:string = 'nb';
    showForm:boolean = false;
    @Input('legalBasisForAccesssFormArray')
    public legalBasisForAccesssFormArray: FormArray;

    @Input('legalBasisForAccess')
    public legalBasisForAccess: LegalBasisForAccess;

    @Input('legalBasisForAccessIndex')
    public legalBasisForAccessIndex: number;

    @Output()
    deleteLegalBasisForAccess:EventEmitter<string> = new EventEmitter();

    public legalBasisForAccessForm: FormGroup;


    constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef) {}

    ngOnInit() {
       if(this.legalBasisForAccess.ui_visible) this.showForm = true;
       this.legalBasisForAccessForm = this.toFormGroup(this.legalBasisForAccess);
       this.legalBasisForAccesssFormArray.push(this.legalBasisForAccessForm);
    }

    private toFormGroup(legalBasisForAccess: LegalBasisForAccess) {
        const formGroup = this.fb.group({
            uri: [ legalBasisForAccess.uri || '', Validators.required ],
            foafHomepage: [ legalBasisForAccess.foafHomepage || '' ],
            prefLabel:[ legalBasisForAccess.prefLabel ? legalBasisForAccess.prefLabel[this.language] : '' ]
        });
        return formGroup;
    }
    toggleForm() {
      this.showForm = !this.showForm;
    }

    removeLegalBasisForAccess(idx: number) {
      this.deleteLegalBasisForAccess.emit(idx.toString());
       this.legalBasisForAccesssFormArray.removeAt(idx);
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
