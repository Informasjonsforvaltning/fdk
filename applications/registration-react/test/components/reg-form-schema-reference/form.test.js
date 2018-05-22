import React from 'react';
import { shallow } from 'enzyme';
import FormReference, { renderProvenance } from '../../../src/components/reg-form-schema-reference/form';
import helptext from '../../fixtures/helptext';
import frequency from '../../fixtures/frequency';
import provenance from '../../fixtures/provenance';

let defaultProps, wrapper;

beforeEach(() => {
  const { helptextItems } = helptext;
  const { frequencyItems } = frequency;
  const { provenanceItems } = provenance;
  defaultProps = {
    initialValues: {
      frequencyItems,
      provenanceItems
    },
    helptextItems: helptextItems,
  };
  wrapper = shallow(<FormReference {...defaultProps} />);
});


test('should render FormReference correctly', () => {
  expect(wrapper).toMatchSnapshot();
});

