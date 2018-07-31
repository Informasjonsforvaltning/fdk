import React from 'react';
import { shallow } from 'enzyme';
import { DatasetsReportPage } from './datasets-report-page';
import aggregateDataset from '../../../test/fixtures/aggregateDataset';

test('should render DatasetsReportPage correctly with props', () => {
  const wrapper = shallow(<DatasetsReportPage />);
  expect(wrapper).toMatchSnapshot();
});

test('should render DatasetsReportPage correctly with hits', () => {
  const wrapper = shallow(<DatasetsReportPage />);
  wrapper.setState({
    aggregateDataset
  });
  expect(wrapper).toMatchSnapshot();
});
