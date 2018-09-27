import React from 'react';
import { shallow } from 'enzyme';
import { SearchHitItem } from './search-hit-item.component';
import datasetsResponse from '../../__fixtures/datasetsApiResponse.json';
import { normalizeAggregations } from '../../../../api/normalizeAggregations';

const datasetItems = normalizeAggregations(datasetsResponse);

const dataset = datasetItems.hits.hits[0];
let defaultProps;

test('should render SearchHitItem', () => {
  defaultProps = {
    result: dataset
  };
  const wrapper = shallow(<SearchHitItem {...defaultProps} />);
  expect(wrapper).toMatchSnapshot();
});
