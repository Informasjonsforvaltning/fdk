import React from 'react';
import { shallow } from 'enzyme';
import FormContactPoint from '../../../src/components/reg-form-schema-contactPoint/form';
import helptext from '../../fixtures/helptext';

let defaultProps, wrapper;

beforeEach(() => {
  const { helptextItems } = helptext;
  defaultProps = {
    helptextItems: helptextItems,
  };
  wrapper = shallow(<FormContactPoint {...defaultProps} />);
});


test('should render FormContactPoint correctly', () => {
  expect(wrapper).toMatchSnapshot();
});


