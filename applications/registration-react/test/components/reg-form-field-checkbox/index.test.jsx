import React from 'react';
import { shallow } from 'enzyme';
import CheckboxField from '../../../src/components/reg-form-field-checkbox';

let defaultProps;
let wrapper;
let preventDefault;
let onChange;

beforeEach(() => {
  preventDefault = jest.fn();
  onChange = jest.fn();
  defaultProps = {
    input: { name: 'language', value: [], onChange },
    label: 'label'
  };
  wrapper = shallow(<CheckboxField {...defaultProps} />);
});

test('should render CheckboxField correctly', () => {
  expect(wrapper).toMatchSnapshot();
});

test('should handle uncheck NOR', () => {
  const mockedEvent = {
    target: { value: 'NOR' },
    preventDefault
  };
  wrapper
    .find('input')
    .first()
    .prop('onChange')(mockedEvent);
  expect(onChange).toHaveBeenCalled();
});

test('should handle check NOR', () => {
  const mockedEvent = {
    target: { value: 'NOR', checked: 'checked' },
    preventDefault
  };
  wrapper
    .find('input')
    .first()
    .prop('onChange')(mockedEvent);
  expect(onChange).toHaveBeenCalled();
});

test('should handle check ENG', () => {
  const mockedEvent = {
    target: { value: 'ENG', checked: 'checked' },
    preventDefault
  };
  wrapper
    .find('input')
    .first()
    .prop('onChange')(mockedEvent);
  expect(onChange).toHaveBeenCalled();
});

test('should handle check SMI', () => {
  const mockedEvent = {
    target: { value: 'SMI', checked: 'checked' },
    preventDefault
  };
  wrapper
    .find('input')
    .first()
    .prop('onChange')(mockedEvent);
  expect(onChange).toHaveBeenCalled();
});
