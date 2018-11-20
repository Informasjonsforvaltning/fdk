import React from 'react';
import PropTypes from 'prop-types';

import localization from '../../../../lib/localization';
import { getTranslateText } from '../../../../lib/translateText';

export const CompareTerms = props => {
  const { uri, prefLabel, creator, onDeleteTerm } = props;
  let title = getTranslateText(prefLabel);
  title = title.charAt(0).toUpperCase() + title.substring(1).toLowerCase();
  return (
    <div className="fdk-container p-4">
      <button
        className="float-right btn fdk-text-size-15 fdk-color-blue-dark"
        onClick={() => {
          onDeleteTerm(uri);
        }}
      >
        <i className="fa fa-minus-circle" />
        &nbsp;
        {localization.terms.removeTerms}
      </button>
      <h4 className="clearfix">{title}</h4>
      {creator && <div>{creator}</div>}
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
