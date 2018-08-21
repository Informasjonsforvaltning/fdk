import React from 'react';
import { shallow } from 'enzyme';
import { ApiEndpoints } from './api-endpoints.component';
import { paths } from './__fixtures/paths';

let defaultProps;

test('should render api-ApiEndpoints correctly with no props', () => {
  const wrapper = shallow(<ApiEndpoints />);
  expect(wrapper).toMatchSnapshot();
});

test('should render api-ApiEndpoints correctly', () => {
  defaultProps = {
    name: 'Test',
    paths
  };
  const wrapper = shallow(<ApiEndpoints {...defaultProps} />);
  expect(wrapper).toMatchSnapshot();
});
