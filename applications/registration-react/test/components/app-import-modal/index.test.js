import React from 'react';
import { shallow } from 'enzyme';
import AppImportModal from '../../../src/components/app-import-modal';

let defaultProps, wrapper, handleAction, toggle;

beforeEach(() => {
  handleAction = jest.fn();
  toggle = jest.fn();
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
