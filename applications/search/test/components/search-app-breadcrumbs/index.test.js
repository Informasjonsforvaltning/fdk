import React from 'react';
import { shallow } from 'enzyme';
import { Breadcrumbs } from '../../../src/components/search-app-breadcrumbs';

test('should render Breadcrumbs correctly', () => {
  const wrapper = shallow(<Breadcrumbs />);
  expect(wrapper).toMatchSnapshot();
});
