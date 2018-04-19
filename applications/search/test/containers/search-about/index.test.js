import React from 'react';
import { shallow } from 'enzyme';
import About from '../../../src/containers/search-about';

test('should render About correctly', () => {
  const wrapper = shallow(<About />);
  expect(wrapper).toMatchSnapshot();
});
