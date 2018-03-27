import React from 'react';

import localization from '../../components/localization';
import { getTranslateText } from '../../utils/translateText';

const CompareTerms = props => {
  const {
    prefLabel,
    creator,
    onDeleteTerm,
    termIndex,
    selectedLanguageCode
  } = props;
  let title = getTranslateText(prefLabel, selectedLanguageCode);
  title = title.charAt(0).toUpperCase() + title.substring(1).toLowerCase();
  return (
    <div className="fdk-container p-3">
      <button
        className="pull-right fdk-button-small"
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

export default CompareTerms;
