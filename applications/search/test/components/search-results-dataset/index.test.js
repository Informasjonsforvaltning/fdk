
import React from 'react';
import { shallow } from 'enzyme';
import ResultsDataset from '../../../src/components/search-results-dataset';
import datasetItems from '../../fixtures/datasetItems';

let closeFilterModal, onFilterTheme, onFilterAccessRights, onFilterPublisherHierarchy, onClearSearch, onSort, onPageChange, defaultProps, wrapper;

beforeEach(() => {
  closeFilterModal = jest.fn();
  onFilterTheme = jest.fn();
  onFilterAccessRights = jest.fn();
  onFilterPublisherHierarchy = jest.fn();
  onClearSearch = jest.fn();
  onSort = jest.fn();
  onPageChange = jest.fn();

  defaultProps = {
    onSort: onSort
  };
  defaultProps = {
    showFilterModal: true,
    datasetItems: {},
    searchQuery: {},
    themesItems: {},
    publisherArray: [],
    publishers: {},
    showClearFilterButton: false,
    hitsPerPage: 10,
    closeFilterModal: closeFilterModal,
    onFilterTheme: onFilterTheme,
    onFilterAccessRights: onFilterAccessRights,
    onFilterPublisherHierarchy: onFilterPublisherHierarchy,
    onClearSearch: onClearSearch,
    onSort: onSort,
    onPageChange: onPageChange,
  }
  wrapper = shallow(
    <ResultsDataset  {...defaultProps} />
  );
});

test('should render ResultsDataset correctly with minimum of props', () => {
  const minWrapper = shallow(<ResultsDataset onSort={onSort} />)
  expect(minWrapper).toMatchSnapshot();
});

test('should render ResultsDataset correctly with props', () => {
  expect(wrapper).toMatchSnapshot();
});

test('should render ResultsDataset correctly with hits', () => {
  wrapper.setProps({
    datasetItems: datasetItems[0]
  });
  expect(wrapper).toMatchSnapshot();
});
