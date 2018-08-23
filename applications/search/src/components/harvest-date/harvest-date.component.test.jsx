import React from 'react';
import { shallow } from 'enzyme';
import { HarvestDate } from './harvest-date.component';
import { harvest } from './__fixtures/harvest';

test('should render HarvestDate with no props', () => {
  const wrapper = shallow(<HarvestDate />);
  expect(wrapper).toMatchSnapshot();
});

test('should render HarvestDate with harvest dates', () => {
  const wrapper = shallow(<HarvestDate harvest={harvest} />);
  expect(wrapper).toMatchSnapshot();
});
