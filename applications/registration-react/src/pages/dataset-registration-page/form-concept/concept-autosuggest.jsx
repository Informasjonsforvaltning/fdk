import Autosuggest from 'react-autosuggest';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import _ from 'lodash';
import { getTranslateText } from '../../../lib/translateText';
import localization from '../../../lib/localization';
import {
  extractConcepts,
  searchConcepts
} from '../../../api/search-api/concepts';

let fetchResponseThrottleTimeoutId = null;

const getSuggestionValue = suggestion =>
  getTranslateText(_.get(suggestion, 'prefLabel'));

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

export const ConceptAutosuggest = ({ addTag, ...inputProps }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  const clearSuggestions = () => setSuggestions([]);

  const fetchSuggestions = ({ value }) => {
    // Cancel the previous request
    if (fetchResponseThrottleTimeoutId) {
      clearTimeout(fetchResponseThrottleTimeoutId);
    }

    setIsLoading(true);

    searchConcepts({
      prefLabel: value,
      returnfields: 'uri,definition.text,publisher.prefLabel,publisher.name'
    })
      .then(extractConcepts)
      .then(concepts => {
        fetchResponseThrottleTimeoutId = setTimeout(() => {
          setIsLoading(false);
          setSuggestions(concepts);
        }, 250);
      })
      .catch(console.error);
  };

  return (
    <>
      <Autosuggest
        suggestions={suggestions}
        shouldRenderSuggestions={value => value && value.trim().length > 0}
        getSuggestionValue={suggestion => getSuggestionValue(suggestion)}
        renderSuggestion={renderSuggestion}
        renderSuggestionsContainer={({ containerProps, children }) =>
          renderSuggestionContainer(containerProps, children)
        }
        inputProps={inputProps}
        onSuggestionSelected={(e, { suggestion }) => {
          addTag(suggestion);
        }}
        onSuggestionsClearRequested={clearSuggestions}
        onSuggestionsFetchRequested={fetchSuggestions}
      />
      {isLoading && (
        <i
          className="fa fa-spinner fa-spin"
          style={{ position: 'absolute', right: '10px', top: '12px' }}
        />
      )}
    </>
  );
};
ConceptAutosuggest.propTypes = {
  addTag: PropTypes.func.isRequired
};
