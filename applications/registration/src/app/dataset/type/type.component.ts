import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {FormBuilder, FormGroup} from "@angular/forms";
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
    typeModel = [];
    selectedTypeIdx = 0;

    constructor(private fb: FormBuilder)
    {
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
        ]
    }

    showAccessRightComments(): boolean {
        return this.dataset.type !== this.typeModel[0]
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
            accessLevel => {
                if (accessLevel) {
                    this.typeModel.forEach(entry => {
                        if (entry.id == accessLevel.type) {
                            this.dataset.type = entry.label;
                        }
                    });
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

}
