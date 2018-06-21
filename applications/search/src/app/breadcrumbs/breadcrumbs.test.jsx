import React from 'react';
import { shallow } from 'enzyme';
import { Breadcrumbs } from './breadcrumbs.component';

test('should render Breadcrumbs correctly', () => {
  const wrapper = shallow(<Breadcrumbs />);
  expect(wrapper).toMatchSnapshot();
});
