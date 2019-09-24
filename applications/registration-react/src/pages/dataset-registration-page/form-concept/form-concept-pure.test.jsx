import React from 'react';
import { shallow } from 'enzyme';
import { FormConceptPure } from './form-concept-pure';

let defaultProps;
let wrapper;

beforeEach(() => {
  defaultProps = {
    errors: {
      keyword: null
    }
  };
  wrapper = shallow(<FormConceptPure {...defaultProps} />);
});

test('should render FormConcept correctly', () => {
  expect(wrapper).toMatchSnapshot();
});

test('should render FormConcept correctly with errors', () => {
  wrapper.setProps({
    errors: {
      keyword: {
        nb: 'Feil'
      }
    }
  });
  expect(wrapper).toMatchSnapshot();
});
