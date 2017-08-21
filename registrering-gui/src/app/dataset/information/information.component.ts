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
console.log('1this.allThemes is ', this.allThemes);
        this.fetchThemes().then(()=> {

                  console.log('2this.allThemes is ', this.allThemes);

  /*                this.themes = this.dataset.themes ? this.dataset.themes.map((tema) => {
                          return tema.uri
                      }) : [];
*/

                  console.log('3this.allThemes is ', this.allThemes);
                if(this.dataset.themes) {
                  this.allThemes.forEach((theme, themeIndex, themeArray) => {
                    console.log('this.dataset is ', this.dataset.themes);
                    this.dataset.themes.forEach((datasetTheme, datasetThemeIndex, datasetThemeArray)=> {
                      console.log('typeof datasetTheme.title is ', typeof datasetTheme.title);
                      if(theme.value === datasetTheme.uri) {
                        themeArray[themeIndex].selected = true;
                      }
                    })
                  })
                }
                        this.informationForm = this.toFormGroup(this.dataset);


                                this.informationForm.valueChanges.debounceTime(400).distinctUntilChanged().subscribe(
                                    (information) => {
                              console.log('4this.allThemes is ', this.allThemes);
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
                                            this.allThemes.forEach((theme, index)=>{
                                                if(theme.label) theme.title = {nb: theme.label};
                                                if(theme.value) theme.uri = theme.value;
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
        });




      this.dataset.themes = this.dataset.themes || [];

        this.subjects = this.dataset.subjects || [];

    }

    private toFormGroup(data: Dataset) {
      console.log('this.allThemes is ', this.allThemes);
        return this.fb.group({
            themesArray: this.formBuilder.array(this.allThemes.map(s => {return this.formBuilder.control(s.selected)})),
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
        return this.themesService.fetchThemes('nb').then(themes =>
            this.allThemes = themes);
    }
}
