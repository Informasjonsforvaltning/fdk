import {Component, Input, Output, OnInit, EventEmitter} from '@angular/core';
import {FormGroup, FormControl, FormBuilder, FormArray, Validators} from "@angular/forms";
import {Dataset} from "../dataset";
import {ThemesService} from "../themes.service";


@Component({
  selector: 'tema',
  templateUrl: './tema.component.html',
  styleUrls: ['./tema.component.css']
})

export class TemaComponent implements OnInit {
  @Input('dataset')
  public dataset: Dataset;

  @Output()
  onSave = new EventEmitter<boolean>();

  public temaForm: FormGroup;

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
      this.fetchThemes().then(()=> {

        if(this.dataset.themes) {
          this.allThemes.forEach((theme, themeIndex, themeArray) => {
            this.dataset.themes.forEach((datasetTheme, datasetThemeIndex, datasetThemeArray)=> {
              if(theme.value === datasetTheme.uri) {
                themeArray[themeIndex].selected = true;
              }
            })
          })
        }
        this.temaForm = this.toFormGroup(this.dataset);
        this.temaForm.valueChanges.debounceTime(400).distinctUntilChanged().subscribe(
          (tema) => {
            this.dataset.themes = [];
            tema.themesArray.forEach((checkbox, checkboxIndex)=>{
              this.allThemes.forEach((theme, index)=>{
                if(theme.label) theme.title = {nb: theme.label};
                if(theme.value) theme.uri = theme.value;
                if((index === checkboxIndex) && checkbox) this.dataset.themes.push(theme);
              });
            });
            this.onSave.emit(true);
          }
        );
      });
      this.dataset.themes = this.dataset.themes || [];
    }

    private toFormGroup(data: Dataset) {
      return this.fb.group({
        themesArray: this.formBuilder.array(this.allThemes.map(s => {return this.formBuilder.control(s.selected)}))
      });
    }

    toggleCheckbox(checkbox, i) {
      var checkboxValue = !!checkbox.temaForm.controls.themesArray.controls[i].value;
      checkbox.temaForm.controls.themesArray.controls[i].patchValue({selected:!checkboxValue});

    }

    fetchThemes() {
      return this.themesService.fetchThemes('nb').then(themes =>
        this.allThemes = themes);
      }
    }
