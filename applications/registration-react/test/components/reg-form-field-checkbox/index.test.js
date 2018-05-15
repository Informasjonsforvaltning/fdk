import React from 'react';
import { shallow } from 'enzyme';
import CheckboxField from '../../../src/components/reg-form-field-checkbox';

let defaultProps, wrapper;

beforeEach(() => {
  defaultProps = {
    input: {'name':'language','value':[]},
    label: 'label'
  };
  wrapper = shallow(<CheckboxField {...defaultProps} />);
});

test('should render CheckboxField correctly', () => {
  expect(wrapper).toMatchSnapshot();
});
