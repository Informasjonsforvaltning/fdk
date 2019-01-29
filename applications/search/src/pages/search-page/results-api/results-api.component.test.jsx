import React from 'react';
import { shallow } from 'enzyme';
import _ from 'lodash';
import { ResultsApi } from './results-api.component';
import apisApiResponse from '../../../mock/apis.response.json';
import { HITS_PER_PAGE } from '../../../constants/constants';

let closeFilterModal;
let onFilterTheme;
let onFilterAccessRights;
let onFilterPublisherHierarchy;
let onClearFilters;
let setApiSort;
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
  setApiSort = jest.fn();
  onSortByLastModified = jest.fn();
  onSortByScore = jest.fn();
  onPageChange = jest.fn();

  defaultProps = {
    showFilterModal: true,
    apiItems: {},
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
    setApiSort,
    onSortByLastModified,
    onSortByScore,
    onPageChange
  };
  wrapper = shallow(<ResultsApi {...defaultProps} />);
});

test('should render ResultsApi correctly with minimum of props and no hits', () => {
  const minWrapper = shallow(
    <ResultsApi
      setApiSort={setApiSort}
      onSortByLastModified={onSortByLastModified}
      onSortByScore={onSortByScore}
    />
  );
  expect(minWrapper).toMatchSnapshot();
});

test('should render ResultsApi correctly with hits', () => {
  wrapper.setProps({
    apiItems: _.get(apisApiResponse, 'hits'),
    apiAggregations: _.get(apisApiResponse, 'aggregations'),
    apiTotal: _.get(apisApiResponse, 'total')
  });
  expect(wrapper).toMatchSnapshot();
});
