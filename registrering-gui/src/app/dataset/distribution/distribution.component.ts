import { Component, Input, OnInit } from '@angular/core';
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

    public distributionForm: FormGroup;

    constructor(private fb: FormBuilder) {}

    ngOnInit() {
        this.distributionForm = this.toFormGroup(this.distribution);
        this.distributions.push(this.distributionForm);
    }

    private toFormGroup(data: Distribution) {
        const formGroup = this.fb.group({
            id: [ data.id ],
            uri: [ data.uri || '', Validators.required ],
            title: [ data.title[this.language] || '', Validators.required ],
            description: [ data.description ],
            accessUrl: [ data.accessUrl ],
            license: [ data.license ],
            format: [ data.format ],
            downloadUrl: [ data.downloadUrl ]
        });

        return formGroup;
    }
}
