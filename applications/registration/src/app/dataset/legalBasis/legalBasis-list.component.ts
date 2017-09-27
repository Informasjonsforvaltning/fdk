import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';

import { legalBasis } from './legalBasis';
import { Dataset } from '../dataset';
import {legalBasisFormComponent} from './legalBasis.component';

@Component({
    selector: 'legal-basis-list',
    templateUrl: './legalBasis-list.html'
})
export class legalBasisListComponent implements OnInit {
    @Input('legalBasisListFormArray')
    public legalBasisListFormArray: FormArray;

    @Input('legalBasisList')
    public legalBasisList: legalBasis[];
    
    @Input('legalBasisType')
    public legalBasisType: string;

    legalBasis: legalBasis;

    constructor(private cd: ChangeDetectorRef) { }

    ngOnInit() {
      this.legalBasisList = this.legalBasisList || [];
    }

    addLegalBasis() {
        const legalBasis: legalBasis = {
                foafHomepage: null,
                prefLabel: {
                  nb:""
                }
            };
          this.legalBasisList.push(legalBasis);
          this.cd.detectChanges();
          return false;
    }
    
    removeLegalBasis(idx: number) {
        if (this.legalBasisList.length > 0) {
            this.legalBasisList.splice(idx, 1);
            this.legalBasisListFormArray.removeAt(idx);
        }
        return false;
    }
}
