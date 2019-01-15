import React from 'react';
import { shallow } from 'enzyme';

import { APIListPage } from './api-list-page';

let defaultProps;
let wrapper;

beforeEach(() => {
  const fetchCatalogIfNeeded = jest.fn();
  const fetchApisIfNeeded = jest.fn();
  const fetchApiCatalogIfNeeded = jest.fn();

  const catalogItem = {
    id: '910244132',
    uri: 'http://brreg.no/catalogs/910244132',
    title: {
      nb: 'Datakatalog for RAMSUND OG ROGNAN REVISJON'
    },
    description: {},
    publisher: {
      uri: 'http://data.brreg.no/enhetsregisteret/enhet/910244132',
      name: 'RAMSUND OG ROGNAN REVISJON'
    }
  };
  const match = {
    path: '/catalogs/:catalogId/apiSpecs',
    url: '/catalogs/910244132/apiSpecs',
    isExact: true,
    params: { catalogId: '910244132' }
  };
  defaultProps = {
    catalogItem,
    match,
    fetchCatalogIfNeeded,
    fetchApisIfNeeded,
    fetchApiCatalogIfNeeded
  };
  wrapper = shallow(<APIListPage {...defaultProps} />);
});

test('should render APIListPageComponent correctly', () => {
  expect(wrapper).toMatchSnapshot();
});
