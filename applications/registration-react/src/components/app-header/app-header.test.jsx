import React from 'react';
import { shallow } from 'enzyme';
import { AppHeaderPure } from './app-header.component';

let defaultProps;
let wrapper;
let dispatch;

beforeEach(() => {
  dispatch = jest.fn();
  defaultProps = {
    dispatch,
    location: { pathname: 'abc' }
  };
  wrapper = shallow(<AppHeaderPure {...defaultProps} />);
});

test('should render AppHeader correctly', () => {
  expect(wrapper).toMatchSnapshot();
});
