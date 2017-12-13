import React from 'react';

import localization from '../localization';
import { getParamFromUrl} from '../../utils/addOrReplaceUrlParam';

const state = {}
const CustomHitsStats = (props) => {
  const { hitsCount, timeTaken, prefLabel } = props;
  const language = localization.getLanguage();
  const locationHref = window.location.href;
  const hitsCountInt = hitsCount ? parseInt(hitsCount, 10) : 0;

  let filteringOrTextSearchPerformed = false;

  if (getParamFromUrl('q') || getParamFromUrl('theme') || getParamFromUrl('accessRight') || getParamFromUrl('publisher')) {
    filteringOrTextSearchPerformed = true;
  }

  let requestCompleted = true;

  if(timeTaken === state.timeTaken && language === state.language && locationHref === state.locationHref) {
    requestCompleted =  false;
  }

  const initialCountSummaryShown = requestCompleted && hitsCountInt && !filteringOrTextSearchPerformed;


  state.language = language;
  state.timeTaken = timeTaken;
  state.locationHref = locationHref;
  state.initialCountSummaryShown = initialCountSummaryShown;
  state.hitsCount = hitsCount;

  if (

    filteringOrTextSearchPerformed
  ) { // it's a search
    return (
      <div className="sk-hits-stats" data-qa="hits-stats">
        <div className="sk-hits-stats__info" data-qa="info">
          <span>{localization.page['result.summary']}</span> <span>{hitsCount}</span> {localization.page.dataset}
        </div>
      </div>
    );
  } else if (requestCompleted && hitsCountInt) {
    return (
      <div className="sk-hits-stats" data-qa="hits-stats">
        <div className="sk-hits-stats__info nosearch" data-qa="info">
          <span>{localization.page['nosearch.summary']}</span> <span>{hitsCount}</span> {prefLabel}
        </div>
      </div>
    );
  }
  return null;
};

export default CustomHitsStats;
