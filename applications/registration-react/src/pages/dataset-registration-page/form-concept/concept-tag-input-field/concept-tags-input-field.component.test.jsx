import React from 'react';
import { shallow } from 'enzyme';
import ConceptTagsInputField from './concept-tags-input-field.component';

let defaultProps;
let wrapper;

beforeEach(() => {
  defaultProps = {
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
    }
  };
  wrapper = shallow(<ConceptTagsInputField {...defaultProps} />);
});

test('should render ConceptTagsInputField correctly', () => {
  expect(wrapper).toMatchSnapshot();
});
