import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

import TagsInput from 'react-tagsinput';
import '../reg-form-field-input-tags/index.scss';

const updateInput = (updates, props) => {
  const { input } = props;
  let inputValues = input.value;
  if (!inputValues) {
    inputValues = []
  }
  inputValues.push(updates);
  input.onChange(inputValues);
}

const handleChange = (props, tags, changed, changedIndexes) => {
  const { input } = props;
  // const user = 'user';
  // const password = 'password';
  // const base64encodedData = new Buffer.from(`${user  }:${  password}`).toString('base64');

  /*
  const getHeaders = new Headers();
  getHeaders.append('Accept', 'application/json');
  */
  const getInit = {
    method: 'GET',
    // headers: getHeaders,
    credentials: 'same-origin'
  };

  // const url = '/referenceData/subjects?uri=https://data-david.github.io/Begrep/begrep/Enhet';
  const url = `referenceData/subjects?uri=${changed[0]}`

  // hvis changedIndex er mindre enn lengden av input.value, da fjerne den indeksen, hvis større så legge til
  const valueLength = input.value.length;
  const updates = input.value;

  if (changedIndexes < valueLength) { // skal fjerne en tag på gitt index
    updates.splice(changedIndexes[0], 1);
    input.onChange(updates);
  } else { // skal legge til en ny tag
    axios.get(url, getInit)
      .then((response) => {
        updateInput(response.data, props);
      })
      .catch((response) => {
        // TODO hvis ikke finnes, hvordan lagre denne verdien, som uri?
        const { error } = response;
        return Promise.reject(error);
      })
  }
  /*
  updates.push
  (
    {
      uri: "https://data-david.github.io/Begrep/begrep/Enhet",
      identifier: "https://data-david.github.io/Begrep/begrep/Enhet",
      prefLabel: {
        no: changed[0]
      },
      altLabel: null,
      definition: {
        no: "alt som er registrert med et organisasjonsnummer "
      },
      note: {
        no: "Alle hovedenheter, underenheter og organisasjonsledd som er identifisert med et organisasjonsnummer."
      },
      source: "https://jira.brreg.no/browse/BEGREP-208",
      creator: null,
      inScheme: null
    }
  );
  */
}

const InputTagsFieldConcepts  = (props) => {
  const { input, label, fieldLabel, showLabel } = props;
  let tagNodes = [];

  if (input && input.value && input.value.length > 0) {
    tagNodes = input.value.map((item) => item.prefLabel[fieldLabel] )
  }
  return (
    <div className="pl-2">
      <label className="fdk-form-label w-100" htmlFor={input.name}>
        {showLabel ? label : null}
        <div className="d-flex align-items-center">
          <TagsInput
            value={tagNodes}
            className="fdk-reg-input-tags"
            inputProps={{placeholder: ''}}
            onChange={(tags, changed, changedIndexes) => (handleChange(props, tags, changed, changedIndexes))}
          />
        </div>
      </label>
    </div>
  );
}

InputTagsFieldConcepts.defaultProps = {
  showLabel: false
};

InputTagsFieldConcepts.propTypes = {
  showLabel: PropTypes.bool
};

export default InputTagsFieldConcepts;
