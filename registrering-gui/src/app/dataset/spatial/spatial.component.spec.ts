import {async, ComponentFixture, TestBed} from "@angular/core/testing";
import {AccessRightsComponent} from "./spatial.component";

describe('AccessRightsComponent', () => {
  let component: AccessRightsComponent;
  let fixture: ComponentFixture<AccessRightsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccessRightsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccessRightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
