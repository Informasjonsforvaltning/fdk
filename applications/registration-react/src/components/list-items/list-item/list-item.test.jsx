import React from 'react';
import { shallow } from 'enzyme';
import { ListItem } from './list-item.component';

let defaultProps;
let wrapper;

beforeEach(() => {
  defaultProps = {
    catalogId: '123'
  };
  wrapper = shallow(<ListItem {...defaultProps} />);
});

test('should render ListItem correctly with no props', () => {
  expect(wrapper).toMatchSnapshot();
});

test('should render ListItem correctly "DRAFT" item', () => {
  wrapper.setProps({
    title: 'Test item',
    status: 'DRAFT',
    path: '/catalogs/123/datasets/1'
  });
  expect(wrapper).toMatchSnapshot();
});

test('should render ListItem correctly "PUBLISH" item', () => {
  wrapper.setProps({
    title: 'Test item',
    status: 'PUBLISH',
    path: '/catalogs/123/datasets/1'
  });
  expect(wrapper).toMatchSnapshot();
});

test('should render ListItem correctly when missing title', () => {
  wrapper.setProps({
    status: 'DRAFT',
    path: '/catalogs/123/datasets/1'
  });
  expect(wrapper).toMatchSnapshot();
});
