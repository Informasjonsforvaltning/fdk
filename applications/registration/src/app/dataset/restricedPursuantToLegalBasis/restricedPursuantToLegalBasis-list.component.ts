import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';

import { RestricedPursuantToLegalBasis } from './restricedPursuantToLegalBasis';
import { Dataset } from '../dataset';
import {RestricedPursuantToLegalBasisFormComponent} from './restricedPursuantToLegalBasis.component';

@Component({
    selector: 'restriction-legal-basis-list',
    templateUrl: './restricedPursuantToLegalBasis-list.html'
})
export class RestricedPursuantToLegalBasisListComponent implements OnInit {
    @Input('restricedPursuantToLegalBasisListFormArray')
    public restricedPursuantToLegalBasisListFormArray: FormArray;

    @Input('datasetForm')
    public datasetForm: FormGroup;

    @Input('restricedPursuantToLegalBasisList')
    public restricedPursuantToLegalBasisList: RestricedPursuantToLegalBasis[];

    @Input('title')
    public title: string;

    restricedPursuantToLegalBasis: RestricedPursuantToLegalBasis;

    constructor(private cd: ChangeDetectorRef) { }

    ngOnInit() {
      this.restricedPursuantToLegalBasisList = this.restricedPursuantToLegalBasisList || [];
      console.log('datasetForm is ', this.datasetForm);
    }

    addRestricedPursuantToLegalBasis() {
        const restricedPursuantToLegalBasis: RestricedPursuantToLegalBasis = {
                foafHomepage: null,
                prefLabel: {
                  nb:""
                }
            };
          this.restricedPursuantToLegalBasisList.push(restricedPursuantToLegalBasis);
          this.cd.detectChanges();
          return false;
    }

    removeRestricedPursuantToLegalBasis(idx: number) {
        if (this.restricedPursuantToLegalBasisList.length > 0) {
            this.restricedPursuantToLegalBasisList.splice(idx, 1);
            this.restricedPursuantToLegalBasisListFormArray.removeAt(idx);
        }
        return false;
    }
}
