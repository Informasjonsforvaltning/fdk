import React from 'react';
import { shallow } from 'enzyme';
import SearchPublishersTree from '../../../src/components/search-results-filterbox-publishers';
import publishers from '../../fixtures/publishers';
import filter from '../../fixtures/filter';

let onFilterPublisherHierarchy;
let onSearch;
let defaultProps;
let wrapper;

beforeEach(() => {
  onFilterPublisherHierarchy = jest.fn();
  onSearch = jest.fn();

  defaultProps = {
    title: 'title',
    filter,
    onFilterPublisherHierarchy,
    activeFilter: null,
    publishers,
    onSearch,
    orgPath: '/STAT/872417842/960885406' // publishers[1].orgPath
  };
  wrapper = shallow(<SearchPublishersTree {...defaultProps} />);
});

test('should render SearchPublishersTree correctly with minimum of props', () => {
  const minWrapper = shallow(
    <SearchPublishersTree
      onFilterPublisherHierarchy={onFilterPublisherHierarchy}
    />
  );
  expect(minWrapper).toMatchSnapshot();
});

test('should render SearchPublishersTree correctly with props', () => {
  expect(wrapper).toMatchSnapshot();
});

test('should render SearchPublishersTree correctly with active filter', () => {
  wrapper.setProps({
    activeFilter: '/STAT'
  });
  expect(wrapper).toMatchSnapshot();
});

test('should render SearchPublishersTree correctly with active sub filter', () => {
  wrapper.setProps({
    activeFilter: '/KOMMUNE/958935420/974770482'
  });
  expect(wrapper).toMatchSnapshot();
});

test('should handle toggleFilter', () => {
  wrapper.find('button.fdk-publisher-toggle').simulate('click');
  expect(wrapper.state('openFilter')).toBe(false);
});
