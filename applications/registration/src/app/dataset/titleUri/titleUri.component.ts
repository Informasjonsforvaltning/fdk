import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';

import {TitleUri} from './titleUri';
import {DatasetComponent} from "../dataset.component"; // this is needed!

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
    public titleUriIndex: number = 0;

    @Input('titleUriType')
    public titleUriType: string;

    @Input('showDelete')
    public showDelete: boolean;

    @Output()
    deleteTitleUri: EventEmitter<string> = new EventEmitter();

    @Output()
    onSave: EventEmitter<boolean> = new EventEmitter<boolean>();

    public titleUriForm: FormGroup;

    constructor(private fb: FormBuilder,
                private cdr: ChangeDetectorRef,
                private parent: DatasetComponent) { }

    ngOnInit() {

        this.titleUriForm = this.toFormGroup(this.titleUri);

        if (this.titleUriListFormArray)
            this.titleUriListFormArray.push(this.titleUriForm);

        this.titleUriForm.valueChanges.debounceTime(40).distinctUntilChanged().subscribe(
            titleUriFormElement => {
                this.titleUri.prefLabel = { 'nb': titleUriFormElement.prefLabel };
                this.titleUri.uri = titleUriFormElement.uri;
                this.cdr.detectChanges();
                this.parent.buildInformationModelSummary();
                this.onSave.emit();
            }
        );
    }

    private toFormGroup(titleUri: TitleUri) : FormGroup {
        if (titleUri) {
            return this.fb.group({
                uri: [titleUri.uri || ''],
                prefLabel: [titleUri.prefLabel ? titleUri.prefLabel[this.language] : '']
            });
        } else {
            return this.fb.group({
                uri: [''],
                prefLabel: ['']
            });
        }
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
