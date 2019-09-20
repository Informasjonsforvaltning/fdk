import React from 'react';
import { shallow } from 'enzyme';
import { ResultsConceptsPure } from './results-concepts.component';
import concepts from '../../../mock/concepts.response';
import {
  extractAggregations,
  extractConcepts,
  extractTotal
} from '../../../api/concepts';

test('should render ResultsConcepts correctly with minimum of props', () => {
  const result = shallow(<ResultsConceptsPure />);
  expect(result).toMatchSnapshot();
});

test('should render ResultsConcepts correctly with hits', () => {
  const props = {
    conceptItems: extractConcepts(concepts),
    conceptAggregations: extractAggregations(concepts),
    conceptTotal: extractTotal(concepts)
  };

  const result = shallow(<ResultsConceptsPure {...props} />);
  expect(result).toMatchSnapshot();
});
