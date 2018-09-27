import React from 'react';
import { shallow } from 'enzyme';
import { DatasetDistribution } from './dataset-distribution.component';
import dataset from '../__fixtures/datasetApiResponse.json';

test('should render DatasetDistribution correctly with no props', () => {
  const minWrapper = shallow(<DatasetDistribution />);
  expect(minWrapper).toMatchSnapshot();
});

test('should render DatasetDistribution correctly', () => {
  const defaultProps = {
    title: dataset.title.nb,
    description: dataset.description.nb,
    accessUrl: dataset.distribution[0].accessURL,
    format: dataset.distribution[0].format,
    code: dataset.distribution[0].code,
    license: dataset.distribution[0].license,
    conformsTo: dataset.conformsTo,
    page: dataset.page
  };
  const wrapper = shallow(<DatasetDistribution {...defaultProps} />);
  expect(wrapper).toMatchSnapshot();
});
