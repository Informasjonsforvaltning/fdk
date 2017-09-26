import { Component, Input, Output, OnInit, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { restrictedPursuantToLegalBasis } from './restrictedPursuantToLegalBasis';

import { TagInputModule } from 'ngx-chips';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // this is needed!

@Component({
    selector: 'restriction-legal-basis',
    templateUrl: './restrictedPursuantToLegalBasis.component.html',
    styleUrls: [ './restrictedPursuantToLegalBasis.component.css' ]
  })

export class restrictedPursuantToLegalBasisFormComponent implements OnInit {
    language:string = 'nb';
    showForm:boolean = false;
    @Input('formArray')
    public restrictedPursuantToLegalBasisListFormArray: FormArray;

    @Input('restrictedPursuantToLegalBasis')
    public restrictedPursuantToLegalBasis: restrictedPursuantToLegalBasis;

    @Input('restrictedPursuantToLegalBasisIndex')
    public restrictedPursuantToLegalBasisIndex: number;

    @Input('legalBasisType')
    public legalBasisType: string;

    @Output()
    deleterestrictedPursuantToLegalBasis:EventEmitter<string> = new EventEmitter();

    @Output()
    onSave = new EventEmitter<boolean>();

    public restrictedPursuantToLegalBasisForm: FormGroup;

    constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef) {}

    ngOnInit() {
       if(this.restrictedPursuantToLegalBasis.ui_visible) this.showForm = true;
       this.restrictedPursuantToLegalBasisForm = this.toFormGroup(this.restrictedPursuantToLegalBasis);
       console.log('aaa');
       console.log('restrictedPursuantToLegalBasisForm is ', this.restrictedPursuantToLegalBasisForm.controls['prefLabel']);
       this.restrictedPursuantToLegalBasisListFormArray.push(this.restrictedPursuantToLegalBasisForm);
       console.log('bb');


       this.restrictedPursuantToLegalBasisForm.valueChanges.debounceTime(40).distinctUntilChanged().subscribe(
        restrictedPursuantToLegalBasis => {
            console.log(' restrictedPursuantToLegalBasis is ', restrictedPursuantToLegalBasis);
            /*if (accessLevel.accessRightsComment && accessLevel.accessRightsComment.length === 0) {
                this.dataset.accessRightsComments = null;
            } else {
                this.dataset.accessRightsComments = accessLevel.accessRightsComment;
            }
            if (accessLevel.accessRights) {
                this.accessRightsModel.forEach(entry => {
                    if (entry.id == accessLevel.accessRights) {
                        this.dataset.accessRights = {uri: entry.uri}
                    }
                });
            } */
            //console.log("accessRights.save: ", this.dataset.legalBasisForRestriction);
            //this.dataset.legalBasisForRestriction = _.merge(this.dataset.legalBasisForRestriction, accessLevel.legalBasisForRestriction);
            this.cdr.detectChanges();
            this.onSave.emit(true);
        }
    );
    }

    private toFormGroup(restrictedPursuantToLegalBasis: restrictedPursuantToLegalBasis) {
        const formGroup = this.fb.group({
            uri: [ restrictedPursuantToLegalBasis.uri || '', Validators.required ],
            foafHomepage: [ restrictedPursuantToLegalBasis.foafHomepage || '' ],
            prefLabel:[ restrictedPursuantToLegalBasis.prefLabel ? restrictedPursuantToLegalBasis.prefLabel[this.language] : '' ]
        });
        return formGroup;
    }
    toggleForm() {
      this.showForm = !this.showForm;
    }

    removerestrictedPursuantToLegalBasis(idx: number) {
      this.deleterestrictedPursuantToLegalBasis.emit(idx.toString());
       this.restrictedPursuantToLegalBasisListFormArray.removeAt(idx);
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
