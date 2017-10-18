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

    @Input('componentTitle')
    public componentTitle: string;

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
                this.cdr.detectChanges();
            }
        );
    }

    private toFormGroup(distribution: Distribution): FormGroup {
        const formGroup = this.fb.group({
            id: distribution.id || Math.random().toString().substr(2),
            uri: [ distribution.uri || '', Validators.required ],
            type: distribution.type || this.typeModel[this.selectedTypeId].label,
            title: distribution.title || '',
            description: distribution.description['nb'] || '', 
            accessURL: distribution.accessURL || [] as string[],
            downloadURL: distribution.downloadURL || [] as string[],
            format: [distribution.format || [] as string[]],
            license: (distribution.license) ? distribution.license.uri : '',
            conformsToPrefLabel: (distribution.conformsTo && distribution.conformsTo[0] && distribution.conformsTo[0].prefLabel) ? 
                                    distribution.conformsTo[0].prefLabel['nb'] : '',
            conformsToUri: (distribution.conformsTo && distribution.conformsTo[0] && distribution.conformsTo[0].uri) ? 
                                distribution.conformsTo[0].uri : '',
            page: (distribution.page) ? distribution.page.uri : ''
        });
        console.log(this.componentTitle + ".formGroup: ", )
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

    public static setDistributions(distributions: any[]): any[] {
        console.log('samples before setDistributions: ', distributions);
        if (distributions) {
            distributions.forEach(distribution => {
                distribution.id = distribution.id || Math.floor(Math.random() * 1000000).toString();
                distribution.uri = distribution.uri || "";
                distribution.type = distribution.type || "";
                distribution.title = distribution.title || {"nb": ""};

                distribution.description = (typeof distribution.description === 'object') ? 
                                            distribution.description : {"nb": distribution.description};

                distribution.downloadURL = (distribution.downloadURL instanceof Array) ? 
                                            distribution.downloadURL : (distribution.downloadURL) ?
                                                [distribution.downloadURL] : [] as string[]; 

                distribution.accessURL = (distribution.accessURL instanceof Array) ? 
                                            distribution.accessURL : (distribution.accessURL) ?
                                                [distribution.accessURL] : [] as string[];

                distribution.format = distribution.format || [] as string[];

                distribution.license = (distribution.license instanceof SkosConcept) ? 
                                        distribution.license : ((distribution.license) ? 
                                            new SkosConcept(distribution.license, {"nb": ""}) : new SkosConcept());

                distribution.conformsTo = [new SkosConcept(distribution.conformsToUri, {'nb': distribution.conformsToPrefLabel})] || [] as SkosConcept[]; 
                
                distribution.page = (distribution.page instanceof SkosConcept) ? 
                                        distribution.page : ((distribution.page) ? 
                                            new SkosConcept(distribution.page, {"nb": ""}) : new SkosConcept());
                                            
            });
        }
        
        console.log('samples after setDistributions: ', distributions);
        return distributions;
    }
}
