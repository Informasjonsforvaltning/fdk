import { Component, Input, Output, OnInit, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { PeriodOfTime } from './periodoftime';
import {IMyDpOptions, IMyDateModel} from 'mydatepicker';


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

            if (temporalFormElement.startDate && temporalFormElement.startDate.epoc)
                this.temporal.startDate = temporalFormElement.startDate.epoc;
            else
                delete this.temporal.startDate;

            if (temporalFormElement.endDate && temporalFormElement.endDate.epoc)
                this.temporal.endDate = temporalFormElement.endDate.epoc;
            else
                delete this.temporal.endDate;

            this.cdr.detectChanges();
        }
    );
    }

    private getDateObjectFromUnixTimestamp(timestamp:string) {
        if (!timestamp)
            return {};

        let timestamp2 = parseInt(timestamp);
        if (timestamp2.toString().length === 10)
            timestamp2 = parseInt(timestamp.toString() + "000");

        let date = new Date(timestamp2);
        return {
            date: {
                year: date.getFullYear(),
                month: date.getMonth() + 1,
                day: date.getDate()
            },
            formatted: date.getFullYear() + '-' + ('0' + date.getMonth()).slice(-2) + '-' + date.getDate()
        };
    }

    private toFormGroup(temporal: PeriodOfTime) : FormGroup {
        const formGroup = this.fb.group({
            startDate: [this.getDateObjectFromUnixTimestamp(temporal.startDate)],
            endDate: [this.getDateObjectFromUnixTimestamp(temporal.endDate)]
        });
        return formGroup;
    }

    removeTemporal(idx: number) : boolean {
        this.deleteTemporal.emit(idx.toString());
        this.temporalsFormArray.removeAt(idx);
        return false;
    }
}
