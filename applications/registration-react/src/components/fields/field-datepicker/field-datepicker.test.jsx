import React from 'react';
import { shallow } from 'enzyme';
import DatepickerField from './field-datepicker.component';

let defaultProps;
let wrapper;

beforeEach(() => {
  defaultProps = {
    input: { name: 'date', value: '2018-05-15T12:46:34.495Z' },
    showLabel: true,
    label: 'label'
  };
  wrapper = shallow(<DatepickerField {...defaultProps} />);
});

test('should render DatepickerField correctly', () => {
  expect(wrapper).toMatchSnapshot();
});
