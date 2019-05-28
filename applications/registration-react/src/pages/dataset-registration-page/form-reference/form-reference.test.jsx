import React from 'react';
import { shallow } from 'enzyme';
import { FormReference, renderReference } from './form-reference.component';

let defaultProps;
let wrapper;

beforeEach(() => {
  defaultProps = {
    initialValues: {}
  };
  wrapper = shallow(<FormReference {...defaultProps} />);
});

test('should render FormReference correctly', () => {
  expect(wrapper).toMatchSnapshot();
});

test('should render renderReference correctly', () => {
  wrapper = shallow(renderReference(defaultProps));
  expect(wrapper).toMatchSnapshot();
});
