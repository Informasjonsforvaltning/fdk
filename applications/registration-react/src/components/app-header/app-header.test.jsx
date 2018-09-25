import React from 'react';
import { shallow } from 'enzyme';
import { Header } from './app-header.component';

let defaultProps;
let wrapper;
let dispatch;

beforeEach(() => {
  dispatch = jest.fn();
  defaultProps = {
    dispatch
  };
  wrapper = shallow(<Header {...defaultProps} />);
});

test('should render Header correctly', () => {
  expect(wrapper).toMatchSnapshot();
});
