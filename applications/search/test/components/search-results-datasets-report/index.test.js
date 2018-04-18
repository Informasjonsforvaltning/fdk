import React from 'react';
import { shallow } from 'enzyme';
import ResultsDatasetsReport from '../../../src/components/search-results-datasets-report';
import aggregateDataset from '../../fixtures/aggregateDataset';

let handleOnPublisherSearchonPageChange, getPublishers, handleOnClearSearch, handleOnTreeChange, handleOnChangeSearchField, handleOnPublisherSearch;

beforeEach(() => {
  handleOnPublisherSearch = jest.fn();
  handleOnChangeSearchField = jest.fn();
  handleOnTreeChange = jest.fn();
  handleOnClearSearch = jest.fn();
  getPublishers = jest.fn();
  handleOnPublisherSearchonPageChange = jest.fn();
});

test('should render ResultsDatasetsReport correctly with props', () => {
  const wrapper = shallow(<ResultsDatasetsReport />);
  expect(wrapper).toMatchSnapshot();
});

test('should render ResultsDatasetsReport correctly with hits', () => {
  const wrapper = shallow(<ResultsDatasetsReport />);
  wrapper.setState({
    aggregateDataset: aggregateDataset
  })
  expect(wrapper).toMatchSnapshot();
});

