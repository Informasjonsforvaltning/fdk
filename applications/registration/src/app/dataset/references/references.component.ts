import {Component, Input, Output, OnInit, EventEmitter} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Dataset} from "../dataset";
import {Reference} from '../reference'
import {CodesService} from "../codes.service";

import {DatasetComponent} from "../dataset.component";

@Component({
  selector: 'references',
  templateUrl: './references.component.html',
  styleUrls: ['./references.component.css']
})

export class ReferencesComponent implements OnInit {
  @Input('dataset')
  public dataset: Dataset;

  @Output()
  onSave = new EventEmitter<boolean>();

  public referencesForm: FormGroup;

  references: Reference[];
  referenceTypes = [];

  constructor(private fb: FormBuilder,
              private codesService: CodesService,
              private parent: DatasetComponent) {
  }

  ngOnInit() {
    this.fetchReferenceTypes();
    this.referencesForm = this.toFormGroup(this.dataset);

  }

  focus(e) {
    e.target.childNodes.forEach(node=>{
      if(node.className && node.className.match(/\bng2-tag-input-form\b/)) {
        node.childNodes[1].focus();
      }
    })
  }

  private toFormGroup(data: Dataset) {
    return this.fb.group({
      references: [this.references]
    });
  }

  fetchReferenceTypes() {
    this.codesService.fetchCodes('referencetypes', 'nb').then( referenceTypes =>
      this.referenceTypes = referenceTypes);
  }
}
