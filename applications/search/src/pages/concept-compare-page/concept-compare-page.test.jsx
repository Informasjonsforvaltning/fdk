import React from 'react';
import _ from 'lodash';
import { shallow } from 'enzyme';

import { normalizeAggregations } from '../../api/normalizeAggregations';
import { ConceptComparePage } from './concept-compare-page';
import concepts from './__fixtures/conceptsApiResponse.json';

const conceptItems = normalizeAggregations(concepts);

test('should render ConceptComparePage correctly with no apiItem', () => {
  const wrapper = shallow(<ConceptComparePage />);
  expect(wrapper).toMatchSnapshot();
});

test('should render ConceptComparePage correctly with conceptItem', () => {
  const wrapper = shallow(
    <ConceptComparePage
      conceptsCompare={_.get(conceptItems, ['_embedded', 'concepts'])}
    />
  );
  expect(wrapper).toMatchSnapshot();
});
