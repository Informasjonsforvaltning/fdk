import _ from 'lodash';
import React from 'react';
import { shallow } from 'enzyme';
import { SearchPublishersTree } from './search-publishers-tree.component';
import publishers from '../../../../test/fixtures/publishers';
import { normalizeAggregations } from '../../../lib/normalizeAggregations';
import datasetsApiResponse from './__fixtures/datasetsApiResponse.json';

const normalizedDatasetsApiResponse = normalizeAggregations(
  datasetsApiResponse
);
const publisherCounts = _.get(
  normalizedDatasetsApiResponse,
  'aggregations.orgPath.buckets'
);
let onFilterPublisherHierarchy;
let defaultProps;
let wrapper;

beforeEach(() => {
  onFilterPublisherHierarchy = jest.fn();

  defaultProps = {
    title: 'title',
    publisherCounts,
    onFilterPublisherHierarchy,
    publishers
  };
  wrapper = shallow(<SearchPublishersTree {...defaultProps} />);
});

test('should render SearchPublishersTree correctly with minimum of props', () => {
  const minWrapper = shallow(
    <SearchPublishersTree
      onFilterPublisherHierarchy={onFilterPublisherHierarchy}
    />
  );
  expect(minWrapper).toMatchSnapshot();
});

test('should render SearchPublishersTree correctly with props', () => {
  expect(wrapper).toMatchSnapshot();
});

test('should render SearchPublishersTree correctly with active filter', () => {
  wrapper.setProps({
    activeFilter: '/STAT'
  });
  expect(wrapper).toMatchSnapshot();
});

test('should render SearchPublishersTree correctly with active sub filter', () => {
  wrapper.setProps({
    activeFilter: '/KOMMUNE/958935420/974770482'
  });
  expect(wrapper).toMatchSnapshot();
});

test('should handle toggleFilter', () => {
  wrapper.find('button.fdk-publisher-toggle').simulate('click');
  expect(wrapper.state('openFilter')).toBe(false);
});
