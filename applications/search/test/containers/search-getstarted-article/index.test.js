import React from 'react';
import { shallow } from 'enzyme';
import Article from '../../../src/containers/search-getstarted-article';

test('should render Article correctly', () => {
  const wrapper = shallow(<Article />);
  expect(wrapper).toMatchSnapshot();
});
