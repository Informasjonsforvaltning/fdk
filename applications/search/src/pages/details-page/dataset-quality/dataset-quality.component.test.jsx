import React from 'react';
import { shallow } from 'enzyme';
import { DatasetQuality } from './dataset-quality.component';

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
