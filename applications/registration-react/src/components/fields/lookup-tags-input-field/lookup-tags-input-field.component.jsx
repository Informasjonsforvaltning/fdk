import React from 'react';
import PropTypes from 'prop-types';
import TagsInput from 'react-tagsinput';
import { getTranslateText } from '../../../../services/translateText';
import { ConceptAutosuggest } from '../concept-autosuggest';
import '../field-input-tags/field-input-tags.scss';

const handleChange = (input, tags, changed, changedIndexes) => {
  // if changedIndex er smaller than number of tags, then it must be deletion of the tag
  if (changedIndexes < input.value.length) {
    const newValue = input.value;
    newValue.splice(changedIndexes[0], 1);
    input.onChange(newValue);
  } else if (typeof changed[0] === 'object') {
    // only add if object was selected from droptown, not free text
    const newValue = input.value || [];
    newValue.push(changed[0]);
    input.onChange(newValue);
  }
};

const LookupTagsInputField = ({ input, renderLookupInput, getTagFromItem }) => {
  const getTags = value => (value || []).map(getTagFromItem);

  return (
    <div className="pl-2">
      <div className="d-flex align-items-center">
        <TagsInput
          value={getTags(input.value)}
          className="fdk-reg-input-tags"
          inputProps={{ placeholder: '' }}
          onChange={(tags, changed, changedIndexes) => {
            handleChange(input, tags, changed, changedIndexes);
          }}
          renderInput={renderLookupInput}
        />
      </div>
    </div>
  );
};

LookupTagsInputField.defaultProps = {
  getTagFromItem: item => item
};

LookupTagsInputField.propTypes = {
  input: PropTypes.object.isRequired,
  renderLookupInput: PropTypes.func.isRequired,
  getTagFromItem: PropTypes.func
};

export default LookupTagsInputField;
