import {Component, Input, Output, OnInit, EventEmitter, ChangeDetectorRef} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Dataset} from "../dataset";
import {Reference} from '../reference'
import {CodesService} from "../codes.service";
import {DatasetService} from "../../dataset/dataset.service";
import {DatasetComponent} from "../dataset.component";
import {Skoscode} from "../skoscode";
import {SkosConcept} from "../skosConcept";
import * as _ from "lodash";

@Component({
    selector: 'references',
    templateUrl: './references.component.html',
    styleUrls: ['./references.component.css']
})

export class ReferencesComponent implements OnInit {
    @Input('dataset')
    public dataset: Dataset;

    @Input('reference')
    public reference: Reference;

    @Input('referencesFormArray')
    public referencesFormArray: FormArray;

    @Input('referenceIndex')
    public referenceIndex: number;

    @Input('showDelete')
    public showDelete: boolean;

    @Output()
    onSave = new EventEmitter<boolean>();

    @Output()
    deleteReference:EventEmitter<string> = new EventEmitter()

    public referencesForm: FormGroup;

    referenceTypes = []; // Skoscode
    sources = []; // SkosConcept

    constructor(
        private fb: FormBuilder,
        private cdr: ChangeDetectorRef,
        private codesService: CodesService,
        private datasetService: DatasetService,
        private parent: DatasetComponent) {
    }

    ngOnInit() {
        this.fetchReferenceTypes();
        this.fetchSources();
        this.referencesForm = this.toFormGroup(this.reference);
        this.referencesFormArray.push(this.referencesForm);

        this.referencesForm.valueChanges.debounceTime(40).distinctUntilChanged().subscribe( 
            refs => {
                console.log("THIS HAPPENS")
                if (refs.referenceTypeForm && this.referenceTypes.length > 0) {
                    let referenceType = this.referenceTypes.find( reference => reference.value === refs.referenceTypeForm);
                    this.reference.referenceType = {
                            uri: referenceType.value,
                            code: "",
                            prefLabel: {
                                "nb": referenceType.label || ""
                            }
                        };
                } else {
                    this.reference.referenceType = {
                        uri: "",
                        code: "",
                        prefLabel: {
                            "nb": ""
                        }
                    };
                    this.reference.source = new SkosConcept();
                }
                if (refs.sourceForm && this.sources.length > 0) {
                    let source = this.sources.find( src => src.value === refs.sourceForm);
                    this.reference.source = new SkosConcept(
                        source.value,
                        {
                            "nb" : (source.label === "Ukjent tittel") ? "" : source.label
                        }
                    );
                } else {
                    this.reference.source = new SkosConcept();
                }
                this.cdr.detectChanges();
                this.onSave.emit(true);
            }
        );
    }


    //todo trenges denne i flerlinje-løsnignne?
    focus(e) {
        e.target.childNodes.forEach( node => {
            if(node.className && node.className.match(/\bng2-tag-input-form\b/)) {
                node.childNodes[1].focus();
            }
        })
    }


    private toFormGroup(reference: Reference) {
        return this.fb.group({
            sourceForm: [ reference.source.uri || '' ],
            referenceTypeForm: [ reference.referenceType.uri || '' ]
        });
    }


    fetchReferenceTypes() {
        this.codesService.fetchCodes('referencetypess', 'nb')
            .then( referenceTypes => {
                referenceTypes = _.sortBy(referenceTypes, [reference => reference.label || ""]);
                this.referenceTypes = referenceTypes;                
            }
        );
    }

    fetchSources() {
        let catalogId = this.dataset.catalogId;
        let sources = [];
        this.datasetService.getAll(catalogId)  
            .then((datasets: Dataset[]) => {
                datasets.forEach( dataset => {
                    let source = {
                        value: dataset.id,
                        label: dataset.title["no"]
                    }
                    if (!source.label) {
                        source.label = "Ukjent tittel";
                    }
                    sources.push(source);
                });
                sources = _.sortBy(sources, [src => src.label || ""]);
                this.sources = sources;
            }
        );
    }

    removeReference(idx: number) : boolean {
        this.deleteReference.emit(idx.toString());
        this.referencesFormArray.removeAt(idx);
        return false;
    }

}
