import React from 'react';
import { shallow } from 'enzyme';
import AppDeleteModal from '../../../src/components/app-delete-modal';

test('should render AppDeleteModal correctly', () => {
  const wrapper = shallow(<AppDeleteModal />);
  expect(wrapper).toMatchSnapshot();
});
