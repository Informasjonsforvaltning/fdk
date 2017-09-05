import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';

import { BasisForProcessing } from './basisForProcessing';
import { Dataset } from '../dataset';
import {BasisForProcessingFormComponent} from './basisForProcessing.component';

@Component({
    selector: 'basis-for-processing',
    templateUrl: './basis-for-processing.component.html'
})
export class BasisForProcessingListComponent implements OnInit {
    @Input('basisForProcessingsFormArray')
    public basisForProcessingsFormArray: FormArray;

    @Input('datasetForm')
    public datasetForm: FormGroup;

    @Input('basisForProcessings')
    public basisForProcessings: BasisForProcessing[];

    @Input('title')
    public title: string;

    basisForProcessing: BasisForProcessing;

    constructor(private cd: ChangeDetectorRef) { }

    ngOnInit() {
    }

    addBasisForProcessing() {
        const basisForProcessing: BasisForProcessing = {
            foafHomepage: null,
            prefLabel: {
              nb:""
            }
        };
          this.basisForProcessings.push(basisForProcessing);
          this.cd.detectChanges();
          return false;
    }

    removeBasisForProcessing(idx: number) {
        if (this.basisForProcessings.length > 0) {
            this.basisForProcessings.splice(idx, 1);
            this.basisForProcessingsFormArray.removeAt(idx);
        }
        return false;
    }
}
