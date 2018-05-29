import React from 'react';
import { shallow } from 'enzyme';
import CompareTermModal from '../../../src/components/search-concepts-compare-modal';
import concepts from '../../fixtures/concepts';

let handleDeleteTerm;
let defaultProps;
let wrapper;

beforeEach(() => {
  handleDeleteTerm = jest.fn();
  defaultProps = {
    terms: [concepts.hits.hits[0]._source, concepts.hits.hits[1]._source],
    handleDeleteTerm
  };
  wrapper = shallow(<CompareTermModal {...defaultProps} />);
});

test('should render CompareTermModal correctly with props', () => {
  expect(wrapper).toMatchSnapshot();
});

test('should render CompareTermModal correctly with one term', () => {
  const deleteTerm = jest.fn();
  const props = {
    terms: [concepts.hits.hits[0]._source],
    handleDeleteTerm: deleteTerm
  };
  const wrapperWithProp = shallow(<CompareTermModal {...props} />);
  expect(wrapperWithProp).toMatchSnapshot();
});

test('should handle open correctly', () => {
  wrapper.find('button.bottom-modal-label').simulate('click');
  expect(wrapper.state('showModal')).toBe(true);
  expect(wrapper.state('showBar')).toBe(false);
});

test('should handle modal onClick', () => {
  wrapper.find('ModalTitle').prop('onClick');
  expect(wrapper.state('showModal')).toBe(false);
  expect(wrapper.state('showBar')).toBe(true);
});

test('should handle onChange', () => {
  wrapper
    .find('button.fdk-concepts-compare-rm-term')
    .at(0)
    .prop('onClick')();
  expect(handleDeleteTerm).toHaveBeenLastCalledWith(0);
});
