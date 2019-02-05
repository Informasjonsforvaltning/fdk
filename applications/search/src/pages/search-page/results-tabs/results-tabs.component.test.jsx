import React from 'react';
import { shallow } from 'enzyme';
import { ResultsTabsPure } from './results-tabs.component';
import {
  PATHNAME_DATASETS,
  PATHNAME_CONCEPTS
} from '../../../constants/constants';
import defaultProps from './__fixtures/defaultProps.json';

let wrapper;

beforeEach(() => {
  wrapper = shallow(<ResultsTabsPure {...defaultProps} />);
});

test('should render ResultsTabs with "Dataset" active correctly', () => {
  wrapper.setProps({
    location: { pathname: PATHNAME_DATASETS, search: '' }
  });
  expect(wrapper).toMatchSnapshot();
});

test('should render ResultsTabs with "Concepts" active correctly', () => {
  wrapper.setProps({
    location: { pathname: PATHNAME_CONCEPTS, search: '' }
  });
  expect(wrapper).toMatchSnapshot();
});
