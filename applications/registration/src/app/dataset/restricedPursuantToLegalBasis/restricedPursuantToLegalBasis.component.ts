import { Component, Input, Output, OnInit, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { RestricedPursuantToLegalBasis } from './restricedPursuantToLegalBasis';

import { TagInputModule } from 'ngx-chips';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // this is needed!

@Component({
    selector: 'restriction-legal-basis',
    templateUrl: './restriction-legal-basis.component.html',
    styleUrls: [ './restriction-legal-basis.component.css' ]
  })

export class RestricedPursuantToLegalBasisFormComponent implements OnInit {
    language:string = 'nb';
    showForm:boolean = false;
    @Input('restricedPursuantToLegalBasissFormArray')
    public restricedPursuantToLegalBasissFormArray: FormArray;

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
       this.restricedPursuantToLegalBasissFormArray.push(this.restricedPursuantToLegalBasisForm);
    }

    private toFormGroup(restricedPursuantToLegalBasis: RestricedPursuantToLegalBasis) {
        const formGroup = this.fb.group({
            id: [ restricedPursuantToLegalBasis.id || Math.random().toString().substr(2)],
            uri: [ restricedPursuantToLegalBasis.uri || '', Validators.required ],
            title: [ restricedPursuantToLegalBasis.title || '', Validators.required ],
            description: [ restricedPursuantToLegalBasis.description ? restricedPursuantToLegalBasis.description[this.language] : '' ],
            accessURL: [ restricedPursuantToLegalBasis.accessURL || []],
            downloadURL: [ restricedPursuantToLegalBasis.downloadURL || []],
            license: [ restricedPursuantToLegalBasis.license ],
            format: [ restricedPursuantToLegalBasis.format || '' ]
        });
        return formGroup;
    }
    toggleForm() {
      this.showForm = !this.showForm;
    }

    removeRestricedPursuantToLegalBasis(idx: number) {
      this.deleteRestricedPursuantToLegalBasis.emit(idx.toString());
       this.restricedPursuantToLegalBasissFormArray.removeAt(idx);
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
