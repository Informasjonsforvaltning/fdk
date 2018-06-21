import React from 'react';
import { shallow } from 'enzyme';
import { ResultsDatasetsReport } from './results-datasets-report.component';
import aggregateDataset from '../../../../test/fixtures/aggregateDataset';

test('should render ResultsDatasetsReport correctly with props', () => {
  const wrapper = shallow(<ResultsDatasetsReport />);
  expect(wrapper).toMatchSnapshot();
});

test('should render ResultsDatasetsReport correctly with hits', () => {
  const wrapper = shallow(<ResultsDatasetsReport />);
  wrapper.setState({
    aggregateDataset
  });
  expect(wrapper).toMatchSnapshot();
});
