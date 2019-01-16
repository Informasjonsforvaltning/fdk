import React from 'react';
import { shallow } from 'enzyme';
import { Tabs } from './tabs.component';

test('should render Tabs correctly with no props', () => {
  const minWrapper = shallow(<Tabs />);
  expect(minWrapper).toMatchSnapshot();
});

test('should render Tabs correctly', () => {
  const defaultProps = {
    tabContent: [
      { title: 'Tab content 1', data: 'Data tab content 1' },
      { title: 'Tab content 2', data: 'Data tab content 2' }
    ]
  };
  const wrapper = shallow(<Tabs {...defaultProps} />);
  expect(wrapper).toMatchSnapshot();
});
