import React from 'react';

import SearchHitItem from '../../../src/components/search-results-hit-item';

describe('SearchHitItem', () => {

  const props =
    {
      "_index": "dcat",
      "_type": "dataset",
      "_id": "http://data.brreg.no/datakatalog/dataset/961181399/60",
      "_score": 0.26726124,
      "_source": {
        "id": "http://data.brreg.no/datakatalog/dataset/974761076/63",
        "title": {
          "nb": "Innrapportert inntekt"
        },
        "description": {
          "nb": "Informasjon om innrapportert inntekt"
        },
        "contactPoint": {
          "id": "http://data.brreg.no/datakatalog/kontaktpunkt/a-13",
          "email": "mailto:brukerstotte.datasamarbeid@skatteetaten.no",
          "organizationUnit": "Skatteetaten, datasamarbeid"
        },
        "keyword": {
          "nb": [
            "inntekt",
            "gjeld og fradrag",
            "grunnlagsdata",
            "formue"
          ]
        },
        "publisher": {
          "id": "http://data.brreg.no/enhetsregisteret/enhet/974761076",
          "name": "SKATTEETATEN",
          "overordnetEnhet": "972417807",
          "organisasjonsform": "ORGL",
          "subPublisher": [],
          "aggrSubPublisher": []
        },
        "language": {
          "uri": "http://publications.europa.eu/resource/authority/language/NOR",
          "authorityCode": "NOR",
          "prefLabel": {
            "nb": "Norsk",
            "nn": "Norsk",
            "no": "Norsk",
            "en": "Norwegian"
          }
        },
        "theme": [
          {
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
              "title": {
                "en": "Dataset types Named Authority List"
              },
              "versioninfo": "20160921-0",
              "versionnumber": "20160921-0"
            }
          }
        ],
        "catalog": {
          "id": "http://data.brreg.no/datakatalog/katalog/974761076/5",
          "title": {
            "nb": "Skatteetaten datakatalog"
          },
          "description": {
            "nb": "Katalog over datasett i Skatteetaten"
          },
          "publisher": {
            "id": "http://data.brreg.no/enhetsregisteret/enhet/974761076",
            "name": "SKATTEETATEN",
            "overordnetEnhet": "972417807",
            "organisasjonsform": "ORGL",
            "subPublisher": [],
            "aggrSubPublisher": []
          },
          "themeTaxonomy": []
        },
        "distribution": [
          {
            "id": "http://data.brreg.no/datakatalog/distribusjon/26",
            "title": {},
            "description": {
              "nb": "Innrapportert inntekt Skatteetaten"
            },
            "accessURL": "https://api.skatteetaten.no/api/innrapportert/inntektsmottaker/personidentifikator/oppgave/inntekt?fraOgMed=YYYY-MM&tilOgMed=YYYY-MM",
            "format": "application/xml, application/json"
          }
        ],
        "sample": [
          {
            "id": "95a6b5e5-753c-4bc3-a421-2671c8f6a7bb",
            "uri": "http://brreg.no/catalogs/987654321/datasets/3645d5a8-6689-4fc1-8684-d3d6c2d47386/distributions/95a6b5e5-753c-4bc3-a421-2671c8f6a7bb",
            "description": {
              "nb": "Dette er beskrivelsen av eksempeldataene. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor."
            },
            "accessURL": [
              "http://www.detteerenlenke.no/til-nedlasting"
            ],
            "format": [
              "application/rdf+xml"
            ]
          }
        ],
        "conformsTo": [],
        "temporal": [],
        "spatial": [],
        "accessRights": {
          "uri": "http://publications.europa.eu/resource/authority/access-right/RESTRICTED",
          "authorityCode": "RESTRICTED",
          "prefLabel": {
            "nb": "Begrenset",
            "nn": "Begrenset",
            "en": "Restricted"
          }
        },
        "accessRightsComment": [
          "https://lovdata.no/NL/lov/2016-05-27-14/§3-1"
        ],
        "references": [],
        "identifier": [
          "63"
        ],
        "page": [],
        "accrualPeriodicity": {
          "uri": "http://publications.europa.eu/resource/authority/frequency/CONT",
          "authorityCode": "CONT",
          "prefLabel": {
            "lt": "nenutrūkstamas",
            "ga": "leanúnach",
            "it": "continuo",
            "es": "continuo",
            "hu": "folyamatos",
            "sk": "priebežný",
            "bg": "постоянен",
            "fi": "jatkuva",
            "da": "kontinuerligt",
            "de": "kontinuierlich",
            "pl": "ciągły",
            "lv": "pastāvīgi",
            "cs": "průběžný",
            "mt": "kontinwu",
            "nl": "voortdurend",
            "fr": "continuel",
            "ro": "continuu",
            "en": "continuous",
            "hr": "stalan",
            "sl": "nenehen",
            "el": "συνεχής",
            "no": "kontinuerlig",
            "sv": "kontinuerlig",
            "et": "pidev",
            "pt": "contínuo"
          }
        },
        "subject": [],
        "ADMSIdentifier": []
      }
    }

  let wrapper;

  beforeEach(() => {

    wrapper = shallow(<SearchHitItem result={props} selectedLanguageCode="nb" />);
  });

  it ('should render', () => {
    expect(wrapper).to.have.length(1);
    expect(wrapper.find('.fdk-container-search-hit')).to.have.length(1);
  });

  it ('should render publisher', () => {
    expect(wrapper.find('#search-hit-publisher-text')).to.have.length(1);
  });

  it ('should render themes', () => {
    expect(wrapper.find('#dataset-description-theme-0')).to.have.length(1);
  });

  it ('should render restricted', () => {
    expect(wrapper.find('.fdk-distributions-yellow')).to.have.length(1);
  });

  it ('should render sample', () => {
    expect(wrapper.find('#search-hit-sample')).to.have.length(1);
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
