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

        this.distributionForm.valueChanges.distinctUntilChanged().subscribe(
            distributionFormElement => {
                console.log("distributionFormElement: ", distributionFormElement);
                this.distribution = {
                    id: this.distribution.id || Math.floor(Math.random() * 1000000).toString(),
                    uri: distributionFormElement.uri || '',
                    type: distributionFormElement.type || '',
                    title: distributionFormElement.title || {'nb': ''},
                    description: distributionFormElement.description || {'nb': ''},
                    downloadURL: [distributionFormElement.downloadURL] || [] as string[],
                    accessURL: [distributionFormElement.accessURL] || [] as string[],
                    format: distributionFormElement.format || [] as string[], 
                    license: new SkosConcept(distributionFormElement.license, {'nb': ''}) || new SkosConcept(),
                    conformsTo: [distributionFormElement.conformsTo] || [] as SkosConcept[],
                    page: (distributionFormElement.page) ? new SkosConcept(distributionFormElement.page, {'nb': ''}): new SkosConcept()
                }
                //this.distribution.accessURL[0] = distributionFormElement.accessURL;
                console.log("this.distribution: ", this.distribution);
                this.cdr.detectChanges();
            }
        );
    }

    private toFormGroup(distribution: Distribution): FormGroup {
        
        console.log("toFormGroup BEFORE: ", this.distribution);
        const formGroup = this.fb.group({
            id: distribution.id || Math.random().toString().substr(2),
            uri: [ distribution.uri || '', Validators.required ],
            type: distribution.type || '',
            title: distribution.title || '',
            description: distribution.description || '', 
            accessURL: distribution.accessURL || [] as string[],
            downloadURL: distribution.downloadURL || [] as string[],
            format: [distribution.format || [] as string[]],
            license: (distribution.license) ? distribution.license.uri : '',
            conformsTo: distribution.conformsTo || [] as SkosConcept[],
            page:  (distribution.page) ? distribution.page.uri : ''
        });
        
        console.log("toFormGroup AFTER: ", this.distribution);
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
