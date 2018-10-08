import React from 'react';
import { shallow } from 'enzyme';
import { ImportDialog } from './import-dialog.component';

let defaultProps;
let wrapper;
let preventDefault;
let showLinkImport;
let handleFileUpload;

beforeEach(() => {
  showLinkImport = jest.fn();
  handleFileUpload = jest.fn();
  preventDefault = jest.fn();
  defaultProps = {
    showLinkImport,
    handleFileUpload
  };
  wrapper = shallow(<ImportDialog {...defaultProps} />);
});

test('should render ImportDialog correctly', () => {
  expect(wrapper).toMatchSnapshot();
});

test('should handle button show link upload', () => {
  const mockedEvent = {
    preventDefault
  };
  wrapper.find('Button').prop('onClick')(mockedEvent);
  expect(showLinkImport).toHaveBeenCalled();
});

test('should handle input file upload', () => {
  const mockedEvent = {
    preventDefault
  };
  wrapper.find('InputFile').prop('onChange')(mockedEvent);
  expect(handleFileUpload).toHaveBeenCalled();
});
