import React from 'react';
import _ from 'lodash';
import { shallow } from 'enzyme';

import { ConceptComparePage } from './concept-compare-page';
import conceptsResponse from './__fixtures/conceptsApiResponse.json';

const conceptItems = _.get(conceptsResponse, ['_embedded', 'concepts']);
const conceptsCompare = _.keyBy(conceptItems, 'id');

test('should render ConceptComparePage correctly with no apiItem', () => {
  const wrapper = shallow(<ConceptComparePage />);
  expect(wrapper).toMatchSnapshot();
});

test('should render ConceptComparePage correctly with conceptItem', () => {
  const wrapper = shallow(
    <ConceptComparePage conceptsCompare={conceptsCompare} />
  );
  expect(wrapper).toMatchSnapshot();
});
