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
  const draftItem = {
    id: 1,
    title: {
      nb: 'Test item'
    },
    registrationStatus: 'DRAFT'
  };
  wrapper.setProps({
    item: draftItem
  });
  expect(wrapper).toMatchSnapshot();
});

test('should render ListItem correctly "PUBLISH" item', () => {
  const publishItem = {
    id: 1,
    title: {
      nb: 'Test item'
    },
    registrationStatus: 'PUBLISH'
  };
  wrapper.setProps({
    item: publishItem
  });
  expect(wrapper).toMatchSnapshot();
});

test('should render ListItem correctly when missing title', () => {
  const missingTitleItem = {
    id: 1,
    registrationStatus: 'DRAFT'
  };
  wrapper.setProps({
    item: missingTitleItem
  });
  expect(wrapper).toMatchSnapshot();
});
