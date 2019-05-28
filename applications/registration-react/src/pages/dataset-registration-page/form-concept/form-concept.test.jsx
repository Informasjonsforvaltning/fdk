import React from 'react';
import { shallow } from 'enzyme';
import { FormConcept } from './form-concept.component';

let defaultProps;
let wrapper;

beforeEach(() => {
  defaultProps = {
    syncErrors: {
      keyword: null
    }
  };
  wrapper = shallow(<FormConcept {...defaultProps} />);
});

test('should render FormConcept correctly', () => {
  expect(wrapper).toMatchSnapshot();
});

test('should render FormConcept correctly with syncErrors', () => {
  wrapper.setProps({
    syncErrors: {
      keyword: {
        nb: 'Feil'
      }
    }
  });
  expect(wrapper).toMatchSnapshot();
});
