import {async, ComponentFixture, TestBed} from "@angular/core/testing";
import {SpatialComponent} from "./spatial.component";
import {Dataset} from "../dataset";

describe('SpatialComponent', () => {
  let component: SpatialComponent;
  let fixture: ComponentFixture<SpatialComponent>;


    const TEST_DATASET: Dataset = {
            "id" : "1009",
            "title": {
                "nb" : "Enhetsregisteret testdatasett"
            },
            "description": {
                "nb": "Datasett med mange attributter"
            },
            "keywords": [{'nb':'keyword1'}],
            "subjects":[{"uri":"https://data-david.github.io/Begrep/begrep/Hovedenhet", "prefLabel":{"no":"Hovedenhet"}}],
            "themes":[],
            "catalog": "974760673",
            "landingPages" : ["http://www.brreg.no", "http://www.difi.no"],
            "identifiers" : ["http://brreg.no/identifier/1009"],
            "spatials" : [{'uri': 'http://sws.geonames.org/3144096/', 'prefLabel' : {'nb' : 'Norge'}}],
            "_lastModified": "2012-04-23"
    }

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
