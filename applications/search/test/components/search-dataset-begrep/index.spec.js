import React from 'react';
import Begrep from '../../../src/components/search-dataset-begrep';
import BegrepCollapse from '../../../src/components/search-dataset-begrep-collapse';

describe('Begrep', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<Begrep/>);
  });

  it('should render', () => {
    expect(wrapper).to.have.length(1);
  });

  it('should render subject and keyword href', () => {
    wrapper.setProps({
      subject: [
        {
          "uri": "https://data-david.github.io/Begrep/begrep/Enhet",
          "prefLabel": {
            "no": "enhet",
            "en": "department"
          },
          "definition": {
            "no": "alt som er registrert med et organisasjonsnummer "
          },
          "note": {
            "no": "Alle hovedenheter, underenheter og organisasjonsledd som er identifisert med et organisasjonsnummer.",
            "en": "All departments."
          },
          "source": "https://jira.brreg.no/browse/BEGREP-208"
        }
      ],
      keyword: [
        {
          "nb": "Bestemmelse"
        },
        {
          "nb": "jord"
        },
        {
          "nb": "regulering"
        },
        {
          "nb": "statlig bestemmelse"
        }
      ]
    });
    expect(wrapper.find(BegrepCollapse)).to.have.length(1);
    expect(wrapper.find('.keyword')).to.have.length(4);
  });
});
