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

    private selectedTypeId = 1;

    private typeIcon: string = "fa fa-cogs";

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
        this.typeModel
            .filter(entry => entry.label == this.distribution.type)
            .forEach(entry => this.selectedTypeId = entry.id);

        this.distributionForm.valueChanges.debounceTime(1000).distinctUntilChanged().subscribe(
            distributionFormElement => {
                console.log("distributionFormElement: ", distributionFormElement);
                this.distribution = {
                    id: this.distribution.id || Math.floor(Math.random() * 1000000).toString(),
                    uri: distributionFormElement.uri || '',
                    type: distributionFormElement.type || '',
                    title: distributionFormElement.title || {'nb': ''},
                    description: distributionFormElement.description || {'nb': ''},
                    downloadURLs: distributionFormElement.downloadURL || [] as string[],
                    accessURLs: [distributionFormElement.accessURL] || [] as string[],
                    formats: distributionFormElement.formats || [] as string[],
                    license: distributionFormElement.license || {} as SkosConcept,
                    conformsTos: distributionFormElement.conformsTo || [] as SkosConcept[],
                    page: distributionFormElement.page || {} as SkosConcept
                }
                //this.distribution.accessURL[0] = distributionFormElement.accessURL;
                console.log("this.distribution: ", this.distribution);
                this.cdr.detectChanges();
            }
        );
    }

    private toFormGroup(distribution: Distribution): FormGroup {
        const formGroup = this.fb.group({
            id: [ distribution.id || Math.random().toString().substr(2)],
            uri: [ distribution.uri || '', Validators.required ],
            type: [distribution.type || ''],
            title: [ distribution.title || {'nb': ''}],
            description: [ distribution.description || {'nb': ''}], 
            accessURLs: [ distribution.accessURLs || [] as string[]],
            downloadURLs: [ distribution.downloadURLs || [] as string[]],
            formats: [ distribution.formats || [] as string[]],
            license: [ distribution.license || {} as SkosConcept],
            conformsTos: [ distribution.conformsTos || [] as SkosConcept[]],
            page: [ distribution.page || {} as SkosConcept]
        });
        return formGroup;
    } 

    toggleForm(): void {
        this.showForm = !this.showForm;
    }

    removeDistribution(idx: number): boolean {
        this.deleteDistribution.emit(idx.toString());
        this.distributionsFormArray.removeAt(idx);
        return false;
    }

    focus(e) : void {
        e.target.childNodes.forEach(node=>{
            if(node.className && node.className.match(/\bng2-tag-input-form\b/)) {
                node.childNodes[1].focus();
            }
        })
    }
}
