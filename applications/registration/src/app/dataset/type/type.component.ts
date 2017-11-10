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

    constructor(private fb: FormBuilder) {
        this.typeModel = [
            {
                id: 1,
                label: 'Data'
            },
            {
                id: 2,
                label: 'Kodelister'
            },
            {
                id: 3,
                label: 'Tesauri'
            },
            {
                id: 4,
                label: 'Taksonomi'
            },
            {
                id: 5,
                label: 'Testdata'
            }
        ];
    }

    ngOnInit() {
      this.typeForm = this.toFormGroup(this.dataset);
      if(!this.dataset.type) {
        this.dataset.type = "";
      }
      this.typeModel
        .filter(entry => entry.label == this.dataset.type)
        .forEach(entry => this.selectedTypeIdx = entry.id)

      this.typeForm.valueChanges.debounceTime(40).distinctUntilChanged().subscribe(
        typeForm => {
          if (typeForm) {
            let match = false;
            this.typeModel.forEach(entry => {
                if (entry.id === typeForm.type) {
                    this.dataset.type = entry.label;
                    match = true;
                }
            });
            if (!match) {
              this.dataset.type = "";
            }
          }
          this.onSave.emit(true);
        }
      );
    }

    private toFormGroup(data: Dataset) {
        return this.fb.group({
            type : [ data.type || {}]
        });
    }

    public labelClicked(context, event, typeId) {
      if(context.dataset.type === this.typeModel[typeId-1].label) {
        this.typeForm.controls.type.patchValue({});
      }
    }
}
