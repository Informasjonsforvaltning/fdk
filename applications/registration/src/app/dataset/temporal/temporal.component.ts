import { Component, Input, Output, OnInit, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { PeriodOfTime } from './periodoftime';
import {IMyDpOptions, IMyDateModel} from 'mydatepicker';
import {DatasetComponent} from '../dataset.component';


@Component({
    selector: 'temporal',
    templateUrl: './temporal.component.html',
    styleUrls: [ './temporal.component.css' ]
  })

export class TemporalFormComponent implements OnInit {

    language:string = 'nb';
    showForm:boolean = false;

    @Input('temporalsFormArray')
    public temporalsFormArray: FormArray;

    @Input('temporal')
    public temporal: PeriodOfTime;

    @Input('temporalIndex')
    public temporalIndex: number;

    @Input('showDelete')
    public showDelete: boolean;

    @Output()
    deleteTemporal:EventEmitter<string> = new EventEmitter();

    public temporalForm: FormGroup;

    private myDatePickerOptions: IMyDpOptions = {
        showClearDateBtn: false
    };

    constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef) {}

    ngOnInit() {
        this.temporalForm = this.toFormGroup(this.temporal);
        this.temporalsFormArray.push(this.temporalForm);
        this.temporalForm.valueChanges.subscribe(
            temporalFormElement => {
                if (temporalFormElement.startDate && temporalFormElement.startDate.epoc) {
                    this.temporal.startDate = temporalFormElement.startDate.epoc;
                    if (this.temporal.startDate.toString().length === 10) {
                        this.temporal.startDate = this.temporal.startDate.toString() + "000";
                    }
                } else {
                    delete this.temporal.startDate;
                }

                if (temporalFormElement.endDate && temporalFormElement.endDate.epoc) {
                    this.temporal.endDate = temporalFormElement.endDate.epoc;
                    if (this.temporal.endDate.toString().length === 10) {
                        this.temporal.endDate = this.temporal.endDate.toString() + "000";
                    }
                } else {
                    delete this.temporal.endDate;
                }
                this.cdr.detectChanges();
            }
        );
    }

    private toFormGroup(temporal: PeriodOfTime) : FormGroup {
        const formGroup = this.fb.group({
            startDate: [DatasetComponent.getDateObjectFromUnixTimestamp(temporal.startDate)],
            endDate: [DatasetComponent.getDateObjectFromUnixTimestamp(temporal.endDate)]
        });
        return formGroup;
    }

    removeTemporal(idx: number) : boolean {
        this.deleteTemporal.emit(idx.toString());
        this.temporalsFormArray.removeAt(idx);
        return false;
    }
}
