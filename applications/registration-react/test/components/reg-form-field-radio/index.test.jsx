import React from 'react';
import { shallow } from 'enzyme';
import RadioField from '../../../src/components/reg-form-field-radio';

test('should render RadioField correctly', () => {
  const wrapper = shallow(<RadioField />);
  expect(wrapper).toMatchSnapshot();
});
