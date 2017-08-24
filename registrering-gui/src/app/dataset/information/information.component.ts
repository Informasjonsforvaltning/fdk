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
      if (this.dataset.keywords) {
        this.keywords = this.dataset.keywords.map(keyword => {
          return keyword['nb'];
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

          if (information.subjects.length === 0) {
            this.dataset.subjects = null;
          } else {
            this.dataset.subjects = information.subjects;
          }

          this.onSave.emit(true);
        }
      );
      this.subjects = this.dataset.subjects || [];

    }

    private toFormGroup(data: Dataset) {
      return this.fb.group({
        subjects: [this.subjects],
        keywords: [this.keywords]
      });
    }

  }
