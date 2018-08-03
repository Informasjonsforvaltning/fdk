import React from 'react';
import { shallow } from 'enzyme';
import { ConceptsHitItem } from './concepts-hit-item.component';
import concepts from '../../../../../test/fixtures/concepts';

let onAddTerm;
let defaultProps;
let wrapper;

beforeEach(() => {
  onAddTerm = jest.fn();
  defaultProps = {
    result: concepts.hits.hits[0],
    terms: null,
    onAddTerm
  };
  wrapper = shallow(<ConceptsHitItem {...defaultProps} />);
});

test('should render ConceptsHitItem correctly', () => {
  expect(wrapper).toMatchSnapshot();
});

test('should handle onAddTerm', () => {
  const shallowWrapper = shallow(<ConceptsHitItem {...defaultProps} />);
  shallowWrapper.find('button.d-lg-inline').prop('onClick')(
    concepts.hits.hits[0]._source
  );
  expect(onAddTerm).toHaveBeenLastCalledWith(concepts.hits.hits[0]._source);
  shallowWrapper.find('button.d-lg-inline').prop('onClick')(
    concepts.hits.hits[1]._source
  );
  expect(onAddTerm).toHaveBeenLastCalledWith(concepts.hits.hits[0]._source);
});

test('should render ConceptsHitItem correctly with compare button not showing', () => {
  const props = {
    result: concepts.hits.hits[0],
    terms: [concepts.hits.hits[0]._source],
    onAddTerm
  };
  const shallowWrapper = shallow(<ConceptsHitItem {...props} />);
  expect(shallowWrapper).toMatchSnapshot();
});

test('should render ConceptsHitItem correctly with no alt label, no source and no note', () => {
  const props = {
    result: concepts.hits.hits[1],
    terms: null,
    onAddTerm
  };
  const shallowWrapper = shallow(<ConceptsHitItem {...props} />);
  expect(shallowWrapper).toMatchSnapshot();
});
