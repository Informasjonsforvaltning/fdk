import React from 'react';
import { mount, shallow } from 'enzyme';
import { ImportFileUpload } from './import-file-upload.component';
import { InputFile } from '../../../components/input-file/input-file.component';

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
  mount(<ImportFileUpload {...defaultProps} />)
    .find(InputFile)
    .prop('onChange')(mockedEvent);
  expect(handleFileUpload).toHaveBeenCalled();
});

test('should handle button cancel', () => {
  const mockedEvent = {
    preventDefault
  };
  wrapper.find('Button').prop('onClick')(mockedEvent);
  expect(handleCancelImport).toHaveBeenCalled();
});
