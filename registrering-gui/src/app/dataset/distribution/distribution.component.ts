import { Component, Input, Output, OnInit, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

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

    @Output()
    deleteDistribution:EventEmitter<string> = new EventEmitter();

    public distributionForm: FormGroup;


    constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef) {}

    ngOnInit() {
       if(this.distribution.ui_visible) this.showForm = true;
       this.distributionForm = this.toFormGroup(this.distribution);
       this.distributionsFormArray.push(this.distributionForm);
    }

    private toFormGroup(distribution: Distribution) {
        const formGroup = this.fb.group({
            id: [ distribution.id || Math.random().toString().substr(2)],
            uri: [ distribution.uri || '', Validators.required ],
            title: [ distribution.title || '', Validators.required ],
            description: [ distribution.description ? distribution.description[this.language] : '' ],
            accessURL: [ distribution.accessURL || []],
            downloadURL: [ distribution.downloadURL || []],
            license: [ distribution.license ],
            format: [ distribution.format || '' ]
        });
        return formGroup;
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
