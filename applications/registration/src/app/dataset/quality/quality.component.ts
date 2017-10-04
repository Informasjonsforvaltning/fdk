import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {Dataset} from "../dataset";
import {CodesService} from "../codes.service";
import {DatasetComponent} from "../dataset.component";
import * as _ from 'lodash';


@Component({
    selector: 'quality',
    templateUrl: './quality.component.html',
    styleUrls: [ './quality.component.css' ]
})

export class QualityComponent implements OnInit {

    @Input('dataset')
    public dataset: Dataset;

    @Output()
    onSave = new EventEmitter<boolean>();

    public qualityForm: FormGroup;

    frequencies = [];
    provenancestatements = [];
    provenancesModel:any[];
    selectedProvenanceIdx = 0;
    currentness;

    constructor(private fb: FormBuilder,
                private codesService: CodesService,
                private parent: DatasetComponent)
    {
      // Hardcode this since the service code service takes time to finish

      this.provenancesModel = [
        {
          id: 3,
          label: 'Vedtak',
          uri: 'http://data.brreg.no/datakatalog/provinens/vedtak'
        },
        {
          id: 1,
          label: 'Brukerinnsamlede data',
          uri: 'http://data.brreg.no/datakatalog/provinens/bruker'
        },
        {
          id: 2,
          label: 'Tredjepart',
          uri: 'http://data.brreg.no/datakatalog/provinens/tredjepart'
        }

      ]
    }

    ngOnInit() {
        this.fetchFrequencies();
        this.fetchProvenances();

        if (this.dataset.accrualPeriodicity) {
            let skosCode = this.dataset.accrualPeriodicity;
            skosCode.prefLabel = skosCode.prefLabel || { 'no': this.getLabel(this.frequencies, skosCode.uri)};
            this.frequencies.push(this.codifySkosCodes(skosCode,'no'));
        } else {
            this.dataset.accrualPeriodicity = { uri: '', prefLabel: {no: ''}};
        }

        this.dataset.provenance = this.dataset.provenance || { uri: '', prefLabel: {nb:''}};

        if (this.dataset.hasCurrentnessAnnotation) {
          this.currentness = this.dataset.hasCurrentnessAnnotation.hasBody.no;
        }

        this.qualityForm = this.toFormGroup(this.dataset);

        this.qualityForm.valueChanges.debounceTime(400).distinctUntilChanged().subscribe(
            quality => {

                if (quality.provenance) {
                    let uri = "";
                    let label = "";
                    this.provenancesModel.forEach( provenanceValue => {
                        if (quality.provenance === provenanceValue.id) {
                          uri = provenanceValue.uri;
                          label = this.getLabel(this.provenancestatements, provenanceValue.uri);
                        }
                    });
                    this.dataset.provenance = {
                        uri: uri,
                        prefLabel: {'nb': label}
                    };
                }

                if (quality.accrualPeriodicity) {

                    this.dataset.accrualPeriodicity = {
                        uri: quality.accrualPeriodicity,
                        prefLabel: {'no': this.getLabel(this.frequencies, quality.accrualPeriodicity)}
                    };
                }

                if (quality.modified && quality.modified.formatted) {
                    let date = quality.modified.formatted.replace(/\./g, "-");
                    let value = date.split("-");
                    // TODO make this more robust
                    if (value[2].length > 2) {
                      this.dataset.modified = value[2] + '-' + value[1] + '-' + value[0];
                    } else {
                      this.dataset.modified = date;
                    }
                }
                if (_.isEmpty(quality.modified)) {
                  this.dataset.modified = null;
                }

              if (quality.currentness) {
                  this.dataset.hasCurrentnessAnnotation = {
                    inDimension: "iso:Currentness",
                    motivatedBy: "dqv:qualityAssessment",
                    hasBody: {"no": quality.currentness}
                  }
                }

                this.parent.buildProvenanceSummary();

                this.onSave.emit(true);
            }
        );

        this.provenancesModel
          .filter(entry => entry.uri == this.dataset.accessRights.uri)
              .forEach(entry => this.selectedProvenanceIdx = entry.id)

    }


    private toFormGroup(data: Dataset) {
        return this.fb.group({
            accrualPeriodicity: [ data.accrualPeriodicity.uri || '' ],
            provenance: [ data.provenance.uri || ''],
            modified: [ this.parent.getDateObjectFromUnixTimestamp(data.modified) ],
            currentness: [ this.currentness || '']
        });
    }


    codifySkosCodes(code, lang) {
        return {value: code['uri'], label: code['prefLabel'][lang]}

    }

    fetchFrequencies() {
        this.codesService.fetchCodes('frequencies', 'no').then( frequencies =>
            this.frequencies = frequencies);
    }

    fetchProvenances() {
        this.codesService.fetchCodes('provenancestatements', 'nb').then( provenances =>
            this.provenancestatements = provenances);
    }

    getLabel(codeList, forCode:string): string {
        let label = '';
        codeList.forEach(code => {
            if (code.value === forCode) {
                label = code.label;
                return false;
            }
        });

        return label;
    }

    focus(e) {
      e.target.childNodes.forEach(node=>{
        if(node.className && node.className.match(/\bng2-tag-input-form\b/)) {
          node.childNodes[1].focus();
        }
      })
    }
}
