import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';

import { RestricedPursuantToLegalBasis } from './restricedPursuantToLegalBasis';
import { Dataset } from '../dataset';
import {RestricedPursuantToLegalBasisFormComponent} from './restricedPursuantToLegalBasis.component';

@Component({
    selector: 'restriction-legal-basiss',
    templateUrl: './restriction-legal-basiss.component.html'
})
export class RestricedPursuantToLegalBasisListComponent implements OnInit {
    @Input('restricedPursuantToLegalBasissFormArray')
    public restricedPursuantToLegalBasissFormArray: FormArray;

    @Input('datasetForm')
    public datasetForm: FormGroup;

    @Input('restricedPursuantToLegalBasiss')
    public restricedPursuantToLegalBasiss: RestricedPursuantToLegalBasis[];

    @Input('title')
    public title: string;

    restricedPursuantToLegalBasis: RestricedPursuantToLegalBasis;

    constructor(private cd: ChangeDetectorRef) { }

    ngOnInit() {
    }

    addRestricedPursuantToLegalBasis() {
        const restricedPursuantToLegalBasis: RestricedPursuantToLegalBasis = {
                foafHomepage: null,
                prefLabel: {
                  nb:""
                }
            };
          this.restricedPursuantToLegalBasiss.push(restricedPursuantToLegalBasis);
          this.cd.detectChanges();
          return false;
    }

    removeRestricedPursuantToLegalBasis(idx: number) {
        if (this.restricedPursuantToLegalBasiss.length > 0) {
            this.restricedPursuantToLegalBasiss.splice(idx, 1);
            this.restricedPursuantToLegalBasissFormArray.removeAt(idx);
        }
        return false;
    }
}
