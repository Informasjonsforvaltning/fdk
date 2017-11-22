import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {FormBuilder, FormGroup, FormArray} from "@angular/forms";
import {Dataset} from "../dataset";


@Component({
    selector: 'type',
    templateUrl: './type.component.html',
    styleUrls: [ './type.component.css' ]
})

export class TypeComponent implements OnInit {

    @Input('dataset')
    public dataset: Dataset;

    @Output()
    onSave = new EventEmitter<boolean>();

    public typeForm: FormGroup;
    public selectedTypeIdx = 0;
    private typeModel = [];
    private uncheckedClass = 'checkbox-replacement';    
    private checkedClass = 'checkbox-replacement-checked';
    private typeId = 0;

    constructor(private fb: FormBuilder) {
        this.typeModel = [
            {
                id: 1,
                label: 'Data',
                class: this.uncheckedClass
            },
            {
                id: 2,
                label: 'Kodelister',
                class: this.uncheckedClass
            },
            {
                id: 3,
                label: 'Tesauri',
                class: this.uncheckedClass
            },
            {
                id: 4,
                label: 'Taksonomi',
                class: this.uncheckedClass
            },
            {
                id: 5,
                label: 'Testdata',
                class: this.uncheckedClass
            }
        ];
    }

    ngOnInit() {
      this.typeModel
        .filter(entry => entry.label == this.dataset.type)
        .forEach(entry => this.typeId = entry.id);
      
      this.typeForm = this.toFormGroup(this.typeId);
      let selectedTypeLabel = "";
      this.typeModel.forEach( type => {
        if (type.id == this.typeId) {
          type.class = this.checkedClass;
          selectedTypeLabel = type.label;
        } else {
          type.class = this.uncheckedClass;
        }
      });
      this.dataset.type = selectedTypeLabel;
    }

    private toFormGroup(typeId: number) {
      return this.fb.group({
          type : [ typeId || 0 ]
      });
    }

    public labelClicked(typeId) {      
      if (this.typeId == typeId) {
        this.typeId = 0;
      } else {
        this.typeId = typeId;
      }

      let selectedTypeLabel = "";
      this.typeModel.forEach( type => {
        if (type.id == this.typeId) {
          type.class = this.checkedClass;
          selectedTypeLabel = type.label;
        } else {
          type.class = this.uncheckedClass;
        }
      });

      this.dataset.type = selectedTypeLabel;
      this.typeForm.controls.type.setValue(this.typeId);
      this.onSave.emit();
    }
}
