import React from 'react';
import { shallow } from 'enzyme';
import { ResultsTabs } from './results-tabs.component';
import {
  PATHNAME_DATASETS,
  PATHNAME_CONCEPTS
} from '../../../constants/constants';
import defaultProps from './__fixtures/defaultProps.json';

let wrapper;

beforeEach(() => {
  wrapper = shallow(<ResultsTabs {...defaultProps} />);
});

test('should render ResultsTabs with "Dataset" active correctly', () => {
  wrapper.setProps({
    activePath: PATHNAME_DATASETS
  });
  expect(wrapper).toMatchSnapshot();
});

test('should render ResultsTabs with "Concepts" active correctly', () => {
  wrapper.setProps({
    activePath: PATHNAME_CONCEPTS
  });
  expect(wrapper).toMatchSnapshot();
});
