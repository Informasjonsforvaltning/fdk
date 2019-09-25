import React from 'react';
import { shallow } from 'enzyme';
import RadioField from './field-radio.component';

test('should render RadioField correctly', () => {
  const wrapper = shallow(<RadioField />);
  expect(wrapper).toMatchSnapshot();
});
