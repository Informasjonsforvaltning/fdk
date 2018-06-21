import React from 'react';
import { shallow } from 'enzyme';
import { Error404 } from './error404.component';

test('should render Error404 correctly', () => {
  const wrapper = shallow(<Error404 />);
  expect(wrapper).toMatchSnapshot();
});
