import React from 'react';
import { shallow } from 'enzyme';
import ReportStats from '../../../src/components/search-results-dataset-report-stats';
import aggregateDataset from '../../fixtures/aggregateDataset';

let onSearch, defaultProps, wrapper;

beforeEach(() => {
  onSearch = jest.fn();

  defaultProps = {
    aggregateDataset: aggregateDataset,
    entity: 'test entity'
  }
  wrapper = shallow(
    <ReportStats {...defaultProps} />
  );
});

test('should render ReportStats correctly', () => {
  expect(wrapper).toMatchSnapshot();
});
