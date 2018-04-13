import React from 'react';
import { shallow } from 'enzyme';
import SearchBox from '../../../src/components/search-app-searchbox';

let onSearchSubmit, onSearchChange, preventDefault, open, defaultProps, wrapper;

beforeEach(() => {
  onSearchSubmit = jest.fn();
  onSearchChange = jest.fn();
  open = jest.fn();
  preventDefault = jest.fn();
  defaultProps = {
    onSearchSubmit: onSearchSubmit,
    onSearchChange: onSearchChange,
    searchQuery: 'enhetsregister',
    countDatasets: 100,
    isFetchingDatasets: false,
    countTerms: 10,
    isFetchingTerms: false,
    open: open
  };
});


test('should render SearchBox correctly', () => {
  const wrapper = shallow(<SearchBox {...defaultProps} />);
  expect(wrapper).toMatchSnapshot();
});

test('should call onSearchSubmit prop for valid form submission', () => {
  const mockedEvent = { target: { value: 'test value'}, preventDefault: preventDefault }
  const wrapper = shallow(<SearchBox {...defaultProps} />);
  wrapper.find('form').prop('onSubmit')(mockedEvent);
  expect(preventDefault).toHaveBeenCalled();
  expect(onSearchSubmit).toHaveBeenLastCalledWith(mockedEvent.target.value);
});

test('should call onSearchChange on change', () => {
  const mockedEvent = { target: { value: 'test value'}, preventDefault: preventDefault }
  const wrapper = shallow(<SearchBox {...defaultProps} />);
  wrapper.find('input').prop('onChange')(mockedEvent);
  expect(preventDefault).toHaveBeenCalled();
  expect(onSearchChange).toHaveBeenLastCalledWith(mockedEvent);
});

test('should call onSearchSubmit prop for valid form submission', () => {
  const mockedEvent = { target: { value: 'test value'}, preventDefault: preventDefault }
  const wrapper = shallow(<SearchBox {...defaultProps} />);
  wrapper.find('button.fdk-button-search').prop('onClick')(mockedEvent);
  expect(onSearchSubmit).toHaveBeenLastCalledWith(mockedEvent.target.value);
});

test('should call open when filter clicked', () => {
  const mockedEvent = { target: { value: 'test value'}, preventDefault: preventDefault }
  const wrapper = shallow(<SearchBox {...defaultProps} />);
  wrapper.find('button.fdk-button-filter').prop('onClick')();
  expect(open).toHaveBeenCalled();
});
