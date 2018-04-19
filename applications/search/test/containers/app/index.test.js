import React from 'react';
import { shallow } from 'enzyme';
import App from '../../../src/containers/app';

let onSearchSubmit, onSearchChange, preventDefault, open, defaultProps, wrapper;

beforeEach(() => {

  defaultProps = {

  };
});
test('should render App correctly', () => {
  const wrapper = shallow(<App />);
  expect(wrapper).toMatchSnapshot();
});
