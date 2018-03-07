import React from 'react';
import { createMockStore } from 'redux-test-utils';
import shallowWithStore from '../../shallowWithStore';
import RegCatalogs from '../../../src/containers/reg-catalogs';
import CatalogItem from '../../../src/components/reg-catalogs-item';

describe('RegCatalogs', () => {
  it("should render successfully with no catalogs", () => {
    const testState = {
      catalogs: {
        isFetchingCatalogs: false,
        catalogItems: null
      }
    };
    const store = createMockStore(testState)
    const wrapper = shallowWithStore(<RegCatalogs />, store);
    expect(wrapper).to.be.a('object');
    expect(wrapper).to.have.length(1);
    expect(wrapper.dive().find('#no-catalogs')).to.have.length(1);
  });
});

describe('RegCatalogs', () => {
  it("should render successfully with one catalog", () => {
    const testState = {
      catalogs: {
        isFetchingCatalogs: false,
        catalogItems: {
          _embedded: {
            catalogs: [
              {
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
            ]
          }
        }
      }
    };
    const store = createMockStore(testState)
    const wrapper = shallowWithStore(<RegCatalogs />, store);
    expect(wrapper).to.be.a('object');
    expect(wrapper).to.have.length(1);
    expect(wrapper.dive().find(CatalogItem)).to.have.length(1);
  });
});
