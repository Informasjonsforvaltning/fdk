import React from 'react';
import { shallow } from 'enzyme';
import _ from 'lodash';
import { ResultsInformationModelPure } from './results-informationmodel.component';
import informationModelApiResponse from '../__fixtures/informationmodelsApiResponse.json';

test('should render ResultsInformationModel correctly with minimum of props and no hits', () => {
  const result = shallow(<ResultsInformationModelPure />);
  expect(result).toMatchSnapshot();
});

test('should render ResultsInformationModel correctly with hits', () => {
  const props = {
    informationModelItems: _.get(informationModelApiResponse, 'hits'),
    informationModelAggregations: _.get(
      informationModelApiResponse,
      'aggregations'
    ),
    informationModelTotal: _.get(informationModelApiResponse, 'total')
  };
  const result = shallow(<ResultsInformationModelPure {...props} />);
  expect(result).toMatchSnapshot();
});
