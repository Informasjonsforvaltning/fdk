import React from 'react';
import { shallow } from 'enzyme';
import SelectField from '../../../src/components/reg-form-field-select';
import frequency from '../../fixtures/frequency';

let defaultProps;
let wrapper;
let onChange;
let preventDefault;

beforeEach(() => {
  onChange = jest.fn();
  preventDefault = jest.fn();
  const { frequencyItems } = frequency;
  defaultProps = {
    input: {
      name: 'select',
      value: 'Datakatalog for RAMSUND OG ROGNAN REVISJON',
      onChange
    },
    meta: {
      active: false,
      asyncValidating: false,
      autofilled: false,
      dirty: false,
      form: 'catalog',
      initial: 'Datakatalog for RAMSUND OG ROGNAN REVISJON',
      invalid: false,
      pristine: true,
      submitting: false,
      submitFailed: false,
      touched: false,
      valid: true,
      visited: false
    },
    items: frequencyItems
  };
  wrapper = shallow(<SelectField {...defaultProps} />);
});

test('should render SelectField correctly', () => {
  expect(wrapper).toMatchSnapshot();
});

test('should handle check SMI', () => {
  const mockedEvent = {
    preventDefault
  };
  wrapper.find('Select').prop('onChange')(mockedEvent);
  expect(onChange).toHaveBeenCalled();
});
