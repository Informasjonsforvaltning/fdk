import React from 'react';
import { shallow } from 'enzyme';
import { ReportsPage } from './reports-page.container';

test('should render ReportsPage correctly', () => {
  const wrapper = shallow(<ReportsPage />);
  expect(wrapper).toMatchSnapshot();
});
