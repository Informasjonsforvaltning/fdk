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

  allThemes: any[];
  selectedThemes: any = {};

  constructor(private fb: FormBuilder,
    private formBuilder: FormBuilder,
    private themesService: ThemesService) {
    }

    ngOnInit() {

      this.dataset.themes = this.dataset.themes || [];
      this.dataset.themes.forEach(theme => this.selectedThemes[theme.uri] = theme);

      this.fetchThemes().then(()=> {

        this.temaForm = this.toFormGroup(this.dataset);

        this.temaForm.valueChanges.debounceTime(400).distinctUntilChanged().subscribe(
          (tema) => {
            this.dataset.themes = [];
            tema.themesArray.forEach((checkbox, checkboxIndex)=>{
              this.allThemes.forEach((theme, index)=>{
                if(theme.label) theme.title = {nb: theme.label};
                if(theme.value) theme.uri = theme.value;
                if((index === checkboxIndex) && checkbox) {
                  this.dataset.themes.push(theme);
                }
              });
            });
            this.onSave.emit(true);
          }
        );
      });

    }

    private toFormGroup(data: Dataset) {
      return this.fb.group({
        themesArray: this.formBuilder.array(this.allThemes.map(s => {
          return this.formBuilder.control(this.selectedThemes[s.value] != null)}))
      });
    } 

    fetchThemes() {
      return this.themesService.fetchThemes('nb').then(themes =>
        this.allThemes = themes);
      }
    }
