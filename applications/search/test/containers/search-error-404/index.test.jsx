import React from 'react';
import { shallow } from 'enzyme';
import Error404 from '../../../src/containers/search-error-404';

test('should render Error404 correctly', () => {
  const wrapper = shallow(<Error404 />);
  expect(wrapper).toMatchSnapshot();
});
