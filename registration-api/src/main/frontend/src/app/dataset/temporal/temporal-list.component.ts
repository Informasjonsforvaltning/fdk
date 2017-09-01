import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';

import { PeriodOfTime } from './periodoftime';
import { Dataset } from '../dataset';
import {TemporalFormComponent} from './temporal.component';

@Component({
    selector: 'temporals',
    templateUrl: './temporal-list.component.html'
})
export class TemporalListComponent implements OnInit {
    @Input('temporalsFormArray')
    public temporalsFormArray: FormArray;

    @Input('datasetForm')
    public datasetForm: FormGroup;

    @Input('temporals')
    public temporals: PeriodOfTime[];

    @Input('title')
    public title: string;

    temporal: PeriodOfTime;

    constructor(private cd: ChangeDetectorRef) { }

    ngOnInit() {
    }

    addTemporal() {
        const temporal: PeriodOfTime = {
          startDate:null,
          endDate:null
        };
          this.temporals.push(temporal);
          this.cd.detectChanges();
          return false;
    }

    removeTemporal(idx: number) {
        if (this.temporals.length > 0) {
            this.temporals.splice(idx, 1);
            this.temporalsFormArray.removeAt(idx);
        }
        return false;
    }
}
