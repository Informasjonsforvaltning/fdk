import React from 'react';
import { createMockStore } from 'redux-test-utils';
import shallowWithStore from '../../shallowWithStore';
import RegDatasetsList from '../../../src/containers/reg-datasets-list';
import DatasetItemsList from '../../../src/components/reg-dataset-items-list';

describe('RegDatasetsList', () => {
  it("should render successfully with no datasets", () => {
    const testState = {
      helptextItems: null,
      catalogItem: null,
      isFetchingCatalog: null,
      datasetItems: null
    };
    const store = createMockStore(testState)
    const wrapper = shallowWithStore(<RegDatasetsList />, store);
    expect(wrapper).to.be.a('object');
    expect(wrapper).to.have.length(1);
    expect(wrapper.dive().find(DatasetItemsList)).to.have.length(0);
  });
});

describe('RegDatasetsList', () => {
  it("should render successfully with datasets", () => {
    const testState = {
      helptexts: {
        helptextItems: {}
      },
      catalog: {
        catalogItem: {
          id: '910244132',
          uri: 'http://brreg.no/catalogs/910244132',
          title: {
            nb: 'Datakatalog for RAMSUND OG ROGNAN REVISJON'
          },
          description: {
            nb: 'Beskrivelsen2.'
          },
          publisher: {
            uri: 'http://data.brreg.no/enhetsregisteret/enhet/910244132',
            name: 'RAMSUND OG ROGNAN REVISJON'
          }
        }
      },
      isFetchingCatalog: false,
      datasets: {
        datasetItems: {}
      }
    };
    const store = createMockStore(testState)
    const wrapper = shallowWithStore(<RegDatasetsList />, store);
    expect(wrapper.dive().find('.fdk-reg-datasets-list')).to.have.length(1);
    expect(wrapper.dive().find(DatasetItemsList)).to.have.length(1);
  });
});
