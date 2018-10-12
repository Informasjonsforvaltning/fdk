import React from 'react';
import { shallow } from 'enzyme';
import { PanelBase } from './panel-base.component';

test('should render PanelBase success correctly with props', () => {
  const wrapper = shallow(<PanelBase type="success">Panel base</PanelBase>);
  expect(wrapper).toMatchSnapshot();
});
