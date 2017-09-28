import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';

import { LegalBasis } from './legalBasis';
import { Dataset } from '../dataset';
import { LegalBasisFormComponent } from './legalBasis.component';

@Component({
    selector: 'legal-basis-list',
    templateUrl: './legalBasis-list.html'
})
export class LegalBasisListComponent implements OnInit {

    @Input('legalBasisListFormArray')
    public legalBasisListFormArray: FormArray;

    @Input('datasetForm')
    public datasetForm: FormGroup;

    @Input('legalBasisList')
    public legalBasisList: LegalBasis[];
    
    @Input('legalBasisType')
    public legalBasisType: string;

    legalBasis: LegalBasis;

    constructor(private cd: ChangeDetectorRef) { }

    ngOnInit() {
      this.legalBasisList = this.legalBasisList || [];
    }

    addLegalBasis() : boolean {
        const legalBasis: LegalBasis = {
            foafHomepage: null,
            prefLabel: {
                nb:""
            }
        };
        this.legalBasisList.push(legalBasis);
        this.cd.detectChanges();
        return false;

    }
    
    removeLegalBasis(idx: number) : boolean {
        if (this.legalBasisList.length > 0) {
            this.legalBasisList.splice(idx, 1);
            this.legalBasisListFormArray.removeAt(idx);
        }
        return false;
    }
}
