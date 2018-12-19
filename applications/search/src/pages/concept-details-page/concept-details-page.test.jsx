import React from 'react';
import _ from 'lodash';
import { shallow } from 'enzyme';

import { normalizeAggregations } from '../../lib/normalizeAggregations';
import { ConceptDetailsPage } from './concept-details-page';
import concepts from './__fixtures/conceptsApiResponse.json';

const conceptItems = normalizeAggregations(concepts);

test('should render ConceptDetailsPage correctly with no apiItem', () => {
  const wrapper = shallow(<ConceptDetailsPage />);
  expect(wrapper).toMatchSnapshot();
});

test('should render ConceptDetailsPage correctly with conceptItem', () => {
  const wrapper = shallow(
    <ConceptDetailsPage
      conceptItem={_.get(conceptItems, ['_embedded', 'concepts', 0])}
    />
  );
  expect(wrapper).toMatchSnapshot();
});
