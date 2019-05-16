import React from 'react';
import { shallow } from 'enzyme';
import { LoginDialogPure } from './app-login-dialog.component';

let defaultProps;
let wrapper;
let dispatch;

beforeEach(() => {
  dispatch = jest.fn();
  defaultProps = {
    dispatch,
    loggedOut: true
  };
  wrapper = shallow(<LoginDialogPure {...defaultProps} />);
});

test('should render LoginDialog correctly', () => {
  expect(wrapper).toMatchSnapshot();
});
