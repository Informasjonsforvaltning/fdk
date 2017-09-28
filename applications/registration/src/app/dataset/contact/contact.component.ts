import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

import {Contact} from "./contact";
import {HelpText} from "../helptext/helptext.component";

@Component({
    selector: 'contact',
    templateUrl: './contact.component.html',
    styleUrls: [ './contact.component.css' ]
})

export class ContactComponent implements OnInit {
    @Input('contactsArray')
    public contactsArray: FormArray;

    @Input('contact')
    public contact: Contact;

    public contactForm: FormGroup;

    constructor(private fb: FormBuilder) {}

    ngOnInit() {
      if(this.contact) {
          this.contactForm = this.toFormGroup(this.contact);
          this.contactsArray.push(this.contactForm);
      }
    }

    private toFormGroup(contact: Contact) {
        const formGroup = this.fb.group({
            organizationUnit: [ contact.organizationUnit || '' ],
            hasURL: [ contact.hasURL || '' ],
            email: [ contact.email || '', Validators.required ],
            hasTelephone: [ contact.hasTelephone || '']
        });

        return formGroup;
    }
}
