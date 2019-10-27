import React from 'react';
import { shallow } from 'enzyme';
import { LoginPagePure } from './login-page';

let defaultProps;
let wrapper;
let dispatch;

beforeEach(() => {
  dispatch = jest.fn();
  defaultProps = {
    dispatch,
    loggedOut: true
  };
  wrapper = shallow(<LoginPagePure {...defaultProps} />);
});

test('should render LoginPage correctly', () => {
  expect(wrapper).toMatchSnapshot();
});
