import React from 'react';
import { shallow } from 'enzyme';
import AppImportModal from './import-modal.component';

let defaultProps;
let wrapper;
let handleAction;
let toggle;
let preventDefault;

beforeEach(() => {
  handleAction = jest.fn();
  toggle = jest.fn();
  preventDefault = jest.fn();
  defaultProps = {
    handleAction,
    toggle,
    modal: true,
    className: null,
    title: 'Tittel',
    body: 'body',
    setURL: 'http://www.google.no',
    btnConfirm: 'btnConfirm',
    btnCancel: 'btnCancel'
  };
  wrapper = shallow(<AppImportModal {...defaultProps} />);
});

test('should render AppImportModal correctly', () => {
  expect(wrapper).toMatchSnapshot();
});

test('should handle handleAction', () => {
  const mockedEvent = {
    preventDefault
  };
  wrapper.setState({
    url: 'url'
  });
  wrapper
    .find('Button')
    .first()
    .prop('onClick')(mockedEvent);
  expect(handleAction).toHaveBeenCalled();
});

test('should handle handleAction', () => {
  const mockedEvent = {
    preventDefault
  };
  wrapper
    .find('Button')
    .first()
    .prop('onClick')(mockedEvent);
  expect(handleAction).not.toHaveBeenCalled();
});

test('should handle onBtnCancel', () => {
  const mockedEvent = {
    preventDefault
  };
  wrapper
    .find('Button')
    .at(1)
    .prop('onClick')(mockedEvent);
  expect(toggle).toHaveBeenCalled();
});
