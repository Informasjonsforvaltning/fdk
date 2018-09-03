import React from 'react';
import { shallow } from 'enzyme';
import { FilterBox } from './filter-box.component';
import { themeAggregation } from './__fixtures/themeAggregation';
import { themeItems } from './__fixtures/themeItems';

let onClick;
let defaultProps;
let wrapper;

beforeEach(() => {
  onClick = jest.fn();
  defaultProps = {
    title: 'Testbox',
    filter: themeAggregation,
    onClick,
    activeFilter: null,
    themesItems: themeItems
  };
  wrapper = shallow(<FilterBox {...defaultProps} />);
});

test('should render FilterBox correctly', () => {
  expect(wrapper).toMatchSnapshot();
});

test('should render FilterBox correctly with activeFilter', () => {
  wrapper.setProps({
    activeFilter: 'GOVE'
  });
  expect(wrapper).toMatchSnapshot();
});

test('should render FilterBox correctly with empty filter', () => {
  wrapper.setProps({
    filter: {}
  });
  expect(wrapper).toMatchSnapshot();
});

test('should handle toggleFilter', () => {
  wrapper.find('button.fdk-toggleFilter').simulate('click');
  expect(wrapper.state('openFilter')).toBe(false);
});

test('should handle toggleList', () => {
  wrapper.find('button.fdk-toggleList').simulate('click');
  expect(wrapper.state('open')).toBe(true);
});
