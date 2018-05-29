import React from 'react';
import { shallow } from 'enzyme';
import InputTitleField from '../../../src/components/reg-form-field-input-title';

let defaultProps;
let wrapper;
let onToggleTitle;
let preventDefault;

beforeEach(() => {
  onToggleTitle = jest.fn();
  preventDefault = jest.fn();
  defaultProps = {
    input: {
      name: 'title.nb',
      value: 'Datakatalog for RAMSUND OG ROGNAN REVISJON'
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
    label: 'Tittel',
    hideInput: false,
    showLabel: false,
    onToggleTitle
  };
  wrapper = shallow(<InputTitleField {...defaultProps} />);
});

test('should render InputTitleField correctly', () => {
  expect(wrapper).toMatchSnapshot();
});

test('should handle onToggleTitle', () => {
  const mockedEvent = {
    preventDefault
  };
  wrapper.find('button').prop('onClick')(mockedEvent);
  expect(onToggleTitle).toHaveBeenCalled();
});
