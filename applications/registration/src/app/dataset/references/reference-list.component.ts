import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {FormArray, FormGroup} from '@angular/forms';
import {Reference} from '../reference';
import {Dataset} from "../dataset";
import {SkosConcept} from "../skosConcept";
import {Skoscode} from "../skoscode";


@Component({
    selector: 'referencelist',
    templateUrl: './reference-list.component.html'
})
export class ReferenceListComponent implements OnInit {

    @Input('referencesFormArray')
    public referencesFormArray: FormArray;

    @Input('datasetForm')
    public datasetForm: FormGroup;

    @Input('references')
    public references: Reference[];

    @Input('dataset')
    public dataset: Dataset;

    @Input('title')
    public title: string;

    showDelete: boolean = false;

    reference: Reference;

    constructor(private cd: ChangeDetectorRef) { }

    ngOnInit() {
        this.references = this.references || [];
        if (this.references.length == 0) {
            this.addReference();
        }
        this.showHideDelete();
    }

    addReference() {
        const newReference: Reference = {
            referenceType: {
                uri: "",
                code: "",
                prefLabel: {
                    "nb": ""
                }
            },
            source: new SkosConcept()
        };
        this.references.push(newReference);
        this.cd.detectChanges();
        this.showHideDelete();
        return false;
    }

    removeReference(idx: number) {
        if (this.references.length > 0) {
            this.references.splice(idx, 1);
            this.referencesFormArray.removeAt(idx);
        }
        if (this.references.length == 0) {
            this.addReference();
        }
            this.showHideDelete();
        return false;
    }

    showHideDelete() {
        if (this.references.length > 1)
            this.showDelete = true;
        else
            this.showDelete = false;
    }
}

