import React from 'react';
import { shallow } from 'enzyme';
import { SearchHitItem } from './search-hit-item.component';
import datasetsResponse from '../../__fixtures/datasetsApiResponse.json';
import { extractDatasets } from '../../../../api/datasets';

const dataset = extractDatasets(datasetsResponse)[0];
let defaultProps;

test('should render SearchHitItem', () => {
  defaultProps = { dataset };
  const wrapper = shallow(<SearchHitItem {...defaultProps} />);
  expect(wrapper).toMatchSnapshot();
});
