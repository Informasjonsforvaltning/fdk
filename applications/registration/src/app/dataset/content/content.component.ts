import {Component, Input, Output, OnInit, EventEmitter} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Dataset} from "../dataset";
import { TitleUri } from "../titleUri/titleUri";

import {DatasetComponent} from "../dataset.component";

@Component({
  selector: 'content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})

export class ContentComponent implements OnInit {

  @Input('dataset')
  public dataset: Dataset;

  @Output()
  onSave = new EventEmitter<boolean>();

  public contentForm: FormGroup;

  relevance;
  completeness;
  accuracy;
  availability;
  standard: TitleUri;

  constructor(private fb: FormBuilder,
              private parent: DatasetComponent) {
  }

  ngOnInit() {
    this.parent.buildContentSummary();

    if (this.dataset.hasRelevanceAnnotation) {
      this.relevance = this.dataset.hasRelevanceAnnotation.hasBody.no;
    }

    if (this.dataset.hasCompletenessAnnotation) {
      this.completeness = this.dataset.hasCompletenessAnnotation.hasBody.no;
    }

    if (this.dataset.hasAccuracyAnnotation) {
      this.accuracy = this.dataset.hasAccuracyAnnotation.hasBody.no;
    }

    if (this.dataset.hasAvailabilityAnnotation) {
      this.availability = this.dataset.hasAvailabilityAnnotation.hasBody.no;
    }

    if (this.dataset.conformsTos[0]) {
        this.standard = this.dataset.conformsTos[0];
    } else {
        this.standard =
        {
            uri: '',
            prefLabel: {'nb' : ''}
        }
    }

    this.contentForm = this.toFormGroup(this.dataset);

    this.contentForm.valueChanges.debounceTime(400).distinctUntilChanged().subscribe(
      quality => {

        if (quality.relevance != null) {
          this.dataset.hasRelevanceAnnotation = {
            inDimension: "iso:Relevance",
            motivatedBy: "dqv:qualityAssessment",
            hasBody: {"no": quality.relevance}
          }
        }

        if (quality.completeness != null) {
          this.dataset.hasCompletenessAnnotation = {
            inDimension: "iso:Completeness",
            motivatedBy: "dqv:qualityAssessment",
            hasBody: {"no": quality.completeness}
          }
        }

        if (quality.accuracy != null) {
          this.dataset.hasAccuracyAnnotation = {
            inDimension: "iso:Accuracy",
            motivatedBy: "dqv:qualityAssessment",
            hasBody: {"no": quality.accuracy}
          }
        }

        if (quality.availability != null) {
          this.dataset.hasAvailabilityAnnotation = {
            inDimension: "iso:Availability",
            motivatedBy: "dqv:qualityAssessment",
            hasBody: {"no": quality.availability}
          }
        }

        this.parent.buildContentSummary();
        this.onSave.emit(true);
      }
    );
  }

  private save() {
    if (this.standard) {
        this.dataset.conformsTos[0] = this.standard;
    }

    this.parent.buildContentSummary();
    this.onSave.emit(true);
  }

  private toFormGroup(data: Dataset) {
    return this.fb.group({
      relevance: [this.relevance || ''],
      completeness: [this.completeness || ''],
      accuracy: [this.accuracy || ''],
      availability: [this.availability || ''],
      standard: [this.standard || {
        uri: '',
        prefLabel: {'nb' : ''}
        }]
    });
  }

}
