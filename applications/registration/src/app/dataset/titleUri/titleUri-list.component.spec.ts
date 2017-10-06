import {async, ComponentFixture, TestBed} from "@angular/core/testing";
import {TitleUriListComponent} from "./titleUri-list.component";

describe('DatasetComponent', () => {
  let component: TitleUriListComponent;
  let fixture: ComponentFixture<TitleUriListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TitleUriListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TitleUriListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});