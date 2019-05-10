import _ from 'lodash';
import React from 'react';
import { shallow } from 'enzyme';
import { FilterTree } from './filter-tree.component';
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
    aggregations: publisherCounts,
    handleFiltering: onFilterPublisherHierarchy,
    referenceDataItems: publishers
  };
  wrapper = shallow(<FilterTree {...defaultProps} />);
});

test('should render FilterTree correctly with minimum of props', () => {
  const minWrapper = shallow(
    <FilterTree handleFiltering={onFilterPublisherHierarchy} />
  );
  expect(minWrapper).toMatchSnapshot();
});

test('should render FilterTree correctly with props', () => {
  expect(wrapper).toMatchSnapshot();
});

test('should render FilterTree correctly with active filter', () => {
  wrapper.setProps({
    activeFilter: '/STAT'
  });
  expect(wrapper).toMatchSnapshot();
});

test('should render FilterTree correctly with active sub filter', () => {
  wrapper.setProps({
    activeFilter: '/KOMMUNE/958935420/974770482'
  });
  expect(wrapper).toMatchSnapshot();
});

test('should handle toggleFilter', () => {
  wrapper.find('button.fdk-publisher-toggle').simulate('click');
  expect(wrapper).toMatchSnapshot();
});
