import React from 'react';

import localization from '../../components/localization';
import { getTranslateText } from '../../utils/translateText';

const CompareTerms = (props) => {
  const { prefLabel, creator, onDeleteTerm, termIndex, selectedLanguageCode} = props;
  let title = getTranslateText(prefLabel, selectedLanguageCode);
  title = title.charAt(0).toUpperCase() + title.substring(1).toLowerCase();
  return (
    <div className="fdk-container p-3">
      <button className="fdk-button fdk-button-cta pull-right fdk-button-on-white" onClick={() => { onDeleteTerm(termIndex)}}>
        <i className="fa fa-times" />
        &nbsp;
        {localization.terms.removeTerms}
      </button>
      <h4>{ title }</h4>
      <div className="mt-2">{ creator }</div>
    </div>
  );
}

export default CompareTerms;
