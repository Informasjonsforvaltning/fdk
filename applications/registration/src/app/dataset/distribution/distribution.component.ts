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

    @Output()
    save: EventEmitter<boolean> = new EventEmitter();

    public distributionForm: FormGroup;

    private typeModel = [];

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
       this.setTypeIcon();
       console.log("this.typeIcon: ", this.typeIcon);

       this.distributionForm.valueChanges.debounceTime(1000).distinctUntilChanged().subscribe(
            distributionFormElement => {
                console.log("distributionFormElement: ", distributionFormElement);
                this.distribution = {
                    id: this.distribution.id || Math.floor(Math.random() * 1000000).toString(),
                    uri: distributionFormElement.uri || '',
                    type: distributionFormElement.type || 'API',
                    title: distributionFormElement.title || {'nb': ''},
                    description: distributionFormElement.description || {'nb': ''},
                    downloadURL: distributionFormElement.downloadURL || [] as string[],
                    accessURL: distributionFormElement.accessURL || [] as string[],
                    format: distributionFormElement.format || [] as string[],
                    license: distributionFormElement.license || {} as SkosConcept,
                    conformsTo: distributionFormElement.conformsTo || [] as SkosConcept[],
                    page: distributionFormElement.page || {} as SkosConcept
                }
                console.log("this.distribution: ", this.distribution);
                this.setTypeIcon();

                console.log("this.typeIcon: ", this.typeIcon);
                this.cdr.detectChanges();
                this.save.emit();
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
        
        console.log("this.distribution b4: ", this.distribution.type);
        this.distribution = {
            id: this.distribution.id,
            uri: this.distribution.uri || '',
            type: this.distribution.type || 'API',
            title: this.distribution.title || {'nb': ''},
            description: this.distribution.description || {'nb': ''},
            downloadURL: this.distribution.downloadURL || [] as string[],
            accessURL: this.distribution.accessURL || [] as string[],
            format: this.distribution.format || [] as string[],
            license: this.distribution.license || {} as SkosConcept,
            conformsTo: this.distribution.conformsTo || [] as SkosConcept[],
            page: this.distribution.page || {} as SkosConcept
        }
        
        this.setTypeIcon();
        this.cdr.detectChanges();
        //console.log("this.typeIcon: ", this.typeIcon);
        console.log("this.distribution after: ", this.distribution.type);
        this.save.emit();
        
        console.log("this.distribution after save: ", this.distribution.type);
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

    public setTypeIcon() : void {
        if (this.distribution.type === "Feed") {
            this.typeIcon = "fa fa-rss";
        } else if (this.distribution.type === "Nedlastbar fil") {
            this.typeIcon = "fa fa-download";
        } else {
            this.typeIcon = "fa fa-cogs";
        }
    }
}
