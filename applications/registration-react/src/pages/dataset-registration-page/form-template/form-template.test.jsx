import React from 'react';
import { shallow } from 'enzyme';
import FormTemplate from './form-template.component';

let defaultProps;
let wrapper;

beforeEach(() => {
  defaultProps = {
    values: null,
    title: null,
    backgroundBlue: false,
    syncErrors: false,
    required: false,
    children: null
  };
  wrapper = shallow(<FormTemplate {...defaultProps} />);
});

test('should render FormTemplate correctly', () => {
  expect(wrapper).toMatchSnapshot();
});
