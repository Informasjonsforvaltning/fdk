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
  @Input('references')
  public references: Reference[];

  @Output()
  onSave = new EventEmitter<boolean>();

  public referencesForm: FormGroup;

  //references: Reference[];
  reference: Reference;
  referenceTypes = [];

  constructor(private fb: FormBuilder,
              private codesService: CodesService,
              private parent: DatasetComponent) {
  }

  ngOnInit() {
    this.fetchReferenceTypes();
    this.referencesForm = this.toFormGroup(this.references);

    //dummy
    this.references = [
      {
        referenceType: "http://www.w3.org/2002/07/hasVersion",
        source: "http://www.vg.no"
      }
    ]

  }

  focus(e) {
    e.target.childNodes.forEach(node=>{
      if(node.className && node.className.match(/\bng2-tag-input-form\b/)) {
        node.childNodes[1].focus();
      }
    })
  }

  //todo: håndtere flere refereanser
  private toFormGroup(references: Reference[]) {
    return this.fb.group({
      referenceUrl: "http://www.w3.org/2002/07/hasVersion",
      referenceType: "http://www.vg.no"
    });
  }

  fetchReferenceTypes() {
    this.codesService.fetchCodes('referencetypes', 'nb').then( referenceTypes =>
      this.referenceTypes = referenceTypes);
  }
}
