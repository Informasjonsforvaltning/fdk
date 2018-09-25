import React from 'react';
import { shallow } from 'enzyme';
import InputTagsFieldConcepts from './input-tags-concepts.component';

let defaultProps;
let wrapper;

beforeEach(() => {
  defaultProps = {
    showLabel: true,
    input: {
      name: 'subject',
      value: [
        {
          uri: 'https://data-david.github.io/Begrep/begrep/Enhet',
          identifier: 'https://data-david.github.io/Begrep/begrep/Enhet',
          prefLabel: { no: 'enhet' },
          altLabel: null,
          definition: {
            no: 'alt som er registrert med et organisasjonsnummer '
          },
          note: {
            no:
              'Alle hovedenheter, underenheter og organisasjonsledd som er identifisert med et organisasjonsnummer.'
          },
          source: 'https://jira.brreg.no/browse/BEGREP-208',
          creator: {
            uri: 'http://data.brreg.no/enhetsregisteret/enhet/974760673'
          },
          inScheme: ['http://data-david.github.io/vokabular/Befolkning'],
          datasets: null
        }
      ]
    },
    label: 'label',
    type: 'input',
    meta: {
      active: false,
      asyncValidating: false,
      autofilled: false,
      dirty: false,
      form: 'catalog',
      initial: 'Datakatalog for RAMSUND OG ROGNAN REVISJON',
      invalid: false,
      pristine: true,
      submitting: false,
      submitFailed: false,
      touched: false,
      valid: true,
      visited: false
    },
    fieldLabel: 'fieldLabel'
  };
  wrapper = shallow(<InputTagsFieldConcepts {...defaultProps} />);
});

test('should render InputTagsFieldConcepts correctly', () => {
  expect(wrapper).toMatchSnapshot();
});
