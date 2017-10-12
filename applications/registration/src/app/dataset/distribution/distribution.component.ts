import { Component, Input, Output, OnInit, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SkosConcept } from '../skosConcept';
import { Distribution } from './distribution';

@Component({
    selector: 'distribution',
    templateUrl: './distribution.component.html',
    styleUrls: [ './distribution.component.css' ]
  })

export class DistributionFormComponent implements OnInit {
    language:string = 'nb';
    showForm:boolean = false;

    @Input('distributionsFormArray')
    public distributionsFormArray: FormArray;

    @Input('distribution')
    public distribution: Distribution;

    @Input('distributionIndex')
    public distributionIndex: number;

    @Input('ui_visible')
    public ui_visible: boolean;

    @Input('showDelete')
    public showDelete: boolean;

    @Output()
    deleteDistribution: EventEmitter<string> = new EventEmitter();

    public distributionForm: FormGroup;

    private typeModel = [];

    constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef) {
        this.typeModel = [
            {
                id: 1,
                label: 'API'
            },
            {
                id: 2,
                label: 'Feed'
            },
            {
                id: 3,
                label: 'Nedlastbar fil'
            }
        ]
    }

    ngOnInit() {
       if(this.ui_visible) this.showForm = true; 
       this.distributionForm = this.toFormGroup(this.distribution);
       this.distributionsFormArray.push(this.distributionForm);

       this.distributionForm.valueChanges.debounceTime(40).distinctUntilChanged().subscribe(
            distributionFormElement => {
                console.log(distributionFormElement);
                this.distribution = {
                    id: this.distribution.id || Math.floor(Math.random() * 1000000).toString(),
                    uri: distributionFormElement.uri || '',
                    type: distributionFormElement.controls.type || 'API',
                    title: distributionFormElement.title || {'nb': ''},
                    description: {'nb': ''},
                    downloadURL: [] as string[],
                    accessURL: [] as string[],
                    format: [] as string[],
                    license: {} as SkosConcept,
                    conformsTo: [] as SkosConcept[],
                    page: {} as SkosConcept
                }
                console.log()
            }
        );
    }

    private toFormGroup(distribution: Distribution) {
        const formGroup = this.fb.group({
            id: [ distribution.id || Math.random().toString().substr(2)],
            uri: [ distribution.uri || '', Validators.required ],
            type: [distribution.type || ''],
            title: [ distribution.title || {'nb': ''}],
            description: [ distribution.description || {'nb': ''}], 
            accessURL: [ distribution.accessURL || [] as string[]],
            downloadURL: [ distribution.downloadURL || [] as string[]],
            format: [ distribution.format || [] as string[]],
            license: [ distribution.license || {} as SkosConcept],
            conformsTo: [ distribution.conformsTo || [] as SkosConcept[]],
            page: [ distribution.page || {} as SkosConcept]
        });
        return formGroup;
    } 

    public onSave(ok: boolean): void {
    }

    toggleForm() {
        this.showForm = !this.showForm;
    }

    removeDistribution(idx: number) {
        this.deleteDistribution.emit(idx.toString());
        this.distributionsFormArray.removeAt(idx);
        return false;
    }

    focus(e) {
        e.target.childNodes.forEach(node=>{
            if(node.className && node.className.match(/\bng2-tag-input-form\b/)) {
                node.childNodes[1].focus();
            }
        })
    }
}
