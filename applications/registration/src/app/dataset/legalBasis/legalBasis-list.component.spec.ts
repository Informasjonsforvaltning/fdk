import {async, ComponentFixture, TestBed} from "@angular/core/testing";
import {LegalBasisListComponent} from "./legalBasis-list.component";

describe('DatasetComponent', () => {
  let component: LegalBasisListComponent;
  let fixture: ComponentFixture<LegalBasisListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LegalBasisListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LegalBasisListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});