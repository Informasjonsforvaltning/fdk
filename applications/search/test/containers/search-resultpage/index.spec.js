import React from 'react';
import SearchHitItem from '../../../src/components/search-hit-item/index';


describe('a passing test', () => {
  it('should pass', () => {
    expect(true).to.be.true;
  });
});

describe('SearchHitItem', () => {
  const props =
    {
      "_index": "dcat",
      "_type": "dataset",
      "_id": "http://data.brreg.no/datakatalog/dataset/961181399/60",
      "_score": 0.26726124,
      "_source": {
        "id": "http://data.brreg.no/datakatalog/dataset/961181399/60",
        "title": {"nb": "Folketellingen 1910", "en": "Census 1910"},
        "description": {"nb": "Folketellingen 1910 inneholder opplysninger om personer bosatt i Norge i 1910, med bosted, boforhold, familierelasjoner, yrke, m.m."},
        "contactPoint": {
          "id": "http://data.brreg.no/datakatalog/kontaktpunkt/a-15",
          "email": "mailto:post@arkivverket.no",
          "organizationUnit": "Arkivverket",
          "telephone": "tel:+4748055666"
        },
        "keyword": {},
        "publisher": {
          "id": "http://data.brreg.no/enhetsregisteret/enhet/961181399",
          "name": "ARKIVVERKET",
          "overordnetEnhet": "972417866",
          "organisasjonsform": "ORGL",
          "subPublisher": [],
          "aggrSubPublisher": []
        },
        "theme": [{
          "id": "http://publications.europa.eu/resource/authority/data-theme/GOVE",
          "code": "GOVE",
          "startUse": "2015-10-01",
          "title": {
            "it": "Governo e settore pubblico",
            "nb": "Forvaltning og offentlig sektor",
            "en": "Government and public sector",
            "hr": "Vlada i javni sektor",
            "es": "Gobierno y sector público",
            "de": "Regierung und öffentlicher Sektor",
            "sk": "Vláda a verejný sektor",
            "ro": "Guvern şi sector public",
            "bg": "Правителство и публичен сектор",
            "et": "Valitsus ja avalik sektor",
            "el": "Κυβέρνηση και δημόσιος τομέας",
            "pl": "Rząd i sektor publiczny",
            "cs": "Vláda a veřejný sektor",
            "ga": "Rialtas agus earnáil phoiblí",
            "pt": "Governo e setor público",
            "lt": "Vyriausybė ir viešasis sektorius",
            "lv": "Valdība un sabiedriskais sektors",
            "mt": "Gvern u settur pubbliku",
            "hu": "Kormányzat és közszféra",
            "da": "Regeringen og den offentlige sektor",
            "fi": "Valtioneuvosto ja julkinen sektori",
            "fr": "Gouvernement et secteur public",
            "sl": "Vlada in javni sektor",
            "sv": "Regeringen och den offentliga sektorn",
            "nl": "Overheid en publieke sector"
          },
          "conceptSchema": {
            "id": "http://publications.europa.eu/resource/authority/data-theme",
            "title": {"en": "Dataset types Named Authority List"},
            "versioninfo": "20160921-0",
            "versionnumber": "20160921-0"
          }
        }],
        "catalog": {
          "id": "http://data.brreg.no/datakatalog/katalog/961181399/15",
          "title": {"nb": "Arkivverkets datakatalog"},
          "description": {"nb": "Katalog over datasett i Arkivverket"},
          "publisher": {
            "id": "http://data.brreg.no/enhetsregisteret/enhet/961181399",
            "name": "ARKIVVERKET",
            "overordnetEnhet": "972417866",
            "organisasjonsform": "ORGL",
            "subPublisher": [],
            "aggrSubPublisher": []
          },
          "themeTaxonomy": []
        },
        "distribution": [],
        "conformsTo": [],
        "temporal": [],
        "spatial": [],
        "accessRights": {
          "uri": "http://publications.europa.eu/resource/authority/access-right/PUBLIC",
          "authorityCode": "PUBLIC",
          "prefLabel": {"en": "Public", "nb": "Offentlig", "nn": "Offentlig"}
        },
        "accessRightsComment": [],
        "references": [],
        "identifier": ["60"],
        "page": [],
        "subject": [],
        "ADMSIdentifier": []
      }
    }


  global.window = {
    location: {
      search: {
        lang: 'nb'
      }
    }
  }

  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<SearchHitItem result={props} />);
  });

  it ('should render', () => {
    expect(wrapper).to.have.length(1);
  });

  it ('render card', () => {
    expect(wrapper.find('.fdk-container-search-hit').length).to.be.equal(1);
  });

  /*
   it ('sorting table by title', () => {
   let table = shallow(<OppslagTable oppslagItems={props} />)
   table.setState({sortField: 'title', sortType: 'asc'});
   expect(table.find('.table-item').first().key()).to.be.equal("1");
   table.setState({sortField: 'title', sortType: 'desc'});
   expect(table.find('.table-item').first().key()).to.be.equal("4");
   })

   it('sorting table by title click asc and desc', () => {
   let wrapper = mount(<OppslagTable />);
   wrapper.setProps({oppslagItems: props});
   wrapper.find('button[name="titleAsc"]').simulate('click');
   expect(wrapper.find('.table-item').first().key()).to.be.equal("1");
   wrapper.find('button[name="titleDesc"]').simulate('click');
   expect(wrapper.find('.table-item').first().key()).to.be.equal("4");
   });

   it('sorting table by date validFrom click asc and desc', () => {
   let wrapper = mount(<OppslagTable />);
   wrapper.setProps({oppslagItems: props});
   wrapper.find('button[name="validFromAsc"]').simulate('click');
   expect(wrapper.find('.table-item').first().key()).to.be.equal("2");
   wrapper.find('button[name="validFromDesc"]').simulate('click');
   expect(wrapper.find('.table-item').first().key()).to.be.equal("4");
   });

   it('paging', () => {
   let wrapper = mount(<OppslagTable />);
   wrapper.setProps({oppslagItems: props, paging: true});
   expect(wrapper.find('.table-item').length).to.be.equal(4);
   wrapper.setProps({itemsPerPage: 2});
   expect(wrapper.find('.table-item').length).to.be.equal(2);
   //expect(wrapper.find('button[name="prevPage"]').length).to.be.equal(0);
   //expect(wrapper.find('button[name="nextPage"]').length).to.be.equal(1);
   //wrapper.find('button[name="nextPage"]').simulate('click');
   //expect(wrapper.find('button[name="prevPage"]').length).to.be.equal(1);
   });
   */

});