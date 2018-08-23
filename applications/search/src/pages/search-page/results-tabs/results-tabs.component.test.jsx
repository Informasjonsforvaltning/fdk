import React from 'react';
import { shallow } from 'enzyme';
import { ResultsTabs } from './results-tabs.component';
import {
  PATHNAME_DATASETS,
  PATHNAME_CONCEPTS
} from '../../../constants/constants';

test('should render ResultsTabs with "Dataset" active correctly', () => {
  const wrapper = shallow(<ResultsTabs activePath={PATHNAME_DATASETS} />);
  expect(wrapper).toMatchSnapshot();
});

test('should render ResultsTabs with "Concepts" active correctly', () => {
  const wrapper = shallow(<ResultsTabs activePath={PATHNAME_CONCEPTS} />);
  expect(wrapper).toMatchSnapshot();
});
