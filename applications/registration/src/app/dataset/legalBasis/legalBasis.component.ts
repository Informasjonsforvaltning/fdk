import { Component, Input, Output, OnInit, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { LegalBasis } from './legalBasis';

import { TagInputModule } from 'ngx-chips';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // this is needed!

@Component({
    selector: 'legal-basis',
    templateUrl: './legalBasis.component.html',
    styleUrls: ['./legalBasis.component.css']
})

export class LegalBasisFormComponent implements OnInit {

    language: string = 'nb';
    showForm: boolean = false;
    showError: boolean = false;

    @Input('formArray')
    public legalBasisListFormArray: FormArray;

    @Input('legalBasis')
    public legalBasis: LegalBasis;

    @Input('legalBasisIndex')
    public legalBasisIndex: number;

    @Input('legalBasisType')
    public legalBasisType: string;

    @Output()
    deleteLegalBasis: EventEmitter<string> = new EventEmitter();

    @Output()
    onSave = new EventEmitter<boolean>();

    public legalBasisForm: FormGroup;

    constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef) { }

    ngOnInit() {
        if (this.legalBasis.ui_visible) this.showForm = true;
        this.legalBasisForm = this.toFormGroup(this.legalBasis);
        this.legalBasisListFormArray.push(this.legalBasisForm);

        this.legalBasisForm.valueChanges.debounceTime(40).distinctUntilChanged().subscribe(
            legalBasisFormElement => {
                this.legalBasis.prefLabel = { 'nb': legalBasisFormElement.prefLabel };
                this.legalBasis.uri = legalBasisFormElement.uri;
                this.cdr.detectChanges();
            }
        );
    }

    private toFormGroup(legalBasis: LegalBasis) : FormGroup {
        const formGroup = this.fb.group({
            uri: [legalBasis.uri || '', Validators.required],
            foafHomepage: [legalBasis.foafHomepage || ''],
            prefLabel: [legalBasis.prefLabel ? legalBasis.prefLabel[this.language] : '']
        });
        return formGroup;
    }
    toggleForm() : void {
        this.showForm = !this.showForm;
    }

    private showErrorMessage() : void {
        this.showError = true;
    }

    private hideErrorMessage() : void {
        this.showError = false;
    }

    public validate() : void {
        console.log('show error or something');
        this.showErrorMessage();
    }

    removeLegalBasis(idx: number) : boolean {
        this.deleteLegalBasis.emit(idx.toString());
        this.legalBasisListFormArray.removeAt(idx);
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
