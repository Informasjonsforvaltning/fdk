import React from 'react';
import { shallow } from 'enzyme';
import { HeaderPure } from './app-header.component';

let defaultProps;
let wrapper;
let dispatch;

beforeEach(() => {
  dispatch = jest.fn();
  defaultProps = {
    dispatch,
    location: { pathname: 'abc' }
  };
  wrapper = shallow(<HeaderPure {...defaultProps} />);
});

test('should render Header correctly', () => {
  expect(wrapper).toMatchSnapshot();
});
