import React from 'react';
import { shallow } from 'enzyme';
import { CompareTerms } from './compare-terms.component';

let defaultProps;
let wrapper;
let onDeleteTerm;

beforeEach(() => {
  onDeleteTerm = jest.fn();
  defaultProps = {
    prefLabel: {
      nb: 'PrefLabel 1'
    },
    creator: 'Creator 1',
    onDeleteTerm,
    termIndex: 0,
    selectedLanguageCode: 'nb'
  };
  wrapper = shallow(<CompareTerms {...defaultProps} />);
});

test('should render CompareTerms correctly', () => {
  expect(wrapper).toMatchSnapshot();
});

test('should handle onDeleteTerm', () => {
  wrapper.find('button').prop('onClick')(defaultProps.termIndex);
  expect(onDeleteTerm).toHaveBeenLastCalledWith(defaultProps.termIndex);
});
