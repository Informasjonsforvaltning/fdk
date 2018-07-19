import React from 'react';
import { shallow } from 'enzyme';
import { App } from './app';

test('should render App correctly', () => {
  const wrapper = shallow(<App language="nb" />);
  expect(wrapper).toMatchSnapshot();
});
