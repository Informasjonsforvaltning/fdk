import React from 'react';
import { shallow } from 'enzyme';
import FormSpatial from '../../../src/components/reg-form-schema-spatial/form';
import helptext from '../../fixtures/helptext';

let defaultProps, wrapper;

beforeEach(() => {
  const { helptextItems } = helptext;
  defaultProps = {
    helptextItems: helptextItems,
  };
  wrapper = shallow(<FormSpatial {...defaultProps} />);
});


test('should render FormSpatial correctly', () => {
  expect(wrapper).toMatchSnapshot();
});

