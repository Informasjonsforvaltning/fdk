import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';

import { Distribution } from './distribution';
import { Dataset } from '../dataset';
import {DistributionFormComponent} from './distribution.component';

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

    distribution: Distribution;

    constructor(private cd: ChangeDetectorRef) { }

    ngOnInit() {
    }

    addDistribution() {
        const distribution: Distribution = {
            id: Math.floor(Math.random() * 1000000).toString(),
            uri: '',
            title: null,
            description: null,
            accessURL: [],
            downloadURL: [],
            license: '',
            format: [],
            ui_visible: true
        };
        this.distributions.push(distribution);
        this.cd.detectChanges();
      return false;
    }

    removeDistribution(idx: number) {
        if (this.distributions.length > 0) {
            this.distributions.splice(idx, 1);
            this.distributionsFormArray.removeAt(idx);
        }
        return false;
    }
}
