import React from 'react';
import { shallow } from 'enzyme';
import { CatalogItem } from './catalog-item.component';

let defaultProps;
let wrapper;

beforeEach(() => {
  defaultProps = {
    publisherId: '123',
    type: 'datasets'
  };
  wrapper = shallow(<CatalogItem {...defaultProps} />);
});

test('should render CatalogItem correctly with missing itemsCount', () => {
  expect(wrapper).toMatchSnapshot();
});

test('should render CatalogItem correctly with itemsCount set to 10', () => {
  wrapper.setProps({
    itemsCount: 10
  });
  expect(wrapper).toMatchSnapshot();
});
