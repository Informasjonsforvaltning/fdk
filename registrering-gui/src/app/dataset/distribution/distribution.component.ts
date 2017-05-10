import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Distribution } from './distribution';

@Component({
    selector: 'distribution',
    templateUrl: './distribution.component.html',
    styleUrls: [ './distribution.component.css' ]
  })

export class DistributionFormComponent implements OnInit {
    language:string = 'nb';
    @Input('distributions')
    public distributions: FormArray;

    @Input('distribution')
    public distribution: Distribution;

    @Output()
    modelChanged:EventEmitter<string> = new EventEmitter();

    public distributionForm: FormGroup;

    constructor(private fb: FormBuilder) {}

    ngOnInit() {
        this.distributionForm = this.toFormGroup(this.distribution);
        this.distributions.push(this.distributionForm);
    }

    private toFormGroup(distribution: Distribution) {
        console.log('distribution is ', distribution);
        const formGroup = this.fb.group({
            id: [ distribution.id ],
            uri: [ distribution.uri || '', Validators.required ],
            title: [ distribution.title[this.language] || '', Validators.required ],
            description: [ distribution.description ],
            accessUrl: [ distribution.accessUrl ],
            license: [ distribution.license ],
            format: [ distribution.format ],
            downloadUrl: [ distribution.downloadUrl ]
        });

        return formGroup;
    }
}
