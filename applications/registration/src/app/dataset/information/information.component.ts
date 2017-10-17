import {Component, Input, Output, OnInit, EventEmitter} from '@angular/core';
import {FormGroup, FormControl, FormBuilder, FormArray, Validators} from "@angular/forms";
import {Dataset} from "../dataset";
import {SubjectService} from "./subject.service";

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
    private formBuilder: FormBuilder,
    private subjectService: SubjectService) {

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
      this.informationForm.valueChanges.subscribe((information) => {
        information.subjects.forEach((subject) => {
          if(subject.indexOf('https://') !== -1 || subject.indexOf('http://') !== -1) {
            this.replaceUriWithLabel(subject).then((subjectObject) => {
/*              let i = this.dataset.subjects.indexOf(subject);
              if(i === -1) i = 0;
              this.dataset.subjects[i] = subjectObject;*/
              this.dataset.subjects.push(subjectObject);
              this.onSave.emit(true);
              var value = this.dataset.subjects.map((subject2)=>{
                return subject2.prefLabel.no;
              });
              this.informationForm.controls['subjects'].setValue(value);
            }).catch((err)=>{
              console.log('promise failed, error: ', err);
            });
          } else {

          }
        });
      })
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
          console.log('information.subjects length is ', information.subjects.length);
          console.log('this.dataset.subjects length is ', this.dataset.subjects.length);
          if(information.subjects && information.subjects.length === 0) {
            information.subjects = information.subjects || [];
            this.dataset.subjects = information.subjects;
          }

          this.onSave.emit(true);
        }
      );

    }
    replaceUriWithLabel (subjectUri) {
      // get this: https://localhost:8099/referenceData/subjects?uri=https://data-david.github.io/Begrep/begrep/Hovedenhet
      // https://localhost:8099/referenceData/subjects?uri= + urlencoded('https://data-david.github.io/Begrep/begrep/Hovedenhet ')
      return this.subjectService.get(subjectUri);
      /*return {
        label: response.prefLabel['nb'],
        uri: subjectUri
      }*/
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
        subjects: [this.subjects.map((subject)=>{
          return subject.prefLabel.no;
        })],
        keywords: [this.keywords]
      });
    }

  }
