import React from 'react';
import { shallow } from 'enzyme';
import { ResultsApi } from './results-api.component';
//import datasetItems from '../../../../test/fixtures/datasetItems';
import apis from '../../../../test/fixtures/apis';

let closeFilterModal;
let onFilterTheme;
let onFilterAccessRights;
let onFilterPublisherHierarchy;
let onClearSearch;
let onSort;
let onPageChange;
let defaultProps;
let wrapper;

beforeEach(() => {
  closeFilterModal = jest.fn();
  onFilterTheme = jest.fn();
  onFilterAccessRights = jest.fn();
  onFilterPublisherHierarchy = jest.fn();
  onClearSearch = jest.fn();
  onSort = jest.fn();
  onPageChange = jest.fn();

  defaultProps = {
    onSort
  };
  defaultProps = {
    showFilterModal: true,
    apiItems: {},
    searchQuery: {},
    themesItems: {},
    publisherArray: [],
    publishers: {},
    showClearFilterButton: false,
    hitsPerPage: 10,
    closeFilterModal,
    onFilterTheme,
    onFilterAccessRights,
    onFilterPublisherHierarchy,
    onClearSearch,
    onSort,
    onPageChange
  };
  wrapper = shallow(<ResultsApi {...defaultProps} />);
});

test('should render ResultsApi correctly with minimum of props', () => {
  const minWrapper = shallow(<ResultsApi onSort={onSort} />);
  expect(minWrapper).toMatchSnapshot();
});

test('should render ResultsApi correctly with props', () => {
  expect(wrapper).toMatchSnapshot();
});

test('should render ResultsApi correctly with hits', () => {
  wrapper.setProps({
    apiItems: { aggregations: {}, hits: apis[0] }
  });
  expect(wrapper).toMatchSnapshot();
});
