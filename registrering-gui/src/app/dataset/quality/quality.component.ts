import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {Dataset} from "../dataset";
import {CodesService} from "../codes.service";


@Component({
    selector: 'quality',
    templateUrl: './quality.component.html',
    styleUrls: [ './quality.component.css' ]
})

export class QualityComponent implements OnInit {
    @Input('datasetForm')
    public datasetForm: FormGroup;

    @Input('dataset')
    public dataset: Dataset;

    public qualityForm: FormGroup;

    frequencies = [];

    constructor(private fb: FormBuilder,
                private codesService: CodesService) {}

    ngOnInit() {
        this.qualityForm = this.toFormGroup(this.dataset);
        this.datasetForm.addControl('quality', this.qualityForm);
        if (this.dataset.accrualPeriodicity) {
            let skosCode = this.dataset.accrualPeriodicity;
            this.frequencies.push(this.codifySkosCodes(skosCode,'no'));
        }

        this.qualityForm.valueChanges.subscribe(
            qualityForm => {
                console.log('qualityForm change: ', qualityForm);
                //console.log('uri:',qualityForm.accrualPeriodicity.uri);
            }
        );

    }

    private toFormGroup(data: Dataset) {
        const formGroup = this.fb.group({
            accrualPeriodicity: [ data.accrualPeriodicity.uri || '' ],
            provenance: [ data.provenance.uri ||''],
            conformsTo: [ data.conformsTo || []]
        });

        return formGroup;
    }

    codifySkosCodes(code, lang) {
        return {value: code['uri'], label: code['prefLabel'][lang]}
    }

    fetchCodes(codeType) {
        this.codesService.fetchCodes(codeType, 'no').then( frequencies =>
            this.frequencies = frequencies);
    }
}
