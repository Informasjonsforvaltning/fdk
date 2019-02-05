import React from 'react';
import { shallow } from 'enzyme';
import _ from 'lodash';
import { ResultsApiPure } from './results-api.component';
import apisApiResponse from '../../../mock/apis.response.json';

test('should render ResultsApi correctly with minimum of props and no hits', () => {
  const result = shallow(<ResultsApiPure />);
  expect(result).toMatchSnapshot();
});

test('should render ResultsApi correctly with hits', () => {
  const props = {
    apiItems: _.get(apisApiResponse, 'hits'),
    apiAggregations: _.get(apisApiResponse, 'aggregations'),
    apiTotal: _.get(apisApiResponse, 'total')
  };
  const result = shallow(<ResultsApiPure {...props} />);
  expect(result).toMatchSnapshot();
});
