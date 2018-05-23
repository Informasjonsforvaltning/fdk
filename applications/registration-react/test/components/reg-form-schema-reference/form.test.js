import React from 'react';
import { shallow } from 'enzyme';
import FormReference, { renderReference } from '../../../src/components/reg-form-schema-reference/form';
import helptext from '../../fixtures/helptext';
import frequency from '../../fixtures/frequency';
import provenance from '../../fixtures/provenance';
import datasets from '../../fixtures/datasets'

let defaultProps, wrapper;

beforeEach(() => {
  const { helptextItems } = helptext;
  const { frequencyItems } = frequency;
  const { provenanceItems } = provenance;
  defaultProps = {
    initialValues: {},
    helptextItems: helptextItems,
  };
  wrapper = shallow(<FormReference {...defaultProps} />);
});


test('should render FormReference correctly', () => {
  expect(wrapper).toMatchSnapshot();
});

test('should render renderReference correctly', () => {
  wrapper = shallow(renderReference(defaultProps));
  expect(wrapper).toMatchSnapshot();
});
