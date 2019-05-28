import React from 'react';
import { shallow } from 'enzyme';
import { DatasetsListPage } from './dataset-list-page';
import catalog from './__fixtures/catalog';

let defaultProps;
let wrapper;

beforeEach(() => {
  const fetchCatalogIfNeeded = jest.fn();
  const fetchDatasetsIfNeeded = jest.fn();
  defaultProps = {
    catalog,
    fetchCatalogIfNeeded,
    fetchDatasetsIfNeeded
  };
  wrapper = shallow(<DatasetsListPage {...defaultProps} />);
});

test('should render DatasetsListPage correctly', () => {
  expect(wrapper).toMatchSnapshot();
});
