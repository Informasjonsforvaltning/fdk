import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {FormBuilder, FormGroup} from "@angular/forms";
import {Dataset} from "../dataset";
import {CodesService} from "../codes.service";


@Component({
    selector: 'accessRights',
    templateUrl: './accessRights.component.html',
    styleUrls: [ './accessRights.component.css' ]
})

export class AccessRightsComponent implements OnInit {

    @Input('dataset')
    public dataset: Dataset;

    @Output()
    onSave = new EventEmitter<boolean>();

    public accessRightsForm: FormGroup;

    comment: string[];
    processing: string[];
    delivery: string[];
    // frequencies = [];
    // provenancestatements = [];

    constructor(private fb: FormBuilder,
                private codesService: CodesService)
    { }

    ngOnInit() {
        this.accessRightsForm = this.fb.group({
            accessRightsModel: 'offentlig'
        });
        this.accessRightsForm = this.toFormGroup(this.dataset);

        this.comment = [];
        if (this.dataset.comment) {
            this.comment = this.dataset.comment.map(comment => {
                return comment['nb'];
            });
        }
        this.processing = [];
        if (this.dataset.processing) {
            this.processing = this.dataset.processing.map(processing => {
                return processing['nb'];
            });
        }
        this.delivery = [];
        if (this.dataset.delivery) {
            this.delivery = this.dataset.delivery.map(delivery => {
                return delivery['nb'];
            });
        }

        this.accessRightsForm.valueChanges.debounceTime(400).distinctUntilChanged().subscribe(
            accessRights => {

                if (accessRights.comment.length === 0) {
                    this.dataset.comment = null;
                } else {
                    this.dataset.comment = accessRights.comment.map(comment => {
                        return {nb: comment}
                    });
                }

                if (accessRights.processing.length === 0) {
                    this.dataset.processing = null;
                } else {
                    this.dataset.processing = accessRights.processing.map(processing => {
                        return {nb: processing}
                    });
                }

                if (accessRights.delivery.length === 0) {
                    this.dataset.delivery = null;
                } else {
                    this.dataset.delivery = accessRights.delivery.map(delivery => {
                        return {nb: delivery}
                    });
                }


                // this.onSave.emit(true);
            }
        );
        //
        // if (this.dataset.accrualPeriodicity) {
        //     let skosCode = this.dataset.accrualPeriodicity;
        //     this.frequencies.push(this.codifySkosCodes(skosCode,'no'));
        // } else {
        //     this.dataset.accrualPeriodicity = { uri: '', prefLabel: {no: ''}};
        // }
        //
        // if (this.dataset.provenance) {
        //     let skosCode = this.dataset.provenance;
        //     this.provenancestatements.push(this.codifySkosCodes(skosCode,'nb'));
        // } else {
        //     this.dataset.provenance = { uri: '', prefLabel: {nb:''}};
        // }
        //
        // this.dataset.conformsTos = this.dataset.conformsTos || [];
        //
        // this.accessRightsForm = this.toFormGroup(this.dataset);
        //
        // this.accessRightsForm.valueChanges.debounceTime(400).distinctUntilChanged().subscribe(
        //     quality => {
        //
        //         if (quality.provenance) {
        //             this.dataset.provenance = {
        //                 uri: quality.provenance,
        //                 prefLabel: {'nb': this.getLabel(this.provenancestatements, quality.provenance)}
        //             };
        //         }
        //
        //         if (quality.accrualPeriodicity) {
        //
        //             this.dataset.accrualPeriodicity = {
        //                 uri: quality.accrualPeriodicity,
        //                 prefLabel: {'no': this.getLabel(this.frequencies, quality.accrualPeriodicity)}
        //             };
        //
        //         }
        //
        //         if (quality.conformsTo) {
        //             this.dataset.conformsTos = quality.conformsTo;
        //         }
        //
        //         this.onSave.emit(true);
        //     }
        // );

    }


    private toFormGroup(data: Dataset) {
        return this.fb.group({
            comment: [this.comment],
            processing: [this.processing],
            delivery: [this.delivery]
        });
    }

    codifySkosCodes(code, lang) {
        return {value: code['uri'], label: code['prefLabel'][lang]}
    }

    // fetchFrequencies() {
    //     this.codesService.fetchCodes('frequencies', 'no').then( frequencies =>
    //         this.frequencies = frequencies);
    // }

    // fetchProvenances() {
    //     this.codesService.fetchCodes('provenancestatements', 'nb').then( provenances =>
    //         this.provenancestatements = provenances);
    // }

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
