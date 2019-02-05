import React from 'react';
import { shallow } from 'enzyme';
import _ from 'lodash';
import { ResultsDatasetPure } from './results-dataset.component';
import datasetsResponse from '../__fixtures/datasetsApiResponse.json';
import { normalizeAggregations } from '../../../lib/normalizeAggregations';
import { HITS_PER_PAGE } from '../../../constants/constants';

let closeFilterModal;
let onFilterTheme;
let onFilterAccessRights;
let onFilterPublisherHierarchy;
let onClearFilters;
let setDatasetSort;
let onSortByLastModified;
let onSortByScore;
let onPageChange;
let defaultProps;
let wrapper;

beforeEach(() => {
  closeFilterModal = jest.fn();
  onFilterTheme = jest.fn();
  onFilterAccessRights = jest.fn();
  onFilterPublisherHierarchy = jest.fn();
  onClearFilters = jest.fn();
  setDatasetSort = jest.fn();
  onSortByLastModified = jest.fn();
  onSortByScore = jest.fn();
  onPageChange = jest.fn();

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
    setDatasetSort,
    onSortByLastModified,
    onSortByScore,
    onPageChange
  };
  wrapper = shallow(<ResultsDatasetPure {...defaultProps} />);
});

test('should render ResultsDataset correctly with minimum of props', () => {
  const minWrapper = shallow(
    <ResultsDatasetPure
      setDatasetSort={setDatasetSort}
      onSortByLastModified={onSortByLastModified}
      onSortByScore={onSortByScore}
    />
  );
  expect(minWrapper).toMatchSnapshot();
});

test('should render ResultsDataset correctly with props', () => {
  expect(wrapper).toMatchSnapshot();
});

test('should render ResultsDataset correctly with hits', () => {
  wrapper.setProps({
    datasetItems: _.get(datasetsResponse, ['hits', 'hits']),
    datasetAggregations: _.get(normalizeAggregations(datasetsResponse), [
      'aggregations'
    ]),
    datasetTotal: _.get(datasetsResponse, ['hits', 'total'])
  });
  expect(wrapper).toMatchSnapshot();
});
