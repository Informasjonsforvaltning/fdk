import React from 'react';
import { shallow } from 'enzyme';
import { ImportLinkUploadPure } from './import-link-upload.component';

let defaultProps;
let wrapper;
let preventDefault;
let handleChangeUrl;
let handleLinkUpload;
let handleCancelImport;

beforeEach(() => {
  handleChangeUrl = jest.fn();
  handleLinkUpload = jest.fn();
  handleCancelImport = jest.fn();
  preventDefault = jest.fn();
  defaultProps = {
    importByLinkError: false,
    handleChangeUrl,
    handleLinkUpload,
    handleCancelImport,
    touched: false,
    error: null
  };
  wrapper = shallow(<ImportLinkUploadPure {...defaultProps} />);
});

test('should render ImportLinkUploadPure correctly', () => {
  expect(wrapper).toMatchSnapshot();
});

test('should handle import link', () => {
  const mockedEvent = {
    preventDefault
  };
  wrapper.find('[testid="button-upload"]').prop('onClick')(mockedEvent);
  expect(handleLinkUpload).toHaveBeenCalled();
});

test('should handle button cancel', () => {
  const mockedEvent = {
    preventDefault
  };
  wrapper.find('[testid="button-cancel"]').prop('onClick')(mockedEvent);
  expect(handleCancelImport).toHaveBeenCalled();
});
