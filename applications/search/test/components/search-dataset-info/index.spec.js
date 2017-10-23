import React from 'react';
import Moment from 'react-moment';

import DatasetInfo from '../../../src/components/search-dataset-info';

describe('DatasetInfo', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<DatasetInfo/>);
  });

  it ('should render', () => {
    expect(wrapper).to.have.length(1);
    expect(wrapper.find('#dataset-info')).to.have.length(1);
  });

  it ('should render issued', () => {
    expect(wrapper.find('#dataset-info-issued')).to.have.length(0);
    wrapper.setProps({ issued: "1325376000000"});
    expect(wrapper.find('#dataset-info-issued')).to.have.length(1);
  });

  it ('should render accrualPeriodicity, provenance and hasCurrentnessAnnotation', () => {
    //expect(wrapper.find('#dataset-info-accrualPeriodicity').text()).to.equal('—');
    //expect(wrapper.find('#dataset-info-provenance').text()).to.equal('—');
    //expect(wrapper.find('#dataset-info-currentnessAnnotation').text()).to.equal('—');
    wrapper.setProps({
      "accrualPeriodicity": "årlig",
      "provenance": "Vedtak",
      "hasCurrentnessAnnotation": "test tekst",
    });
    expect(wrapper.find('#dataset-info-accrualPeriodicity').text()).to.equal('Årlig');
    expect(wrapper.find('#dataset-info-provenance').text()).to.equal('Vedtak');
    expect(wrapper.find('#dataset-info-currentnessAnnotation').text()).to.equal('test tekst');
  });

  it ('should render spatial', () => {
    expect(wrapper.find('#dataset-info-spatial')).to.have.length(0)
    wrapper.setProps({
      "spatial": [
        {
          "uri": "http://www.geonames.org/3162656/asker.html",
          "prefLabel": {
            "nb": "Asker"
          }
        },
        {
          "uri": "http://www.geonames.org/3162212/baerum.html",
          "prefLabel": {
            "nb": "Bærum"
          }
        },
        {
          "uri": "http://www.geonames.org/3151404/hurum.html",
          "prefLabel": {
            "nb": "Hurum"
          }
        },
        {
          "uri": "http://www.geonames.org/3141104/royken.html",
          "prefLabel": {
            "nb": "Røyken"
          }
        }
      ],
    });
    expect(wrapper.find('#dataset-info-spatial').text()).to.equal('Asker, Bærum, Hurum, Røyken');
  });

  it ('should render temporal', () => {
    //expect(wrapper.find('#dataset-info-temporal').text()).to.equal('—');
    wrapper.setProps({
      "temporal": [
        {
          "startDate": 1483228800000,
          "endDate": 1514764799000
        }
      ],
    });
    expect(wrapper.find('#dataset-info-temporal-0')).to.have.length(1);
  });

  it ('should render language', () => {
    expect(wrapper.find('#dataset-info-language-0')).to.have.length(0);
    wrapper.setProps({
      "language": [
        {
          "uri": "http://publications.europa.eu/resource/authority/language/NOR",
          "code": "NOR",
          "prefLabel": {
            "nb": "Norsk"
          }
        }
      ]
    });
    expect(wrapper.find('#dataset-info-language-0')).to.have.length(1);
  });

});
