import React from 'react';
import { shallow } from 'enzyme';
import { ResultsApi } from './results-api.component';
import apisApiResponse from '../__fixtures/apisApiResponse.json';
import { HITS_PER_PAGE } from '../../../constants/constants';

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
    onSort,
    onPageChange
  };
  wrapper = shallow(<ResultsApi {...defaultProps} />);
});

test.skip('should render ResultsApi correctly with minimum of props and no hits', () => {
  const minWrapper = shallow(<ResultsApi onSort={onSort} />);
  expect(minWrapper).toMatchSnapshot();
});

test.skip('should render ResultsApi correctly with hits', () => {
  wrapper.setProps({
    apiItems: apisApiResponse
  });
  expect(wrapper).toMatchSnapshot();
});
