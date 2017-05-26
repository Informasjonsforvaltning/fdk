import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {FormBuilder, FormGroup} from "@angular/forms";
import {Dataset} from "../dataset";


@Component({
    selector: 'accessRights',
    templateUrl: './spatial.component.html',
    styleUrls: [ './spatial.component.css' ]
})

export class AccessRightsComponent implements OnInit {

    @Input('dataset')
    public dataset: Dataset;

    @Output()
    onSave = new EventEmitter<boolean>();

    public accessRightsForm: FormGroup;
    accessRightsModel = [];
    selectedAccessRightIdx = 1;


    constructor(private fb: FormBuilder)
    {
        this.accessRightsModel = [
            {
                id: 1,
                label: 'Offentlig',
                uri: 'http://publications.europa.eu/resource/authority/access-right/PUBLIC'
            },
            {
                id: 2,
                label: 'Begrenset offentlighet',
                uri: 'http://publications.europa.eu/resource/authority/access-right/RESTRICTED'
            },
            {
                id: 3,
                label: 'Unntatt offentlighet',
                uri: 'http://publications.europa.eu/resource/authority/access-right/NON_PUBLIC'
            }
        ]
    }

    showAccessRightComments(): boolean {
        return this.dataset.accessRights.uri !== this.accessRightsModel[0].uri
    }

    ngOnInit() {
        this.accessRightsForm = this.toFormGroup(this.dataset);
        if(!this.dataset.accessRights) {
            this.dataset.accessRights = {uri: this.accessRightsModel[0].uri}
        }
        this.accessRightsModel
            .filter(entry => entry.uri == this.dataset.accessRights.uri)
            .forEach(entry => this.selectedAccessRightIdx = entry.id)


        this.accessRightsForm.valueChanges.debounceTime(400).distinctUntilChanged().subscribe(
            accessLevel => {
                if (accessLevel.accessRightsComment.length === 0) {
                    this.dataset.accessRightsComments = null;
                } else {
                    this.dataset.accessRightsComments = accessLevel.accessRightsComment;
                }
                if (accessLevel.accessRights) {
                    this.accessRightsModel.forEach(entry => {
                        if (entry.id == accessLevel.accessRights) {
                            this.dataset.accessRights = {uri: entry.uri}
                        }
                    });
                }
                this.onSave.emit(true);
            }
        );
    }



    private toFormGroup(data: Dataset) {
        return this.fb.group({
            accessRights : [ data.accessRights || {}],
            accessRightsComment: [data.accessRightsComments ||[] ]
        });
    }

}
