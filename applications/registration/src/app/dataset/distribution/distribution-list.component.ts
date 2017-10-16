import { ChangeDetectorRef, Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';

import { Distribution } from './distribution';
import { Dataset } from '../dataset';
import {DistributionFormComponent} from './distribution.component';
import { SkosConcept } from '../skosConcept';

@Component({
    selector: 'distributions',
    templateUrl: './distribution-list.component.html'
})
export class DistributionListComponent implements OnInit {
    @Input('distributionsFormArray')
    public distributionsFormArray: FormArray;

    @Input('datasetForm')
    public datasetForm: FormGroup;

    @Input('distributions')
    public distributions: Distribution[];

    @Input('title')
    public title: string;
    
    showDelete: boolean = false;    

    constructor(private cd: ChangeDetectorRef) { }

    ngOnInit() {
        this.distributions = this.distributions || [];
        if (this.distributions.length == 0) {
            this.addDistribution();
        }
        this.showHideDelete();
    }

    addDistribution() {
        const distribution: Distribution = { 
            id: Math.floor(Math.random() * 1000000).toString(),
            uri: '',
            type: '',
            title: {'nb': ''},
            description: {'nb': ''},
            downloadURL: [] as string[],
            accessURL: [] as string[],
            format: [] as string[],
            license: {} as SkosConcept,
            conformsTo: [] as SkosConcept[],
            page: {} as SkosConcept
        };
        console.log(distribution);
        this.distributions.push(distribution);
        this.cd.detectChanges();
        this.showHideDelete();
        return false;
    }

    removeDistribution(idx: number) {
        if (this.distributions.length > 0) {
            this.distributions.splice(idx, 1);
            this.distributionsFormArray.removeAt(idx);
        }        
        this.showHideDelete();
        return false;
    }

    showHideDelete() {
        if (this.distributions.length > 1)
            this.showDelete = true;
        else
            this.showDelete = false;
        console.log("showDelete: ", this.showDelete);
    }
}
