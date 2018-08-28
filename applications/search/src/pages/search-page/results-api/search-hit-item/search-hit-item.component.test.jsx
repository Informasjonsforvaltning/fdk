import React from 'react';
import { shallow } from 'enzyme';
import { SearchHitItem } from './search-hit-item.component';
import apiItemComplete from './__fixtures/apiItemCompleteApiResponse.json';
import { apiItemLongDescription } from './__fixtures/apiItemLongDescription';

let defaultProps;

test('should render api-SearchHitItem correctly with no props', () => {
  const wrapper = shallow(<SearchHitItem />);
  expect(wrapper).toMatchSnapshot();
});

test('should render api-SearchHitItem correctly', () => {
  defaultProps = {
    item: apiItemComplete
  };
  const wrapper = shallow(<SearchHitItem {...defaultProps} />);
  expect(wrapper).toMatchSnapshot();
});

test('should render api-SearchHitItem with long description', () => {
  const wrapper = shallow(<SearchHitItem item={apiItemLongDescription} />);
  expect(wrapper).toMatchSnapshot();
});
