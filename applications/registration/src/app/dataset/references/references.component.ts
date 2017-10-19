import {Component, Input, Output, OnInit, EventEmitter} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Dataset} from "../dataset";
import {Reference} from '../reference'
import {CodesService} from "../codes.service";
import {DatasetService} from "../../dataset/dataset.service";

import {DatasetComponent} from "../dataset.component";

@Component({
  selector: 'references',
  templateUrl: './references.component.html',
  styleUrls: ['./references.component.css']
})

export class ReferencesComponent implements OnInit {
  @Input('dataset')
  public dataset: Dataset;

  @Input('reference')
  public reference: Reference;

  @Input('referencesFormArray')
  public referencesFormArray: FormArray;

  @Input('referenceIndex')
  public referenceIndex: number;

  @Input('showDelete')
  public showDelete: boolean;

  @Output()
  onSave = new EventEmitter<boolean>();

  @Output()
  deleteReference:EventEmitter<string> = new EventEmitter()

  public referencesForm: FormGroup;

  referenceTypes = [];
  datasets = [];

  constructor(private fb: FormBuilder,
              private codesService: CodesService,
              private datasetService: DatasetService,
              private parent: DatasetComponent) {
  }

  ngOnInit() {
    this.fetchReferenceTypes();
    this.fetchDatasets();


    if (this.reference) {
      let skosKode = this.reference.referenceType;
    } else {
      let skosKode = "";

    }

    this.referencesForm = this.toFormGroup(this.reference);
    this.referencesFormArray.push(this.referencesForm);

    this.referencesForm.valueChanges.debounceTime(400).distinctUntilChanged().subscribe( refs => {
      console.log("refs.referenceType:" + refs.referenceType);
      console.log("refs.referenceUrl:" + refs.referenceUrl);


      if (refs.referenceType) {
        console.log("refs.referencetype = true");

        this.reference = {
          //midertidig test: må erstattes av generert skoskode
          referenceType: {uri: refs.referenceType, code: 'test', prefLabel: {nb: "testpreflabel"}, selected: false},
          //todo: endre til å bruke skoscode i stedet or datasett når nytt api er klart
          source: {id: refs.referenceUrl, catalog: 'xxx', identifiers: ['yyy'], _lastModified: '919191'}}
      };
      console.log("referenceform.valuechanges - reference after value change:");
      console.log(this.reference);

      this.onSave.emit(true);

    });
  }


  //todo trenges denne i flerlinje-løsnignne?
  focus(e) {
    e.target.childNodes.forEach(node=>{
      if(node.className && node.className.match(/\bng2-tag-input-form\b/)) {
        node.childNodes[1].focus();
      }
    })
  }


  private toFormGroup(reference: Reference) {
    return this.fb.group({
      referenceUrl: [ reference.source.id || '' ],
      referenceType: [ reference.referenceType.uri || '' ]
    });
  }


  fetchReferenceTypes() {
    this.codesService.fetchCodes('referencetypes', 'nb').then( referenceTypes =>
      this.referenceTypes = referenceTypes);
    console.log("referencetypes fetched:");
    console.log(this.referenceTypes);
  }

  fetchDatasets() {
    //todo hente fra service
    let catalogId = this.dataset.catalog;
    this.datasetService.getAll(catalogId).then((datasets: Dataset[]) => {
      this.datasets = datasets;
      //this.datasets = _.sortBy(this.datasets, [a => a.title.nb || ""]);
    });

    console.log("datasets fetched: " + this.datasets);
  }

  removeReference(idx: number) : boolean {
    this.deleteReference.emit(idx.toString());
    this.referencesFormArray.removeAt(idx);
    return false;
  }

}
