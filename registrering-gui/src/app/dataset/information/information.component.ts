import {Component, Input, Output, OnInit, EventEmitter} from '@angular/core';
import {FormGroup, FormControl, FormBuilder, FormArray, Validators} from "@angular/forms";
import {Dataset} from "../dataset";


@Component({
  selector: 'information',
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.css']
})

export class InformationComponent implements OnInit {
  @Input('dataset')
  public dataset: Dataset;

  @Output()
  onSave = new EventEmitter<boolean>();

  public informationForm: FormGroup;

  keywords: string[];
  allThemes: any[];
  subjects: any[];

  constructor(private fb: FormBuilder,
    private formBuilder: FormBuilder) {
    }

    ngOnInit() {
      // initialize empty values
      this.keywords = [];
      this.subjects = [];
      if (this.dataset.keywords) {
        this.keywords = this.dataset.keywords.map(keyword => {
          return keyword['nb'];
        });
      }
      if (this.dataset.subjects) {
        this.subjects = this.dataset.subjects.map(subject => {
          return subject;
        });
      }
      this.informationForm = this.toFormGroup(this.dataset);

      this.informationForm.valueChanges.debounceTime(400).distinctUntilChanged().subscribe(
        (information) => {
          if (information.keywords.length === 0) {
            this.dataset.keywords = null;
          } else {
            this.dataset.keywords = information.keywords.map(keyword => {
              return {nb: keyword}
            });
          }

          information.languages = null;
          information.subjects = information.subjects || [];
          this.dataset.subjects = information.subjects;

          this.onSave.emit(true);
        }
      );
      this.subjects = this.dataset.subjects || [];

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
        subjects: [this.subjects],
        keywords: [this.keywords]
      });
    }

  }
