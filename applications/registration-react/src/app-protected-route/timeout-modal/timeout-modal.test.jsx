import React from 'react';
import { shallow } from 'enzyme';
import TimeoutModal from './timeout-modal.component';

let defaultProps;
let wrapper;
let refreshSession;
let toggle;

beforeEach(() => {
  refreshSession = jest.fn();
  toggle = jest.fn();
  defaultProps = {
    modal: true,
    refreshSession,
    toggle,
    title: 'title',
    ingress: 'ingress',
    body: 'body',
    buttonConfirm: 'btnConfirm',
    buttonLogout: 'btnLogout'
  };
  wrapper = shallow(<TimeoutModal {...defaultProps} />);
});

test('should render TimeoutModal correctly', () => {
  expect(wrapper).toMatchSnapshot();
});
