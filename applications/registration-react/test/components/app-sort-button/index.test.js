import React from 'react';
import { shallow } from 'enzyme';
import SortButtons from '../../../src/components/app-sort-button';

let defaultProps, wrapper, onSortField, preventDefault;

beforeEach(() => {
  onSortField = jest.fn();
  defaultProps = {
    field: 'sortField',
    sortField: 'sortField',
    sortType: 'asc',
    onSortField
  };
  wrapper = shallow(<SortButtons {...defaultProps} />);
});

test('should render SortButtons correctly', () => {
  expect(wrapper).toMatchSnapshot();
});

test('should handle onSortField asc', () => {
  const mockedEvent = {
    preventDefault
  };
  wrapper.find('button').first().prop('onClick')();
  expect(onSortField).toHaveBeenCalled();
});

test('should handle onSortField desc', () => {
  const mockedEvent = {
    preventDefault
  };
  wrapper.setProps({
    sortType: 'desc'
  });
  wrapper.find('button').at(1).prop('onClick')();
  expect(onSortField).toHaveBeenCalled();
});
