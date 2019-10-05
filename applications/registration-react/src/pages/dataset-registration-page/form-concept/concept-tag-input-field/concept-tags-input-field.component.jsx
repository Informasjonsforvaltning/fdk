import React from 'react';
import PropTypes from 'prop-types';
import Autosuggest from 'react-autosuggest';
import TagsInput from 'react-tagsinput';
import _ from 'lodash';

import localization from '../../../../lib/localization';
import {
  extractConcepts,
  searchConcepts
} from '../../../../api/search-api/concepts';
import { getTranslateText } from '../../../../lib/translateText';
import '../../../../components/fields/field-input-tags/field-input-tags.scss';

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

const renderSuggestionContainer = (containerProps, children) => (
  <div {...containerProps}>
    <div className="d-flex mb-3 react_autosuggest__suggestions-heading">
      <span className="w-25 first">
        <strong>{localization.anbefaltTerm}</strong>
      </span>
      <div className="w-75 ml-5 d-flex">
        <span className="w-50">
          <strong>{localization.definition}</strong>
        </span>
        <span className="w-50 ml-5">
          <strong>{localization.responsible}</strong>
        </span>
      </div>
    </div>
    {children}
  </div>
);

const renderSuggestion = suggestion => (
  <div className="d-flex mb-3">
    <span className="w-25">
      {getTranslateText(_.get(suggestion, 'prefLabel'))}
    </span>
    <div className="w-75 ml-5 d-flex">
      <span className="w-50">
        {getTranslateText(_.get(suggestion, ['definition', 'text']))}
      </span>
      <span className="w-50 ml-5">
        {getTranslateText(
          _.get(suggestion, ['publisher', 'prefLabel']) ||
            _.get(suggestion, ['publisher', 'name'])
        )}
      </span>
    </div>
  </div>
);

const getSuggestionValue = suggestion =>
  getTranslateText(_.get(suggestion, 'prefLabel'));

class ConceptTagsInputField extends React.Component {
  constructor() {
    super();

    this.state = {
      suggestions: [],
      isLoading: false
    };

    this.lastRequestId = null;
    this.loadSuggestions = this.loadSuggestions.bind(this);
    this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(
      this
    );
    this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(
      this
    );
    this.autosuggestRenderInput = this.autosuggestRenderInput.bind(this);
  }

  onSuggestionsFetchRequested({ value }) {
    this.loadSuggestions(value);
  }

  onSuggestionsClearRequested() {
    this.setState({
      suggestions: []
    });
  }

  loadSuggestions(value) {
    // Cancel the previous request
    if (this.lastRequestId !== null) {
      clearTimeout(this.lastRequestId);
    }

    this.setState({
      isLoading: true
    });

    searchConcepts({
      prefLabel: value,
      returnfields: 'uri,definition.text,publisher.prefLabel,publisher.name',
      size: 25
    })
      .then(extractConcepts)
      .then(concepts => {
        this.lastRequestId = setTimeout(() => {
          this.setState({
            isLoading: false,
            suggestions: concepts
          });
        }, 250);
      })
      .catch(console.error);
  }

  autosuggestRenderInput({ addTag, ...props }) {
    const { suggestions, isLoading } = this.state;

    return (
      <>
        <Autosuggest
          suggestions={suggestions}
          shouldRenderSuggestions={value => value && value.trim().length > 0}
          getSuggestionValue={suggestion => getSuggestionValue(suggestion)}
          renderSuggestion={suggestion => renderSuggestion(suggestion)}
          renderSuggestionsContainer={({ containerProps, children }) =>
            renderSuggestionContainer(containerProps, children)
          }
          inputProps={{ ...props }}
          onSuggestionSelected={(e, { suggestion }) => {
            addTag(suggestion);
          }}
          onSuggestionsClearRequested={this.onSuggestionsClearRequested}
          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        />
        {isLoading && (
          <i
            className="fa fa-spinner fa-spin"
            style={{ position: 'absolute', right: '10px', top: '12px' }}
          />
        )}
      </>
    );
  }

  render() {
    const { input } = this.props;
    let tagNodes = [];

    if (input && input.value && input.value.length > 0) {
      tagNodes = input.value.map(item => getTranslateText(item.prefLabel));
    }
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
            renderInput={this.autosuggestRenderInput}
          />
        </div>
      </div>
    );
  }
}

ConceptTagsInputField.defaultProps = {
  input: null
};

ConceptTagsInputField.propTypes = {
  input: PropTypes.object
};

export default ConceptTagsInputField;
