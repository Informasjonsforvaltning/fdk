import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {FormBuilder, FormGroup} from "@angular/forms";
import {Dataset} from "../dataset";


@Component({
    selector: 'spatial',
    templateUrl: './spatial.component.html',
    styleUrls: [ './spatial.component.css' ]
})

export class SpatialComponent implements OnInit {

    @Input('dataset')
    public dataset: Dataset;

    @Output()
    onSave = new EventEmitter<boolean>();

    public spatialForm: FormGroup;


    constructor(private fb: FormBuilder) {
    }


    ngOnInit() {
        if (this.dataset.spatial) {
            //this.spatialForm.
        } else {
            this.dataset.spatial = [];
        }

        this.spatialForm = this.toFormGroup(this.dataset);

        this.spatialForm.valueChanges.debounceTime(400).distinctUntilChanged().subscribe(
            geoCoverage => {
                if (geoCoverage.spatial) {
                    this.dataset.spatial = geoCoverage.spatial;
                }

                this.onSave.emit(true);
            }
        );
    }



    private toFormGroup(data: Dataset) {
        return this.fb.group({
            spatial : [ data.spatial || {}]
        });
    }


}
