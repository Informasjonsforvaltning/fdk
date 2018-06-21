import React from 'react';
import { shallow } from 'enzyme';
import { DistributionFormat } from './distribution-format.component';

test('should render DistributionFormat with "Dataset" correctly', () => {
  const defaultProps = {
    code: 'PUBLIC',
    text: 'ESRI Filgeodatabase',
    type: 'xml'
  };
  const wrapper = shallow(<DistributionFormat {...defaultProps} />);
  expect(wrapper).toMatchSnapshot();
});

test('should render DistributionFormat with "Dataset" correctly with no type', () => {
  const defaultProps = {
    code: 'PUBLIC',
    text: 'ESRI Filgeodatabase'
  };
  const wrapper = shallow(<DistributionFormat {...defaultProps} />);
  expect(wrapper).toMatchSnapshot();
});
