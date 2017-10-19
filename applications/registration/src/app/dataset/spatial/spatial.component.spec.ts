import {async, ComponentFixture, TestBed} from "@angular/core/testing";
import {SpatialComponent} from "./spatial.component";
import {Dataset} from "../dataset";

describe('SpatialComponent', () => {
  let component: SpatialComponent;
  let fixture: ComponentFixture<SpatialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpatialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpatialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {

    expect(component).toBeTruthy();
  });

});
