import React from 'react';
import { shallow } from 'enzyme';
import FormConcept from '../../../src/components/reg-form-schema-concept/form';
import helptext from '../../fixtures/helptext';

let defaultProps, wrapper;

beforeEach(() => {
  const { helptextItems } = helptext;
  defaultProps = {
    syncErrors: {
      keyword: null
    },
    helptextItems: helptextItems,
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
  })
  expect(wrapper).toMatchSnapshot();
});

