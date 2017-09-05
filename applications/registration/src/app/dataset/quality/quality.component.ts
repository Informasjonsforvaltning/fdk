import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {Dataset} from "../dataset";
import {CodesService} from "../codes.service";


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
    public typeForm: FormGroup;
    typeModel = [];
    selectedProvenanceIdx = 1;


    constructor(private fb: FormBuilder,
                private codesService: CodesService)
    {
      this.provenancesModel = [
          {
              id: 1,
              label: 'Brukerinnsamlede data',
              uri: 'http://publications.europa.eu/resource/authority/access-right/PUBLIC'
          },
          {
              id: 2,
              label: 'Tredjepart',
              uri: 'http://publications.europa.eu/resource/authority/access-right/RESTRICTED'
          },
          {
              id: 3,
              label: 'Statlig vedtak',
              uri: 'http://publications.europa.eu/resource/authority/access-right/NON_PUBLIC'
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

        if (this.dataset.provenance) {
            let skosCode = this.dataset.provenance;
            this.provenancestatements.push(this.codifySkosCodes(skosCode,'nb'));
        } else {
            this.dataset.provenance = { uri: '', prefLabel: {nb:''}};
        }

        this.dataset.conformsTos = this.dataset.conformsTos || [];

        this.qualityForm = this.toFormGroup(this.dataset);

        this.qualityForm.valueChanges.debounceTime(400).distinctUntilChanged().subscribe(
            quality => {

                if (quality.provenance) {
                    this.dataset.provenance = {
                        uri: quality.provenance,
                        prefLabel: {'nb': this.getLabel(this.provenancestatements, quality.provenance)}
                    };
                }

                if (quality.accrualPeriodicity) {

                    this.dataset.accrualPeriodicity = {
                        uri: quality.accrualPeriodicity,
                        prefLabel: {'no': this.getLabel(this.frequencies, quality.accrualPeriodicity)}
                    };

                }

                if (quality.conformsTo) {
                    this.dataset.conformsTos = quality.conformsTo;
                }

                this.onSave.emit(true);

                    if (quality.accessRightsComment && quality.accessRightsComment.length === 0) {
                        this.dataset.accessRightsComments = null;
                    } else {
                        this.dataset.accessRightsComments = quality.accessRightsComment;
                    }
                    if (quality.accessRights) {
                        this.provenancesModel.forEach(entry => {
                            if (entry.id == quality.provenance) {
                                this.dataset.accessRights = {uri: entry.uri}
                            }
                        });
                    }
                    this.onSave.emit(true);

            }
        );


            if(!this.dataset.accessRights) {
                this.dataset.accessRights = {uri: this.provenancesModel[0].uri}
            }
            this.provenancesModel
                .filter(entry => entry.uri == this.dataset.accessRights.uri)
                .forEach(entry => this.selectedProvenanceIdx = entry.id)


    }


    private toFormGroup(data: Dataset) {
        return this.fb.group({
            accrualPeriodicity: [ data.accrualPeriodicity.uri || '' ],
            provenance: [ data.provenance.uri || ''],
            accessRights : [ data.accessRights || {}],
            conformsTo: [ data.conformsTos ]
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
