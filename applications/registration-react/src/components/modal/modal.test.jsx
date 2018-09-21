import React from 'react';
import { shallow } from 'enzyme';
import AppModal from './modal.component';

let defaultProps;
let wrapper;
let toggle;

beforeEach(() => {
  toggle = jest.fn();
  defaultProps = {
    modal: true,
    toggle,
    className: null,
    title: 'App-modal',
    body: 'App-modal body'
  };
  wrapper = shallow(<AppModal {...defaultProps} />);
});

test('should render AppModal correctly', () => {
  expect(wrapper).toMatchSnapshot();
});
