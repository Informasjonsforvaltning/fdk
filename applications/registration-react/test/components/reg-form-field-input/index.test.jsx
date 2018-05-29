import React from 'react';
import { shallow } from 'enzyme';
import InputField from '../../../src/components/reg-form-field-input';

let defaultProps;
let wrapper;

beforeEach(() => {
  defaultProps = {
    showLabel: true,
    input: {
      name: 'input',
      value: 'Datakatalog for RAMSUND OG ROGNAN REVISJON'
    },
    label: 'label',
    type: 'input',
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
  wrapper = shallow(<InputField {...defaultProps} />);
});

test('should render InputField correctly', () => {
  expect(wrapper).toMatchSnapshot();
});
