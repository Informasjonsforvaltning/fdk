import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';

import { TitleUri } from './titleUri';
import { Dataset } from '../dataset';
import { TitleUriFormComponent } from './titleUri.component';

@Component({
    selector: 'titleUri-list',
    templateUrl: './titleUri-list.component.html'
})
export class TitleUriListComponent implements OnInit {

    @Input('titleUriListFormArray')
    public titleUriListFormArray: FormArray;

    @Input('datasetForm')
    public datasetForm: FormGroup;

    @Input('titleUriList')
    public titleUriList: TitleUri[];

    @Input('titleUriType')
    public titleUriType: string;

    showDelete: boolean = false;

    titleUri: TitleUri;

    constructor(private cd: ChangeDetectorRef) { }

    ngOnInit() {
        this.titleUriList = this.titleUriList || [];
        if (this.titleUriList.length == 0) {
            this.addTitleUri();
        }
       this.showHideDelete();
    }

    addTitleUri() : boolean {
        const titleUri: TitleUri = {
            uri: "",
            prefLabel: {
                nb:""
            }
        };
        this.titleUriList.push(titleUri);
        this.cd.detectChanges();
        this.showHideDelete();
        return false;
    }

    removeTitleUri(idx: number) : boolean {
        if (this.titleUriList.length > 0) {
            this.titleUriList.splice(idx, 1);
            this.titleUriListFormArray.removeAt(idx);
        }
        if (this.titleUriList.length == 0) {
            this.addTitleUri();
        }
        this.showHideDelete();
        return false;
    }

    showHideDelete() {
        if (this.titleUriList.length > 1)
            this.showDelete = true;
        else
            this.showDelete = false;
    }
}
