import React from 'react';
import { shallow } from 'enzyme';
import AppDeleteModal from './delete-modal.component';

let defaultProps;
let wrapper;
let toggle;
let handleAction;

beforeEach(() => {
  toggle = jest.fn();
  handleAction = jest.fn();
  defaultProps = {
    toggle,
    handleAction
  };
  wrapper = shallow(<AppDeleteModal {...defaultProps} />);
});

test('should render AppDeleteModal correctly', () => {
  expect(wrapper).toMatchSnapshot();
});
