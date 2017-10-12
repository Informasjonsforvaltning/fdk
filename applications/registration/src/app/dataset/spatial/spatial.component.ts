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

    //initial values for spatial uris
    //Note: spatial objects are saved as SKOS objects on server
    spatialUris: string[];

    constructor(private fb: FormBuilder) {
    }

    ngOnInit() {

        if (this.dataset.spatials) {
            //convert incoming list of SKOS objects to list of uris to display in field
            this.spatialUris = this.dataset.spatials.map(entry => {
                return entry.uri;
            });
        }

        this.spatialForm = this.toFormGroup(this.dataset);

        this.spatialForm.valueChanges.debounceTime(400).distinctUntilChanged().subscribe(
            geoCoverage => {

                if (geoCoverage.spatial) {

                    //convert list of spatial uris into SKOS objects
                    //for now, only the uri is retained, handling of prefLabel to be decided
                    this.dataset.spatials = geoCoverage.spatial.map(spatialUri => {
                        return {uri: spatialUri, prefLabel: null}
                    })
                }

                this.onSave.emit(true);
            }
        );
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
            spatial : [this.spatialUris || []]
        });
    }


}
