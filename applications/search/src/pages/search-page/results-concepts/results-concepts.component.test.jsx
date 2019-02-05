import React from 'react';
import { shallow } from 'enzyme';
import _ from 'lodash';
import { ResultsConceptsPure } from './results-concepts.component';
import concepts from '../../../../test/fixtures/concepts';
import { normalizeAggregations } from '../../../lib/normalizeAggregations';

test('should render ResultsConcepts correctly with minimum of props', () => {
  const result = shallow(<ResultsConceptsPure />);
  expect(result).toMatchSnapshot();
});

test('should render ResultsConcepts correctly with hits', () => {
  const props = {
    conceptItems: _.get(concepts, ['hits', 'hits']),
    conceptAggregations: _.get(normalizeAggregations(concepts), 'aggregations'),
    conceptTotal: _.get(concepts, ['hits', 'total'])
  };

  const result = shallow(<ResultsConceptsPure {...props} />);
  expect(result).toMatchSnapshot();
});
