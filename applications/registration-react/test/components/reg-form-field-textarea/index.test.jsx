import React from 'react';
import { shallow } from 'enzyme';
import TextAreaField from '../../../src/components/reg-form-field-textarea';

let defaultProps;
let wrapper;

beforeEach(() => {
  defaultProps = {
    showLabel: true,
    input: {
      name: 'textarea',
      value: 'Datakatalog for RAMSUND OG ROGNAN REVISJON'
    },
    label: 'label',
    type: 'textarea',
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
    }
  };
  wrapper = shallow(<TextAreaField {...defaultProps} />);
});

test('should render TextAreaField correctly', () => {
  expect(wrapper).toMatchSnapshot();
});
