import React from 'react';
import { shallow } from 'enzyme';
import InputTagsField from '../../../src/components/reg-form-field-input-tags';

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
  wrapper = shallow(<InputTagsField {...defaultProps} />);
});

test('should render InputTagsField correctly', () => {
  expect(wrapper).toMatchSnapshot();
});

/*
test('should handle handleChange', () => {
  const mockedEvent = {

  };
  wrapper.find('button').prop('onChange')();
  expect(handleChange).toHaveBeenCalled();
});
*/
