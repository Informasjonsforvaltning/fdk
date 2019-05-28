import React from 'react';
import { shallow } from 'enzyme';
import { FormContactPoint } from './form-contactPoint.component';

let defaultProps;
let wrapper;

beforeEach(() => {
  defaultProps = {};
  wrapper = shallow(<FormContactPoint {...defaultProps} />);
});

test('should render FormContactPoint correctly', () => {
  expect(wrapper).toMatchSnapshot();
});
