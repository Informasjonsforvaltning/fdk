import React from 'react';
import { shallow } from 'enzyme';
import { ReportStats } from './report-stats.component';
import aggregateDataset from '../../../../test/fixtures/aggregateDataset';

let defaultProps;
let wrapper;

beforeEach(() => {
  defaultProps = {
    aggregateDataset,
    entityName: 'test entity'
  };
  wrapper = shallow(<ReportStats {...defaultProps} />);
});

test('should render ReportStats correctly', () => {
  expect(wrapper).toMatchSnapshot();
});
