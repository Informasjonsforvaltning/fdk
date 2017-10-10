import {Component, Input, Output, OnInit, EventEmitter} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Dataset} from "../dataset";

import {DatasetComponent} from "../dataset.component";

@Component({
  selector: 'relations',
  templateUrl: './relations.component.html',
  styleUrls: ['./relations.component.css']
})

export class ContentComponent implements OnInit {
  @Input('dataset')
  public dataset: Dataset;

  @Output()
  onSave = new EventEmitter<boolean>();

  public contentForm: FormGroup;

  relationType;
  relationUrl;

  constructor(private fb: FormBuilder,
              private parent: DatasetComponent) {
  }

  ngOnInit() {

  }
}
