import React from 'react';
import { shallow } from 'enzyme';
import { ResultsDataset } from './results-dataset.component';
import datasetsResponse from '../__fixtures/datasetsApiResponse.json';
import { normalizeAggregations } from '../../../lib/normalizeAggregations';
import { HITS_PER_PAGE } from '../../../constants/constants';

const datasetItems = normalizeAggregations(datasetsResponse);

let closeFilterModal;
let onFilterTheme;
let onFilterAccessRights;
let onFilterPublisherHierarchy;
let onClearFilters;
let onSort;
let onPageChange;
let defaultProps;
let wrapper;

beforeEach(() => {
  closeFilterModal = jest.fn();
  onFilterTheme = jest.fn();
  onFilterAccessRights = jest.fn();
  onFilterPublisherHierarchy = jest.fn();
  onClearFilters = jest.fn();
  onSort = jest.fn();
  onPageChange = jest.fn();

  defaultProps = {
    onSort
  };
  defaultProps = {
    showFilterModal: true,
    datasetItems: {},
    searchQuery: {},
    themesItems: {},
    publisherArray: [],
    publishers: {},
    showClearFilterButton: false,
    hitsPerPage: HITS_PER_PAGE,
    closeFilterModal,
    onFilterTheme,
    onFilterAccessRights,
    onFilterPublisherHierarchy,
    onClearFilters,
    onSort,
    onPageChange
  };
  wrapper = shallow(<ResultsDataset {...defaultProps} />);
});

test.skip('should render ResultsDataset correctly with minimum of props', () => {
  const minWrapper = shallow(<ResultsDataset onSort={onSort} />);
  expect(minWrapper).toMatchSnapshot();
});

test.skip('should render ResultsDataset correctly with props', () => {
  expect(wrapper).toMatchSnapshot();
});

test.skip('should render ResultsDataset correctly with hits', () => {
  wrapper.setProps({
    datasetItems
  });
  expect(wrapper).toMatchSnapshot();
});
