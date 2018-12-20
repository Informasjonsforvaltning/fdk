import React from 'react';
import { shallow } from 'enzyme';
import { ResultsConcepts } from './results-concepts.component';
import concepts from '../../../../test/fixtures/concepts';
import { HITS_PER_PAGE } from '../../../constants/constants';

let onClearFilters;
let onPageChange;
let onFilterPublisherHierarchy;
let closeFilterModal;
let defaultProps;
let wrapper;

beforeEach(() => {
  onClearFilters = jest.fn();
  onPageChange = jest.fn();
  onFilterPublisherHierarchy = jest.fn();
  closeFilterModal = jest.fn();

  defaultProps = {
    termItems: concepts,
    onClearFilters,
    onPageChange,
    onFilterPublisherHierarchy,
    searchQuery: {},
    hitsPerPage: HITS_PER_PAGE,
    showFilterModal: false,
    closeFilterModal,
    showClearFilterButton: false,
    publisherArray: null,
    publishers: null
  };
  wrapper = shallow(<ResultsConcepts {...defaultProps} />);
  wrapper.setState({
    terms: [concepts.hits.hits[0]._source]
  });
});

test.skip('should render ResultsConcepts correctly with minimum of props', () => {
  const minWrapper = shallow(<ResultsConcepts />);
  expect(minWrapper).toMatchSnapshot();
});

test.skip('should render ResultsConcepts correctly with props', () => {
  expect(wrapper).toMatchSnapshot();
});

/*
test('should render ResultsConcepts correctly with renderCompareTerms', () => {
  expect(wrapper).toMatchSnapshot();
});
*/
/*
test('should render ResultsConcepts correctly with hits', () => {
  wrapper.setProps({
    datasetItems: datasetItems[0]
  });
  expect(wrapper).toMatchSnapshot();
});
*/
