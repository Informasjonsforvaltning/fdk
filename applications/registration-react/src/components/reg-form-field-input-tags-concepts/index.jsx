import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

import TagsInput from 'react-tagsinput';
import AutosizeInput from 'react-input-autosize';
import '../reg-form-field-input-tags/index.scss';
import './index.scss';

const updateInput = (updates, props) => {
  const { input } = props;
  let inputValues = input.value;
  if (!inputValues) {
    inputValues = [];
  }
  inputValues.push(updates);
  input.onChange(inputValues);
};

const handleChange = (props, tags, changed, changedIndexes) => {
  const { input } = props;

  const header = {
    Accept: 'application/json'
  };

  const getInit = {
    method: 'GET',
    headers: header,
    credentials: 'same-origin'
  };

  // https://data-david.github.io/Begrep/begrep/Enhet';
  const url = `referenceData/subjects?uri=${changed[0]}`;

  // hvis changedIndex er mindre enn lengden av input.value, da fjerne den indeksen, hvis større så legge til
  const valueLength = input.value.length;
  const updates = input.value;

  if (changedIndexes < valueLength) {
    // skal fjerne en tag på gitt index
    updates.splice(changedIndexes[0], 1);
    input.onChange(updates);
  } else {
    // skal legge til en ny tag
    axios
      .get(url, getInit)
      .then(response => {
        updateInput(response.data, props);
      })
      .catch(() => {
        // TODO handle error
      });
  }
};

const autosizingRenderInput = ({ addTag, ...componentProps }) => {
  const { onChange, value, ...other } = componentProps;
  return (
    <AutosizeInput type="text" onChange={onChange} value={value} {...other} />
  );
};

const InputTagsFieldConcepts = props => {
  const {
    input,
    label,
    meta: { error, warning },
    fieldLabel,
    showLabel
  } = props;
  let tagNodes = [];

  if (input && input.value && input.value.length > 0) {
    tagNodes = input.value.map(item => item.prefLabel[fieldLabel]);
  }
  return (
    <div className="pl-2">
      <label className="fdk-form-label w-100" htmlFor={input.name}>
        {showLabel ? label : null}
        <div className="d-flex align-items-center">
          <TagsInput
            value={tagNodes}
            className="fdk-reg-input-tags"
            inputProps={{ placeholder: '' }}
            onChange={(tags, changed, changedIndexes) =>
              handleChange(props, tags, changed, changedIndexes)
            }
            renderInput={autosizingRenderInput}
          />
        </div>
      </label>
      {(error && <div className="alert alert-danger mt-3">{error}</div>) ||
        (warning && <div className="alert alert-warning mt-3">{warning}</div>)}
    </div>
  );
};

autosizingRenderInput.defaultProps = {
  addTag: null
};
autosizingRenderInput.propTypes = {
  addTag: PropTypes.object
};

InputTagsFieldConcepts.defaultProps = {
  showLabel: false,
  input: null,
  label: null,
  meta: null,
  fieldLabel: null
};

InputTagsFieldConcepts.propTypes = {
  showLabel: PropTypes.bool,
  input: PropTypes.object,
  label: PropTypes.string,
  meta: PropTypes.object,
  fieldLabel: PropTypes.string
};

export default InputTagsFieldConcepts;
