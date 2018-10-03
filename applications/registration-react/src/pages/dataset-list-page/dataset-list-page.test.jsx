import React from 'react';
import { shallow } from 'enzyme';
import { DatasetsListPage } from './dataset-list-page';
import datasets from './__fixtures/datasets';
import helptext from '../../../test/fixtures/helptext';
import catalog from './__fixtures/catalog';

let defaultProps;
let wrapper;
let dispatch;

beforeEach(() => {
  const fetchHelptextsIfNeeded = jest.fn();
  const fetchCatalogIfNeeded = jest.fn();
  const fetchDatasetsIfNeeded = jest.fn();
  defaultProps = {
    dispatch,
    datasets,
    helptextItems: helptext.helptextItems,
    catalog,
    fetchHelptextsIfNeeded,
    fetchCatalogIfNeeded,
    fetchDatasetsIfNeeded
  };
  wrapper = shallow(<DatasetsListPage {...defaultProps} />);
});

test('should render DatasetsListPage correctly', () => {
  expect(wrapper).toMatchSnapshot();
});
