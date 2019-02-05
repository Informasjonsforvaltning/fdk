import React from 'react';
import { shallow } from 'enzyme';
import _ from 'lodash';
import { ResultsConcepts } from './results-concepts.component';
import concepts from '../../../../test/fixtures/concepts';
import { HITS_PER_PAGE } from '../../../constants/constants';
import { normalizeAggregations } from '../../../lib/normalizeAggregations';

let onClearFilters;
let onPageChange;
let onFilterPublisherHierarchy;
let closeFilterModal;
let setConceptSort;
let onSortByLastModified;
let onSortByScore;
let defaultProps;
let wrapper;

beforeEach(() => {
  onClearFilters = jest.fn();
  onPageChange = jest.fn();
  onFilterPublisherHierarchy = jest.fn();
  closeFilterModal = jest.fn();
  setConceptSort = jest.fn();
  onSortByLastModified = jest.fn();
  onSortByScore = jest.fn();

  defaultProps = {
    conceptItems: concepts,
    onClearFilters,
    onPageChange,
    onFilterPublisherHierarchy,
    searchQuery: {},
    hitsPerPage: HITS_PER_PAGE,
    showFilterModal: false,
    closeFilterModal,
    showClearFilterButton: false,
    publisherArray: null,
    publishers: null,
    setConceptSort,
    onSortByLastModified,
    onSortByScore
  };
  wrapper = shallow(<ResultsConcepts {...defaultProps} />);
});

test('should render ResultsConcepts correctly with minimum of props', () => {
  const minWrapper = shallow(
    <ResultsConcepts
      setConceptSort={setConceptSort}
      onSortByLastModified={onSortByLastModified}
      onSortByScore={onSortByScore}
    />
  );
  expect(minWrapper).toMatchSnapshot();
});

test('should render ResultsConcepts correctly with props', () => {
  expect(wrapper).toMatchSnapshot();
});

test('should render ResultsConcepts correctly with hits', () => {
  wrapper.setProps({
    conceptItems: _.get(concepts, ['_embedded', 'concepts']),
    conceptAggregations: _.get(normalizeAggregations(concepts), 'aggregations'),
    conceptTotal: _.get(concepts, ['page', 'totalElements'])
  });
  expect(wrapper).toMatchSnapshot();
});
