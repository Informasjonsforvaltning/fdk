import {Component, Input, Output, OnInit, EventEmitter} from '@angular/core';
import {FormGroup, FormControl, FormBuilder, FormArray, Validators} from "@angular/forms";
import {Dataset} from "../dataset";
import {ThemesService} from "../themes.service";


@Component({
    selector: 'information',
    templateUrl: './information.component.html',
    styleUrls: ['./information.component.css']
})

export class InformationComponent implements OnInit {
    @Input('dataset')
    public dataset: Dataset;

    @Output()
    onSave = new EventEmitter<boolean>();

    public informationForm: FormGroup;

    keywords: string[];
    allThemes: any[];
    themes: any[];
    subjects: any[];
    availableThemes: any[];

    constructor(private fb: FormBuilder,
    private formBuilder: FormBuilder,
                private themesService: ThemesService) {
    }

    ngOnInit() {
        // initialize empty values
        this.keywords = [];
        if (this.dataset.keywords) {
            this.keywords = this.dataset.keywords.map(keyword => {
                return keyword['nb'];
            });
        }
        this.fetchThemes();
        this.availableThemes = [
          {label:'Transport', selected: true},
          {label:'Regioner og byer', selected: false},
          {label:'Befolkning og sammfunn', selected: false},
          {label:'Jordbruk, fiskeri, skogbruk og mat', selected:false},
          {label:'Regioner og byer', selected:false}
        ];
        // for debug data. Remove!!
        this.dataset.themes.forEach((theme, i, )=>{
          if(!theme.title) this.dataset.themes.splice(i-1);
        });

        console.log('this.dataset.themes is ', this.dataset.themes);

        this.themes = this.dataset.themes ? this.dataset.themes.map((tema) => {
                return tema.uri
            }) : [];
        this.allThemes =
        this.dataset.themes ?
          this.dataset.themes.map((thema) => {
                if(thema.title) return {value: thema.uri, label: thema.title['nb']}
          }) :
        [];

      if(this.dataset.themes) {
        this.allThemes.forEach((theme, themeIndex, themeArray) => {
          this.dataset.themes.forEach((datasetTheme, datasetThemeIndex, datasetThemeArray)=> {
            console.log('typeof datasetTheme.title is ', typeof datasetTheme.title);
            if(datasetTheme.title && theme.code === datasetTheme.title.nb) {
              themeArray[themeIndex].selected = true;
            }
          })
        })
      }


      this.dataset.themes = [];

      this.dataset.themes = this.dataset.themes || [];

        this.subjects = this.dataset.subjects || [];

        this.informationForm = this.toFormGroup(this.dataset);

        this.informationForm.valueChanges.debounceTime(400).distinctUntilChanged().subscribe(
            (information) => {
              console.log('information is ', information);
                if (information.keywords.length === 0) {
                    this.dataset.keywords = null;
                } else {
                    this.dataset.keywords = information.keywords.map(keyword => {
                        return {nb: keyword}
                    });
                }

                this.dataset.themes = [];
                information.themesArray.forEach((checkbox, checkboxIndex)=>{
                    this.availableThemes.forEach((theme, index)=>{
                        if(theme.label) theme.prefLabel = {nb: theme.label};
                        if((index === checkboxIndex) && checkbox) this.dataset.themes.push(theme);
                    });
                });
                information.languages = null;

                if (information.subjects.length === 0) {
                    this.dataset.subjects = null;
                } else {
                    this.dataset.subjects = information.subjects;
                }

                this.onSave.emit(true);
            }
        );
    }


    private toFormGroup(data: Dataset) {
      //Befolkning og samfunn - Jordbruk, fiskeri, skogbruk og matForvaltning og offentlig sektorRegioner og byerJustis, rettssystem og allmenn sikkerhetTransportMiljøInternasjonale temaerEnergiUtdanning, kultur og sportHelseVitenskap og teknologiØkonomi og finansundefinedundefined
        return this.fb.group({
            themes: [this.themes],
            themesArray: this.formBuilder.array(this.availableThemes.map(s => {return this.formBuilder.control(s.selected)})),
            subjects: [this.subjects],
            keywords: [this.keywords]
        });
    }

    toggleCheckbox(checkbox, i) {
      var checkboxValue = !!checkbox.informationForm.controls.themesArray.controls[i].value;
      checkbox.informationForm.controls.themesArray.controls[i].patchValue({selected:!checkboxValue});

      }

    getLabel(forCode: string): string {
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
        this.themesService.fetchThemes('nb').then(themes =>
            this.allThemes = themes);
    }
}
