import React from 'react';
import { shallow } from 'enzyme';
import { ListItems } from './list-items.component';

let defaultProps;
let wrapper;

beforeEach(() => {
  const items = {
    items: [
      {
        id: 1,
        title: {
          nb: 'Test item'
        },
        registrationStatus: 'DRAFT'
      },
      {
        id: 2,
        title: {
          nb: 'Test item'
        },
        registrationStatus: 'PUBLISH'
      }
    ]
  };
  const onSort = jest.fn();
  defaultProps = {
    catalogId: '123',
    items: items.items,
    sortField: 'title',
    sortType: 'asc',
    onSortField: onSort
  };
  wrapper = shallow(<ListItems {...defaultProps} />);
});

test('should render ListItem correctly with props', () => {
  expect(wrapper).toMatchSnapshot();
});
