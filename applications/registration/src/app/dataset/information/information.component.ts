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
  subjectLookupInProgress:boolean = false;

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
          if((subject.indexOf('https://') !== -1 || subject.indexOf('http://') !== -1) && !this.subjectLookupInProgress) {
            this.subjectLookupInProgress = true;
            let uri = subject; // it's http or https, it's a uri!
            let alreadyExists = false;
            this.dataset.subjects.forEach((s)=>{
              if(s.uri === uri) alreadyExists = true;
            });
            if(alreadyExists) {
              console.log('uri pasted already exists in this dataset\'s subjects');
            } else {
              this.replaceUriWithLabel(uri).then((subjectObject) => {
                this.dataset.subjects = this.dataset.subjects || [];
                this.dataset.subjects.push(subjectObject);
                this.onSave.emit(true);
                this.setSubjectControlValues();
                this.subjectLookupInProgress = false;
              }).catch((err)=>{
                console.log('Kunne ikke hente begrepsdefinisjon fra URI som ble limt inn');
                information.subjects.slice(-1);
                this.setSubjectControlValues();
              });
            }
          } else if(!this.subjectLookupInProgress) {
            let subjectIsAlreadyAdded = false;
            if(this.dataset.subjects) {
              this.dataset.subjects.forEach((subjectObject)=>{
                if(subject === subjectObject.prefLabel.no) {
                  subjectIsAlreadyAdded = true;
                }
              })
            }
            if(!subjectIsAlreadyAdded) {
              console.log('Validator: Hei! Vi må vite hva du mener med ' + subject + '. Vi aksepterer derfor kun URI til begrepsdefinisjon.');
              information.subjects.slice(-1);
              this.setSubjectControlValues(); // removes the faulty value from the input control;
            }
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
          let hasSubjects = information.subjects && information.subjects.length > 0;
          if(!hasSubjects) {
            console.log('there are no subjects');
            this.dataset.subjects = null;

            //            information.subjects = information.subjects || [];
          }
          else if(this.dataset.subjects && information.subjects.length < this.dataset.subjects.length) { // a subject has been removed
            console.log('a subject has been removed');
            this.dataset.subjects.forEach((datasetSubject, index)=> {
              var presentInBothArrays = false;
              information.subjects.forEach((subject)=> {
                if(subject === datasetSubject.prefLabel.no) {
                  presentInBothArrays = true;
                }
              });
              if(!presentInBothArrays) {
                this.dataset.subjects.splice(index, 1);
              }
            })

          }
          this.onSave.emit(true);
        }
      );

    }
    setSubjectControlValues() {
      this.dataset.subjects = this.dataset.subjects || [];
      var value = this.dataset.subjects.map((subject)=>{
        return subject.prefLabel.no;
      });
      this.informationForm.controls['subjects'].setValue(value);
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
