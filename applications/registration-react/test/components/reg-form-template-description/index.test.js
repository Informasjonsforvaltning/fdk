import React from 'react';
import { shallow } from 'enzyme';
import FormTemplateDescription from '../../../src/components/reg-form-template-description';

let defaultProps, wrapper, dispatch;

beforeEach(() => {
  dispatch = jest.fn();
  defaultProps = {
    values: null,
    title: null,
    syncErrors: false,
    children: null
  };
  wrapper = shallow(<FormTemplateDescription {...defaultProps} />);
});

test('should render FormTemplateDescription correctly', () => {
  expect(wrapper).toMatchSnapshot();
});
