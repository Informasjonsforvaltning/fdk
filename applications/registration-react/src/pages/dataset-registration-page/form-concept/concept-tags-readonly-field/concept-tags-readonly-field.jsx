import React from 'react';
import get from 'lodash/get';
import PropTypes from 'prop-types';

export const ConceptTagReadOnlyField = ({ input, languages }) => {
  const isOnlyOneSelectedLanguage =
    languages.filter(({ selected }) => selected).length === 1;

  const concepts = get(input, 'value');
  const langArray = [];

  langArray.nb = concepts
    .map(value => {
      if (value.prefLabel.nb || value.prefLabel.no) {
        return value.prefLabel.nb || value.prefLabel.no;
      }
      return null;
    })
    .filter(f => !!f)
    .join(', ');

  langArray.nn = concepts
    .map(value => {
      if (value.prefLabel.nn) {
        return value.prefLabel.nn;
      }
      return null;
    })
    .filter(f => !!f)
    .join(', ');

  langArray.en = concepts
    .map(value => {
      if (value.prefLabel.en) {
        return value.prefLabel.en;
      }
      return null;
    })
    .filter(f => !!f)
    .join(', ');

  return (
    <>
      {languages
        .filter(({ selected }) => selected)
        .map(l => (
          <div key={l.code} className="fdk-form-label w-100">
            <div className="readonly-language-field">
              {!isOnlyOneSelectedLanguage && (
                <div className="p-2">
                  <div className="indicator">{l.code}</div>
                </div>
              )}
              <div className="read-only-text">{langArray[l.code]}</div>
            </div>
          </div>
        ))}
    </>
  );
};

ConceptTagReadOnlyField.defaultProps = {
  input: null,
  languages: null
};

ConceptTagReadOnlyField.propTypes = {
  input: PropTypes.object,
  languages: PropTypes.array
};
