import React from 'react';
import { shallow } from 'enzyme';
import { FormConceptPure } from './form-concept-pure.component';

let defaultProps;
let wrapper;

beforeEach(() => {
  defaultProps = {
    syncErrors: {
      keyword: null
    }
  };
  wrapper = shallow(<FormConceptPure {...defaultProps} />);
});

test('should render FormConceptPure correctly', () => {
  expect(wrapper).toMatchSnapshot();
});

test('should render FormConceptPure correctly with syncErrors', () => {
  wrapper.setProps({
    syncErrors: {
      keyword: {
        nb: 'Feil'
      }
    }
  });
  expect(wrapper).toMatchSnapshot();
});
