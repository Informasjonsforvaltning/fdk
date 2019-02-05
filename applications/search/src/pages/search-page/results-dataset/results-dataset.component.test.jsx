import React from 'react';
import { shallow } from 'enzyme';
import _ from 'lodash';
import { ResultsDatasetPure } from './results-dataset.component';
import datasetsResponse from '../__fixtures/datasetsApiResponse.json';
import { normalizeAggregations } from '../../../lib/normalizeAggregations';

test('should render ResultsDataset correctly with minimum of props', () => {
  const result = shallow(<ResultsDatasetPure />);
  expect(result).toMatchSnapshot();
});

test('should render ResultsDataset correctly with hits', () => {
  const props = {
    datasetItems: _.get(datasetsResponse, ['hits', 'hits']),
    datasetAggregations: _.get(normalizeAggregations(datasetsResponse), [
      'aggregations'
    ]),
    datasetTotal: _.get(datasetsResponse, ['hits', 'total'])
  };
  const result = shallow(<ResultsDatasetPure {...props} />);
  expect(result).toMatchSnapshot();
});
