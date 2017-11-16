import React from 'react';

import localization from '../../components/localization';
import { getTranslateText } from '../../utils/translateText';

const CompareTerms = (props) => {
  const { prefLabel, publisher, onDeleteTerm, termIndex, selectedLanguageCode} = props;
  return (
    <div className="fdk-container p-3">
      <button className="fdk-button fdk-button-cta pull-right" onClick={() => { onDeleteTerm(termIndex)}}>
        <i className="fa fa-times"/>
        &nbsp;
        {localization.terms.removeTerms}
      </button>
      <h4>{getTranslateText(prefLabel, selectedLanguageCode)}</h4>
      <p>{publisher}</p>
    </div>
  );
}

export default CompareTerms;
