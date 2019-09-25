import React from 'react';
import { shallow } from 'enzyme';
import { FormConceptPure } from './form-concept-pure.component';

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

test('should render FormConceptPure correctly', () => {
  expect(wrapper).toMatchSnapshot();
});

test('should render FormConceptPure correctly with errors', () => {
  wrapper.setProps({
    errors: {
      keyword: {
        nb: 'Feil'
      }
    }
  });
  expect(wrapper).toMatchSnapshot();
});
