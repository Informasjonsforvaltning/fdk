import { Component, Input, Output, OnInit, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { TitleUri } from './titleUri';

import { TagInputModule } from 'ngx-chips';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // this is needed!

@Component({
    selector: 'titleUri',
    templateUrl: './titleUri.component.html',
    styleUrls: ['./titleUri.component.css']
})

export class TitleUriFormComponent implements OnInit {

    language: string = 'nb';
    showForm: boolean = false;

    @Input('formArray')
    public titleUriListFormArray: FormArray;

    @Input('titleUri')
    public titleUri: TitleUri;

    @Input('titleUriIndex')
    public titleUriIndex: number;

    @Input('titleUriType')
    public titleUriType: string;

    @Input('showDelete')
    public showDelete: boolean;

    @Output()
    deleteTitleUri: EventEmitter<string> = new EventEmitter();

    public titleUriForm: FormGroup;

    constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef) { }

    ngOnInit() {
        if (this.titleUri.ui_visible) this.showForm = true;
        this.titleUriForm = this.toFormGroup(this.titleUri);
        this.titleUriListFormArray.push(this.titleUriForm);

        this.titleUriForm.valueChanges.debounceTime(40).distinctUntilChanged().subscribe(
            titleUriFormElement => {
                this.titleUri.prefLabel = { 'nb': titleUriFormElement.prefLabel };
                this.titleUri.uri = titleUriFormElement.uri;
                this.cdr.detectChanges();
            }
        );
    }

    private toFormGroup(titleUri: TitleUri) : FormGroup {
        const formGroup = this.fb.group({
            uri: [titleUri.uri || '', Validators.required],
            prefLabel: [titleUri.prefLabel ? titleUri.prefLabel[this.language] : '']
        });
        return formGroup;
    }
    toggleForm() : void {
        this.showForm = !this.showForm;
    }

    removeTitleUri(idx: number) : boolean {
        this.deleteTitleUri.emit(idx.toString());
        this.titleUriListFormArray.removeAt(idx);
        return false;
    }

    focus(e) : void {
        e.target.childNodes.forEach(node => {
            if (node.className && node.className.match(/\bng2-tag-input-form\b/)) {
                node.childNodes[1].focus();
            }
        })
    }
}
