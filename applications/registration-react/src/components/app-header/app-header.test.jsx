import React from 'react';
import { shallow } from 'enzyme';
import { AppHeaderPure } from './app-header.component';

let defaultProps;
let wrapper;

beforeEach(() => {
  defaultProps = {
    location: { pathname: 'abc' },
    user: { name: 'john doe' }
  };
  wrapper = shallow(<AppHeaderPure {...defaultProps} />);
});

test('should render AppHeader correctly', () => {
  expect(wrapper).toMatchSnapshot();
});
