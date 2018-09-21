import React from 'react';
import { shallow } from 'enzyme';
import CheckboxFieldType from './field-checkbox.component';

let defaultProps;
let wrapper;

beforeEach(() => {
  defaultProps = {
    input: { name: 'type', value: [] }
  };
  wrapper = shallow(<CheckboxFieldType {...defaultProps} />);
});

test('should render CheckboxFieldType correctly', () => {
  expect(wrapper).toMatchSnapshot();
});
