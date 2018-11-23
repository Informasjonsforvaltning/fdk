import React from 'react';
import { shallow } from 'enzyme';
import { ApiEndpoints } from './api-endpoints.component';
import apiItem from './__fixtures/apiItem.json';

let defaultProps;

test('should render api-ApiEndpoints correctly with no props', () => {
  const wrapper = shallow(<ApiEndpoints />);
  expect(wrapper).toMatchSnapshot();
});

test('should render api-ApiEndpoints correctly', () => {
  defaultProps = {
    name: 'Test',
    paths: apiItem.openApi && apiItem.openApi.paths,
    apiSpecUrl: apiItem.apiSpecUrl,
    apiDocUrl: apiItem.apiDocUrl
  };
  const wrapper = shallow(<ApiEndpoints {...defaultProps} />);
  expect(wrapper).toMatchSnapshot();
});
