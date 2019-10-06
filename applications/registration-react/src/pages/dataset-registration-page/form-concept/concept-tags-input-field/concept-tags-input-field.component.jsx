import React from 'react';
import PropTypes from 'prop-types';
import TagsInput from 'react-tagsinput';
import { getTranslateText } from '../../../../services/translateText';
import '../../../../components/fields/field-input-tags/field-input-tags.scss';
import { ConceptAutosuggest } from '../concept-autosuggest';

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

const ConceptTagsInputField = props => {
  const { input } = props;
  const tagNodes = (input.value || []).map(item =>
    getTranslateText(item.prefLabel)
  );

  return (
    <div className="pl-2">
      <div className="d-flex align-items-center">
        <TagsInput
          value={tagNodes}
          className="fdk-reg-input-tags"
          inputProps={{ placeholder: '' }}
          onChange={(tags, changed, changedIndexes) => {
            handleChange(input, tags, changed, changedIndexes);
          }}
          renderInput={({ ref, ...restOfProps }) => (
            <ConceptAutosuggest {...restOfProps} />
          )}
        />
      </div>
    </div>
  );
};

ConceptTagsInputField.defaultProps = {
  input: null
};

ConceptTagsInputField.propTypes = {
  input: PropTypes.object
};

export default ConceptTagsInputField;
