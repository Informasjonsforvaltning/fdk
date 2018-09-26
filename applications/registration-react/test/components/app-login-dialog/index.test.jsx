import React from 'react';
import { shallow } from 'enzyme';
import { LoginDialog } from '../../../src/components/app-login-dialog';

let defaultProps;
let wrapper;
let dispatch;

beforeEach(() => {
  dispatch = jest.fn();
  defaultProps = {
    dispatch,
    loggedOut: true
  };
  wrapper = shallow(<LoginDialog {...defaultProps} />);
});

test('should render LoginDialog correctly', () => {
  expect(wrapper).toMatchSnapshot();
});
