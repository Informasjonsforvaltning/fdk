import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';

import { restrictedPursuantToLegalBasis } from './restrictedPursuantToLegalBasis';
import { Dataset } from '../dataset';
import {restrictedPursuantToLegalBasisFormComponent} from './restrictedPursuantToLegalBasis.component';

@Component({
    selector: 'restriction-legal-basis-list',
    templateUrl: './restrictedPursuantToLegalBasis-list.html'
})
export class restrictedPursuantToLegalBasisListComponent implements OnInit {
    @Input('restrictedPursuantToLegalBasisListFormArray')
    public restrictedPursuantToLegalBasisListFormArray: FormArray;

    @Input('datasetForm')
    public datasetForm: FormGroup;

    @Input('restrictedPursuantToLegalBasisList')
    public restrictedPursuantToLegalBasisList: restrictedPursuantToLegalBasis[];
    
    @Input('legalBasisType')
    public legalBasisType: string;

    restrictedPursuantToLegalBasis: restrictedPursuantToLegalBasis;

    constructor(private cd: ChangeDetectorRef) { }

    ngOnInit() {
      this.restrictedPursuantToLegalBasisList = this.restrictedPursuantToLegalBasisList || [];
      console.log('datasetForm is ', this.datasetForm);
      console.log(this.restrictedPursuantToLegalBasisListFormArray)
    }

    addrestrictedPursuantToLegalBasis() {
        const restrictedPursuantToLegalBasis: restrictedPursuantToLegalBasis = {
                foafHomepage: null,
                prefLabel: {
                  nb:""
                }
            };
          this.restrictedPursuantToLegalBasisList.push(restrictedPursuantToLegalBasis);
          this.cd.detectChanges();
          return false;
    }
    
    removerestrictedPursuantToLegalBasis(idx: number) {
        if (this.restrictedPursuantToLegalBasisList.length > 0) {
            this.restrictedPursuantToLegalBasisList.splice(idx, 1);
            this.restrictedPursuantToLegalBasisListFormArray.removeAt(idx);
        }
        return false;
    }
}
