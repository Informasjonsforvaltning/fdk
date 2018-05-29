import React from 'react';
import { shallow } from 'enzyme';
import ReportStats from '../../../src/components/search-results-dataset-report-stats';
import aggregateDataset from '../../fixtures/aggregateDataset';

let defaultProps;
let wrapper;

beforeEach(() => {
  defaultProps = {
    aggregateDataset,
    entity: 'test entity'
  };
  wrapper = shallow(<ReportStats {...defaultProps} />);
});

test('should render ReportStats correctly', () => {
  expect(wrapper).toMatchSnapshot();
});
