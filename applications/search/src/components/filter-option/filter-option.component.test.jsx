import React from 'react';
import { shallow } from 'enzyme';
import { FilterOption } from './filter-option.component';
import filterOptions from '../../../test/fixtures/filterOptions';

test('should render FilterOption correctly', () => {
  const onClick = jest.fn();
  const wrapper = shallow(
    <FilterOption
      itemKey={filterOptions[0].itemKey}
      value={filterOptions[0].value}
      label={filterOptions[0].label}
      count={filterOptions[0].count}
      onClick={onClick}
      active={filterOptions[0].active}
      themesItems={filterOptions[0].themesItems}
      displayClass={filterOptions[0].displayClass}
    />
  );
  expect(wrapper).toMatchSnapshot();
});

test('should render FilterOption correctly with no corresponding theme', () => {
  const onClick = jest.fn();
  const wrapper = shallow(
    <FilterOption
      itemKey={filterOptions[1].itemKey}
      value={filterOptions[1].value}
      label={filterOptions[1].label}
      count={filterOptions[1].count}
      onClick={onClick}
      active={filterOptions[1].active}
      themesItems={filterOptions[1].themesItems}
      displayClass={filterOptions[1].displayClass}
    />
  );
  expect(wrapper).toMatchSnapshot();
});

test('should render FilterOption correctly with no theme', () => {
  const onClick = jest.fn();
  const wrapper = shallow(
    <FilterOption
      itemKey={filterOptions[2].itemKey}
      value={filterOptions[2].value}
      label={filterOptions[2].label}
      count={filterOptions[2].count}
      onClick={onClick}
      active={filterOptions[2].active}
      themesItems={filterOptions[2].themesItems}
      displayClass={filterOptions[2].displayClass}
    />
  );
  expect(wrapper).toMatchSnapshot();
});

test('should handle onChange', () => {
  const onClick = jest.fn();
  const wrapper = shallow(
    <FilterOption
      itemKey={filterOptions[2].itemKey}
      value={filterOptions[2].value}
      label={filterOptions[2].label}
      count={filterOptions[2].count}
      onClick={onClick}
      active={filterOptions[2].active}
      themesItems={filterOptions[2].themesItems}
      displayClass={filterOptions[2].displayClass}
    />
  );
  wrapper.find('input.list-group-item').prop('onChange')(filterOptions[1]);
  expect(onClick).toHaveBeenLastCalledWith(filterOptions[1]);
});
