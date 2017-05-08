import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';

import { Distribution } from './distribution';

@Component({
    selector: 'distributions',
    templateUrl: './distribution-list.component.html'
})
export class DistributionListComponent implements OnInit {
    @Input('datasetForm')
    public datasetForm: FormGroup;

    @Input('distributions')
    public distributions: Distribution[];
    distribution: Distribution;

    constructor(private cd: ChangeDetectorRef) { }

    ngOnInit() {
        console.log('Initializing child list', this.distributions);
        this.datasetForm.addControl('distributions', new FormArray([]));
    }

    addDistribution() {
        const distribution: Distribution = {
            id: Math.floor(Math.random() * 100).toString(),
            uri: '',
            title: {no:''},
            description: {no:''},
            accessUrl: [],
            license: '',
            format: [],
            downloadUrl: []
        };
        //this.distributions = this.distributions || [];
        this.distributions.push(distribution);
        this.cd.detectChanges();
        return false;
    }

    removeDistribution(idx: number) {
        if (this.distributions.length > 1) {
            this.distributions.splice(idx, 1);
            (<FormArray>this.datasetForm.get('distributions')).removeAt(idx);
        }
        return false;
    }
}
