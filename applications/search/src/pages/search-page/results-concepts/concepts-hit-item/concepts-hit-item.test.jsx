import React from 'react';
import { shallow } from 'enzyme';
import _ from 'lodash';

import { ConceptsHitItem } from './concepts-hit-item.component';
import concepts from '../../__fixtures/conceptsApiResponse.json';
import { normalizeAggregations } from '../../../../lib/normalizeAggregations';
import localization from '../../../../lib/localization';

const conceptItems = normalizeAggregations(concepts);

let onAddConcept;
let defaultProps;
let wrapper;

beforeEach(() => {
  onAddConcept = jest.fn();
  defaultProps = {
    result: _.get(conceptItems, ['_embedded', 'concepts', 0]),
    concepts: null,
    onAddConcept
  };
  wrapper = shallow(<ConceptsHitItem {...defaultProps} />);
});

test('should render ConceptsHitItem correctly', () => {
  expect(wrapper).toMatchSnapshot();
});

test('should handle onAddConcept', () => {
  const shallowWrapper = shallow(<ConceptsHitItem {...defaultProps} />);
  shallowWrapper.find('button').prop('onClick')(
    _.get(conceptItems, ['_embedded', 'concepts', 0])
  );
  expect(onAddConcept).toHaveBeenLastCalledWith(
    _.get(conceptItems, ['_embedded', 'concepts', 0])
  );
});

test('should render ConceptsHitItem correctly with compare button not showing', () => {
  const props = {
    result: _.get(conceptItems, ['_embedded', 'concepts', 0]),
    concepts: _.keyBy(
      [_.get(conceptItems, ['_embedded', 'concepts', 0])],
      'id'
    ),
    onAddConcept
  };
  const shallowWrapper = shallow(<ConceptsHitItem {...props} />);
  const button = shallowWrapper.find('button');
  expect(button.text()).toEqual(localization.compare.removeCompare);
});
