import React from 'react';
import { shallow } from 'enzyme';
import SortButtons from './sort-button.component';

let defaultProps;
let wrapper;
let onSortField;

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
  wrapper
    .find('button')
    .first()
    .prop('onClick')();
  expect(onSortField).toHaveBeenCalled();
});

test('should handle onSortField desc', () => {
  wrapper.setProps({
    sortType: 'desc'
  });
  wrapper
    .find('button')
    .at(1)
    .prop('onClick')();
  expect(onSortField).toHaveBeenCalled();
});
