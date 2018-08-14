import React from 'react';
import { shallow } from 'enzyme';
import { ReportStats } from './report-stats.component';
import aggregateDataset from '../../../../test/fixtures/aggregateDataset';
import { extractStats } from '../../../api/get-dataset-stats';

let defaultProps;
let wrapper;

beforeEach(() => {
  defaultProps = {
    stats: extractStats(aggregateDataset),
    entityName: 'test entity'
  };
  wrapper = shallow(<ReportStats {...defaultProps} />);
});

test('should render ReportStats correctly', () => {
  expect(wrapper).toMatchSnapshot();
});
