import React from 'react';
import PropTypes from 'prop-types';

import localization from '../../../../lib/localization';
import { getTranslateText } from '../../../../lib/translateText';

import './compare-terms.scss';

export const CompareTerms = props => {
  const { uri, prefLabel, creator, onDeleteTerm } = props;
  let title = getTranslateText(prefLabel);
  title = title.charAt(0).toUpperCase() + title.substring(1).toLowerCase();
  return (
    <div className="fdk-container p-4 fdk-container-compare-terms">
      <div className="d-flex align-items-baseline justify-content-between">
        <h3 className="">{title}</h3>
        <button
          type="button"
          className="btn fdk-text-size-15 fdk-color-link bg-transparent"
          onClick={() => {
            onDeleteTerm(uri);
          }}
        >
          <i className="fa fa-minus-circle" />
          &nbsp;
          {localization.terms.removeTerms}
        </button>
      </div>
      <div>{creator && <div>{creator}</div>}</div>
    </div>
  );
};

CompareTerms.defaultProps = {
  uri: null,
  prefLabel: null,
  creator: null
};

CompareTerms.propTypes = {
  uri: PropTypes.string,
  prefLabel: PropTypes.object,
  creator: PropTypes.string,
  onDeleteTerm: PropTypes.func.isRequired
};
