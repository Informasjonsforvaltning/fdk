import {async, ComponentFixture, TestBed} from "@angular/core/testing";
import {TitleUriFormComponent} from "./titleUri.component";

describe('DatasetComponent', () => {
  let component: TitleUriFormComponent;
  let fixture: ComponentFixture<TitleUriFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TitleUriFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TitleUriFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});