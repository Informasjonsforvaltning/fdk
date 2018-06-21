import React from 'react';
import { shallow } from 'enzyme';
import { CompareTermModalContent } from './compare-term-modal-content.component';
import concepts from '../../../../../../test/fixtures/concepts';

let defaultProps;
let wrapper;

beforeEach(() => {
  defaultProps = {
    terms: [concepts.hits.hits[0]._source, concepts.hits.hits[1]._source],
    selectedLanguageCode: null,
    cols: '6'
  };
  wrapper = shallow(<CompareTermModalContent {...defaultProps} />);
});

test('should render CompareTermModalContent correctly', () => {
  expect(wrapper).toMatchSnapshot();
});
