import {async, ComponentFixture, TestBed} from "@angular/core/testing";
import {LegalBasisFormComponent} from "./legalBasis.component";

describe('DatasetComponent', () => {
  let component: LegalBasisFormComponent;
  let fixture: ComponentFixture<LegalBasisFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LegalBasisFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LegalBasisFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});