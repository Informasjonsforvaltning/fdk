import React from 'react';
import PropTypes from 'prop-types';

import localization from '../../../../lib/localization';
import { getTranslateText } from '../../../../lib/translateText';

export const CompareTerms = props => {
  const { prefLabel, creator, onDeleteTerm, termIndex } = props;
  let title = getTranslateText(prefLabel);
  title = title.charAt(0).toUpperCase() + title.substring(1).toLowerCase();
  return (
    <div className="fdk-container p-3">
      <button
        className="float-right fdk-button-small fdk-color-blue-dark"
        onClick={() => {
          onDeleteTerm(termIndex);
        }}
      >
        <i className="fa fa-times" />
        &nbsp;
        {localization.terms.removeTerms}
      </button>
      <h4 className="clearfix">{title}</h4>
      {creator && <div>{creator}</div>}
    </div>
  );
};

CompareTerms.defaultProps = {
  prefLabel: null,
  creator: null
};

CompareTerms.propTypes = {
  prefLabel: PropTypes.object,
  creator: PropTypes.string,
  onDeleteTerm: PropTypes.func.isRequired,
  termIndex: PropTypes.number.isRequired
};
