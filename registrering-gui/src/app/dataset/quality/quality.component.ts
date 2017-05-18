import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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

    @Output()
    onSave = new EventEmitter<boolean>();

    public qualityForm: FormGroup;

    frequencies = [];
    provenancestatements = [];

    constructor(private fb: FormBuilder,
                private codesService: CodesService)
    { }

    ngOnInit() {

        if (this.dataset.accrualPeriodicity) {
            let skosCode = this.dataset.accrualPeriodicity;
            this.frequencies.push(this.codifySkosCodes(skosCode,'no'));
        } else {
            this.dataset.accrualPeriodicity = { uri: '', prefLabel: {no: ''}};
        }

        if (this.dataset.provenance) {
            let skosCode = this.dataset.provenance;
            this.provenancestatements.push(this.codifySkosCodes(skosCode,'nb'));
        } else {
            this.dataset.provenance = { uri: '', prefLabel: {nb:''}};
        }

        this.dataset.conformsTos = this.dataset.conformsTos || [];

        this.qualityForm = this.toFormGroup(this.dataset);

        this.qualityForm.valueChanges.debounceTime(400).distinctUntilChanged().subscribe(
            quality => {

                if (quality.provenance) {
                    this.dataset.provenance = {
                        uri: quality.provenance,
                        prefLabel: {'nb': this.getLabel(this.provenancestatements, quality.provenance)}
                    };
                }

                if (quality.accrualPeriodicity) {

                    this.dataset.accrualPeriodicity = {
                        uri: quality.accrualPeriodicity,
                        prefLabel: {'no': this.getLabel(this.frequencies, quality.accrualPeriodicity)}
                    };

                }

                if (quality.conformsTo) {
                    this.dataset.conformsTos = quality.conformsTo;
                }

                this.onSave.emit(true);
            }
        );

    }


    private toFormGroup(data: Dataset) {
        return this.fb.group({
            accrualPeriodicity: [ data.accrualPeriodicity.uri || '' ],
            provenance: [ data.provenance.uri || ''],
            conformsTo: [ data.conformsTos ]
        });
    }

    codifySkosCodes(code, lang) {
        return {value: code['uri'], label: code['prefLabel'][lang]}
    }

    fetchFrequencies() {
        this.codesService.fetchCodes('frequencies', 'no').then( frequencies =>
            this.frequencies = frequencies);
    }

    fetchProvenances() {
        this.codesService.fetchCodes('provenancestatements', 'nb').then( provenances =>
            this.provenancestatements = provenances);
    }

    getLabel(codeList, forCode:string): string {
        let label = '';
        codeList.forEach(code => {
            if (code.value === forCode) {
                label = code.label;
                return false;
            }
        });

        return label;
    }
}
