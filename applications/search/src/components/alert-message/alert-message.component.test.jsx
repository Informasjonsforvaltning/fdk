import React from 'react';
import { shallow } from 'enzyme';
import { AlertMessage } from './alert-message.component';

test('should render AlertMessage success correctly with props', () => {
  const wrapper = shallow(
    <AlertMessage type="success">Alert suksess</AlertMessage>
  );
  expect(wrapper).toMatchSnapshot();
});

test('should render AlertMessage danger correctly with props', () => {
  const wrapper = shallow(
    <AlertMessage type="danger">Alert advarsel</AlertMessage>
  );
  expect(wrapper).toMatchSnapshot();
});
