import React from 'react';
import { shallow } from 'enzyme';
import FormConcept from './form-concept.component';
import helptext from '../../../../test/fixtures/helptext';

let defaultProps;
let wrapper;

beforeEach(() => {
  const { helptextItems } = helptext;
  defaultProps = {
    syncErrors: {
      keyword: null
    },
    helptextItems
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
