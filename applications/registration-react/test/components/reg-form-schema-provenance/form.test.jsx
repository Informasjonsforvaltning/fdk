import React from 'react';
import { shallow } from 'enzyme';
import FormProvenance from '../../../src/components/reg-form-schema-provenance/form';
import helptext from '../../fixtures/helptext';
import frequency from '../../fixtures/frequency';
import provenance from '../../fixtures/provenance';

let defaultProps;
let wrapper;

beforeEach(() => {
  const { helptextItems } = helptext;
  const { frequencyItems } = frequency;
  const { provenanceItems } = provenance;
  defaultProps = {
    initialValues: {
      frequencyItems,
      provenanceItems
    },
    helptextItems,
    provenanceItems,
    input: {
      name: 'provenance',
      value: {
        uri: 'http://data.brreg.no/datakatalog/provinens/bruker',
        code: 'BRUKER',
        prefLabel: {
          nb: 'Brukerinnsamlede data',
          nn: 'Brukerinnsamlede data',
          en: 'User collection'
        }
      }
    }
  };
  wrapper = shallow(<FormProvenance {...defaultProps} />);
});

test('should render FormProvenance correctly', () => {
  expect(wrapper).toMatchSnapshot();
});
