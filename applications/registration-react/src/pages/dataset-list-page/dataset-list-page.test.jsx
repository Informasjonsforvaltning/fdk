import React from 'react';
import { shallow } from 'enzyme';
import { createMockStore } from 'redux-test-utils';
import shallowWithStore from '../../../test/shallowWithStore';
import RegDatasetsListComponent, { RegDatasetsList } from './dataset-list-page';
import datasets from '../../../test/fixtures/datasets';
import helptext from '../../../test/fixtures/helptext';
import catalogs from '../../../test/fixtures/catalogs';

let defaultProps;
let wrapper;
let dispatch;

beforeEach(() => {
  dispatch = jest.fn();
  defaultProps = {
    dispatch,
    datasetItems: datasets.datasetItems,
    helptextItems: helptext.helptextItems,
    isFetchingCatalog: false,
    catalogItem: catalogs.catalogItems[0]
  };
  wrapper = shallow(<RegDatasetsList {...defaultProps} />);
});

test('should render ProtectedRoute correctly', () => {
  expect(wrapper).toMatchSnapshot();
});

test('should render FormAccessRightsSchema correctly', () => {
  const testState = {
    catalogs
  };
  const store = createMockStore(testState);
  wrapper = shallowWithStore(<RegDatasetsListComponent />, store);
  expect(wrapper).toMatchSnapshot();
});
