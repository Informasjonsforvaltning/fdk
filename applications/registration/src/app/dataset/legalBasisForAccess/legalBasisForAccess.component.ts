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
            id: [ legalBasisForAccess.id || Math.random().toString().substr(2)],
            uri: [ legalBasisForAccess.uri || '', Validators.required ],
            title: [ legalBasisForAccess.title || '', Validators.required ],
            description: [ legalBasisForAccess.description ? legalBasisForAccess.description[this.language] : '' ],
            accessURL: [ legalBasisForAccess.accessURL || []],
            downloadURL: [ legalBasisForAccess.downloadURL || []],
            license: [ legalBasisForAccess.license ],
            format: [ legalBasisForAccess.format || '' ]
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
