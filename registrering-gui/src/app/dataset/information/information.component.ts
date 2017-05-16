import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {Dataset} from "../dataset";
import {CodesService} from "../codes.service";
import {ThemesService} from "../themes.service";


@Component({
    selector: 'information',
    templateUrl: './information.component.html',
    styleUrls: [ './information.component.css' ]
})

export class InformationComponent implements OnInit {
    @Input('datasetForm')
    public datasetForm: FormGroup;

    @Input('dataset')
    public dataset: Dataset;

    @Output()
    onSave = new EventEmitter<boolean>();

    public informationForm: FormGroup;

    keywords: string[];
    allThemes: any[];
    themes : any[];

    constructor(private fb: FormBuilder,
                private codesService: CodesService,
                private themesService: ThemesService) {}

    ngOnInit() {

        // initialize empty values
        this.keywords = [];
        if (this.dataset.keywords) {
            this.keywords = this.dataset.keywords.map(keyword=>{return keyword['nb'];});
        }

        this.themes = this.dataset.themes ? this.dataset.themes.map((tema)=>{return tema.uri}) : [];
        this.allThemes = this.dataset.themes ? this.dataset.themes.map((thema)=>{return {value: thema.uri, label: thema.prefLabel['nb']}}) : [];

        console.log("theme service: ", this.allThemes);
        console.log("theme get: ", this.themes);

        this.informationForm = this.toFormGroup(this.dataset);
        this.datasetForm.addControl('information', this.informationForm);

        this.informationForm.valueChanges.debounceTime(400).distinctUntilChanged().subscribe(
            information => {

                if (information.keywords.length === 0) {
                    this.dataset.keywords = null;
                } else {
                    this.dataset.keywords = information.keywords.map(keyword =>{ return {nb: keyword}});
                }

                if (information.themes.length === 0) {
                    this.dataset.themes = null;
                } else {
                    this.dataset.themes = information.themes.map(theme => { return {uri: theme, prefLabel: {nb: this.getLabel(theme)}}});
                }

                console.log('this.dataset.themes:', this.dataset.themes);
                this.onSave.emit(true);
            }
        );

    }


    private toFormGroup(data: Dataset) {
        return this.fb.group({
            themes:   [ this.themes ],
            keywords: [ this.keywords ]
        });
    }

    codifySkosCodes(code, lang) {
        return {value: code['uri'], label: code['prefLabel'][lang]}
    }


    getLabel(forCode:string): string {
        let label = '';
        this.allThemes.forEach(code => {
            if (code.value === forCode) {
                label = code.label;
                return false;
            }
        });

        return label;
    }

    fetchThemes() {
        this.themesService.fetchThemes('nb').then( themes =>
            this.allThemes = themes);
    }
}
