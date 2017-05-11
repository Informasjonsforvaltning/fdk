import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

import {Contact} from "./contact";

@Component({
    selector: 'contact',
    templateUrl: './contact.component.html',
    styleUrls: [ './contact.component.css' ]
})

export class ContactComponent implements OnInit {
    @Input('contactsController')
    public contactsController: FormArray;

    @Input('contact')
    public contact: Contact;

    public contactForm: FormGroup;

    constructor(private fb: FormBuilder) {}

    ngOnInit() {
        this.contactForm = this.toFormGroup(this.contact);
        this.contactsController.push(this.contactForm);
    }

    private toFormGroup(contact: Contact) {
        console.log('contact is ', contact);
        const formGroup = this.fb.group({
            organizationUnit: [ contact.organizationUnit || '' ],
            hasURL: [ contact.hasURL || '' ],
            email: [ contact.email || '', Validators.required ],
            hasTelephone: [ contact.hasTelephone || '']
        });

        return formGroup;
    }
}
