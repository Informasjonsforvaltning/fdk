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

  //references: Reference[];
  reference: Reference;
  referenceTypes = [];
  emptyReference = [
    { referenceType : {
      uri : '',
      code : '',
      prefLabel: {
        'no' : ''
      },
      selected: true
    },
    source : ''}
  ];
  emptyReferenceType = {
    uri : '',
    code : '',
    prefLabel: {
      'no' : ''
    },
    selected: true
  };

  constructor(private fb: FormBuilder,
              private codesService: CodesService,
              private parent: DatasetComponent) {
  }

  ngOnInit() {
    this.fetchReferenceTypes();

    //dummy - fjernes etter at lagring er i orden
    //this.dataset.references = [
    //  {
    //    referenceType: "http://www.w3.org/2002/07/hasVersion",
    //    source: "http://www.nrk.no"
    //  }
    //]

    if (this.dataset.references) {
      let skosKode = this.dataset.references[0].referenceType;
    } else {

    }
    this.dataset.references = this.dataset.references || this.emptyReference;
    this.referencesForm = this.toFormGroup(this.dataset.references);

    this.referencesForm.valueChanges.debounceTime(400).distinctUntilChanged().subscribe( refs => {
      console.log("refs:");
      console.log(refs);

      if (refs.referenceType) {
        console.log("refs.referencetype = true");
        //todo håndtere flere
        this.dataset.references[0] = {
          referenceType: refs.referenceType,
          source: refs.referenceUrl}
      };
      console.log("referenceform.valuechanges");
      console.log(this.dataset.references);

      this.onSave.emit(true);

    });
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
      referenceUrl: [ references[0].source || '' ],
      referenceType: [ references[0].referenceType || this.emptyReferenceType ]
    });
  }


  fetchReferenceTypes() {
    this.codesService.fetchCodes('referencetypes', 'nb').then( referenceTypes =>
      this.referenceTypes = referenceTypes);
    console.log("referencetypes fetched:");
    console.log(this.referenceTypes);
  }
}
