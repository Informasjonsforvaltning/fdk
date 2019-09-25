import React from 'react';
import { shallow } from 'enzyme';
import TagsInputFieldArray from './tags-input-field-array.component';

let defaultProps;
let wrapper;

beforeEach(() => {
  defaultProps = {
    input: {
      name: 'spatial',
      value: []
    },
    meta: {
      active: false,
      asyncValidating: false,
      autofilled: false,
      dirty: false,
      form: 'spatial',
      initial: [],
      invalid: false,
      pristine: true,
      submitting: false,
      submitFailed: false,
      touched: false,
      valid: true,
      visited: false
    },
    type: 'text',
    label: 'Geografisk avgrensning',
    fieldLabel: 'uri',
    showLabel: false
  };
  wrapper = shallow(<TagsInputFieldArray {...defaultProps} />);
});

test('should render TagsInputFieldArray correctly', () => {
  expect(wrapper).toMatchSnapshot();
});
