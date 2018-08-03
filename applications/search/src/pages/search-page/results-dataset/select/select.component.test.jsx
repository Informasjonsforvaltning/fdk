import React from 'react';
import { shallow } from 'enzyme';
import { Select } from './select.component';

let onChange;
let items;

beforeEach(() => {
  onChange = jest.fn();
  items = [
    {
      label: 'relevance',
      field: '_score',
      order: 'asc',
      defaultOption: true
    },
    {
      label: 'title',
      field: 'title',
      order: 'asc'
    },
    {
      label: 'modified',
      field: 'modified',
      order: 'desc'
    },
    {
      label: 'publisher',
      field: 'publisher.name',
      order: 'asc'
    }
  ];
});

test('should render Select correctly with no active sort', () => {
  const wrapper = shallow(<Select onChange={onChange} items={items} />);
  expect(wrapper).toMatchSnapshot();
});

test('should render Select correctly with active sort', () => {
  const wrapper = shallow(
    <Select onChange={onChange} items={items} activeSort="title.nb" />
  );
  expect(wrapper).toMatchSnapshot();
});

test('should handle onChange', () => {
  const wrapper = shallow(<Select onChange={onChange} items={items} />);
  wrapper
    .find('DropdownItem')
    .first()
    .prop('onClick')(items[0]);
  expect(onChange).toHaveBeenLastCalledWith(items[0]);
});
