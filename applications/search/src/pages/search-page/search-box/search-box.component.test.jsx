import React from 'react';
import { shallow } from 'enzyme';
import { SearchBoxPure } from './search-box.component';

let onSearchSubmit;
let setInputText;
let preventDefault;
let open;
let defaultProps;

beforeEach(() => {
  onSearchSubmit = jest.fn();
  setInputText = jest.fn();
  open = jest.fn();
  preventDefault = jest.fn();
  defaultProps = {
    onSearchSubmit,
    setInputText,
    inputText: 'queryToSubmit',
    searchText: 'enhetsregister',
    countDatasets: 100,
    countTerms: 10,
    open
  };
});

test('should render SearchBoxPure correctly', () => {
  const wrapper = shallow(<SearchBoxPure {...defaultProps} />);
  expect(wrapper).toMatchSnapshot();
});

test('should call onSearchSubmit prop for valid form submission', () => {
  const mockedEvent = {
    target: { value: 'test value' },
    preventDefault
  };
  const wrapper = shallow(<SearchBoxPure {...defaultProps} />);
  wrapper.find('form').prop('onSubmit')(mockedEvent);
  expect(preventDefault).toHaveBeenCalled();
  expect(onSearchSubmit).toHaveBeenLastCalledWith('queryToSubmit');
});

test('should call setInputText on change', () => {
  const mockedEvent = {
    target: { value: 'test value' },
    preventDefault
  };
  const wrapper = shallow(<SearchBoxPure {...defaultProps} />);
  wrapper.find('input').prop('onChange')(mockedEvent);
  expect(setInputText).toHaveBeenLastCalledWith(mockedEvent);
});

test('should call onSearchSubmit prop for valid form submission', () => {
  const mockedEvent = {
    target: { value: 'test value' },
    preventDefault
  };
  const wrapper = shallow(<SearchBoxPure {...defaultProps} />);
  wrapper.find('button.fdk-button-search').prop('onClick')(mockedEvent);
  expect(onSearchSubmit).toHaveBeenLastCalledWith('queryToSubmit');
});

test('should call open when filter clicked', () => {
  const wrapper = shallow(<SearchBoxPure {...defaultProps} />);
  wrapper.find('button.fdk-button-filter').prop('onClick')();
  expect(open).toHaveBeenCalled();
});
