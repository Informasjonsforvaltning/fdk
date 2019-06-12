import React from 'react';
import { shallow } from 'enzyme';
import { DatasetsListPagePure } from './dataset-list-page-pure';
import catalog from './__fixtures/catalog';

let defaultProps;
let wrapper;

beforeEach(() => {
  const fetchCatalogIfNeeded = jest.fn();
  const fetchDatasetsIfNeeded = jest.fn();
  defaultProps = {
    catalogId: catalog.item.id,
    catalog,
    fetchCatalogIfNeeded,
    fetchDatasetsIfNeeded
  };
  wrapper = shallow(<DatasetsListPagePure {...defaultProps} />);
});

test('should render DatasetsListPagePure correctly', () => {
  expect(wrapper).toMatchSnapshot();
});
