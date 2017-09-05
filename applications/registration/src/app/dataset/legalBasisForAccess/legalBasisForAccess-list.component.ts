import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';

import { LegalBasisForAccess } from './legal-basis-for-access';
import { Dataset } from '../dataset';
import {LegalBasisForAccessFormComponent} from './legalBasisForAccess.component';

@Component({
    selector: 'restriction-legal-basiss',
    templateUrl: './restriction-legal-basiss.component.html'
})
export class LegalBasisForAccessListComponent implements OnInit {
    @Input('legalBasisForAccesssFormArray')
    public legalBasisForAccesssFormArray: FormArray;

    @Input('datasetForm')
    public datasetForm: FormGroup;

    @Input('legalBasisForAccesss')
    public legalBasisForAccesss: LegalBasisForAccess[];

    @Input('title')
    public title: string;

    legalBasisForAccess: LegalBasisForAccess;

    constructor(private cd: ChangeDetectorRef) { }

    ngOnInit() {
    }

    addLegalBasisForAccess() {
        const legalBasisForAccess: LegalBasisForAccess = {
                  foafHomepage: null,
                  prefLabel: {
                    nb:""
                  }
              };

          this.legalBasisForAccesss.push(legalBasisForAccess);
          this.cd.detectChanges();
          return false;
    }

    removeLegalBasisForAccess(idx: number) {
        if (this.legalBasisForAccesss.length > 0) {
            this.legalBasisForAccesss.splice(idx, 1);
            this.legalBasisForAccesssFormArray.removeAt(idx);
        }
        return false;
    }
}
