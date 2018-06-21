import React from 'react';
import { shallow } from 'enzyme';
import { AboutPage } from './about-page.component';

test('should render AboutPage correctly', () => {
  const wrapper = shallow(<AboutPage />);
  expect(wrapper).toMatchSnapshot();
});
