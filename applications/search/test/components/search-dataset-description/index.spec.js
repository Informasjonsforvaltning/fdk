import React from 'react';
import DatasetDescription from '../../../src/components/search-dataset-description';

describe('DatasetDescription', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<DatasetDescription />);
  });

  it ('should render', () => {
    expect(wrapper).to.have.length(1);
    expect(wrapper.find('#dataset-description')).to.have.length(1);
  });


  it ('should render title', () => {
    wrapper.setProps({ title: 'tittel'});
    expect(wrapper.find('h1.fdk-margin-bottom')).to.have.length(1);
  });

  it ('should render description', () => {
    wrapper.setProps({ description: 'description'});
    expect(wrapper.find('p.fdk-ingress')).to.have.length(1);
  });

  it ('should render publisher without link', () => {
    wrapper.setProps({
      "publisher": {
        "name": "SKATTEETATEN",
      }
    });
    expect(wrapper.find('#dataset-descritption-publisher-text')).to.have.length(1);
    expect(wrapper.find('#dataset-descritption-publisher-link')).to.have.length(0);
  });

  it ('should render themes', () => {
    wrapper.setProps({
      "selectedLanguageCode": 'nb',
      "themes": [
        {
          "id" : "http://publications.europa.eu/resource/authority/data-theme/GOVE",
          "code" : "GOVE",
          "startUse" : "2015-10-01",
          "title" : {
            "it" : "Governo e settore pubblico",
            "nb" : "Forvaltning og offentlig sektor",
            "en" : "Government and public sector",
            "hr" : "Vlada i javni sektor",
            "es" : "Gobierno y sector público",
            "de" : "Regierung und öffentlicher Sektor",
            "sk" : "Vláda a verejný sektor",
            "ro" : "Guvern şi sector public",
            "bg" : "Правителство и публичен сектор",
            "et" : "Valitsus ja avalik sektor",
            "el" : "Κυβέρνηση και δημόσιος τομέας",
            "pl" : "Rząd i sektor publiczny",
            "cs" : "Vláda a veřejný sektor",
            "ga" : "Rialtas agus earnáil phoiblí",
            "pt" : "Governo e setor público",
            "lt" : "Vyriausybė ir viešasis sektorius",
            "lv" : "Valdība un sabiedriskais sektors",
            "mt" : "Gvern u settur pubbliku",
            "hu" : "Kormányzat és közszféra",
            "da" : "Regeringen og den offentlige sektor",
            "fi" : "Valtioneuvosto ja julkinen sektori",
            "fr" : "Gouvernement et secteur public",
            "sl" : "Vlada in javni sektor",
            "sv" : "Regeringen och den offentliga sektorn",
            "nl" : "Overheid en publieke sector"
          },
          "conceptSchema" : {
            "id" : "http://publications.europa.eu/resource/authority/data-theme",
            "title" : {
              "en" : "Dataset types Named Authority List"
            },
            "versioninfo" : "20160921-0",
            "versionnumber" : "20160921-0"
          }
        }
      ]
    });
    expect(wrapper.find('#dataset-description-theme-GOVE')).to.have.length(1);
  });

});
