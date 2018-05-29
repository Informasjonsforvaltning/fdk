import React from 'react';
import { shallow } from 'enzyme';
import DatasetQuality from '../../../src/components/search-dataset-quality-content';

let defaultProps;
let wrapper;

beforeEach(() => {
  defaultProps = {
    relevanceAnnotation: 'relevance',
    completenessAnnotation: 'comleteness',
    accuracyAnnotation: 'accuracy',
    availabilityAnnotations: 'availability'
  };
  wrapper = shallow(<DatasetQuality {...defaultProps} />);
});

test('should render DatasetQuality correctly', () => {
  expect(wrapper).toMatchSnapshot();
});
