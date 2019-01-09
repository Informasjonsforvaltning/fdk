import React from 'react';
import { shallow } from 'enzyme';
import { SearchHitItem } from './search-hit-item.component';
import informationModelItem from './__fixtures/informationModelResponse.json';

let defaultProps;

test('should render api-SearchHitItem correctly with no props', () => {
  const wrapper = shallow(<SearchHitItem />);
  expect(wrapper).toMatchSnapshot();
});

test('should render informatiomModel-SearchHitItem correctly', () => {
  defaultProps = {
    item: informationModelItem
  };
  const wrapper = shallow(<SearchHitItem {...defaultProps} />);
  expect(wrapper).toMatchSnapshot();
});
