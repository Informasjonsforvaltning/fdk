import React from 'react';
import { shallow } from 'enzyme';
import { ImportFileUpload } from './import-file-upload.component';

let defaultProps;
let wrapper;
let preventDefault;
let handleFileUpload;
let handleCancelImport;

beforeEach(() => {
  handleFileUpload = jest.fn();
  handleCancelImport = jest.fn();
  preventDefault = jest.fn();
  defaultProps = {
    fileName: 'Api.json',
    handleFileUpload,
    handleCancelImport
  };
  wrapper = shallow(<ImportFileUpload {...defaultProps} />);
});

test('should render ImportFileUpload correctly', () => {
  expect(wrapper).toMatchSnapshot();
});

test('should handle input file upload', () => {
  const mockedEvent = {
    preventDefault
  };
  wrapper.find('InputFile').prop('onChange')(mockedEvent);
  expect(handleFileUpload).toHaveBeenCalled();
});

test('should handle button cancel', () => {
  const mockedEvent = {
    preventDefault
  };
  wrapper.find('Button').prop('onClick')(mockedEvent);
  expect(handleCancelImport).toHaveBeenCalled();
});
