import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'helptext',
    templateUrl: './helptext.component.html'
})

export class HelpText implements OnInit {
    @Input('text')
    public text: string;

    @Input('moretext')
    public moretext: string;

    @Input('name')
    public name: string;


    constructor() {}

    ngOnInit() {
    }
}
