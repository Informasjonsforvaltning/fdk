import React from 'react';
import { shallow } from 'enzyme';
import DatepickerField from '../../../src/components/reg-form-field-datepicker';

let defaultProps, wrapper;

beforeEach(() => {
  defaultProps = {
    input: {'name':'date','value':[]},
    showLabel: true,
    label: 'label'
  };
  wrapper = shallow(<DatepickerField {...defaultProps} />);
});

test('should render DatepickerField correctly', () => {
  expect(wrapper).toMatchSnapshot();
});
