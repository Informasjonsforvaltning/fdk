import React from 'react';

import localization from '../localization';
import { getParamFromUrl} from '../../utils/addOrReplaceUrlParam';

const CustomHitsStats = (props) => {
  const { hitsCount, timeTaken, prefLabel } = props;
  const hitsCountInt = hitsCount ? parseInt(hitsCount, 10) : 0;

  let filteringOrTextSearchPerformed = false;

  if (getParamFromUrl('q') || getParamFromUrl('theme') || getParamFromUrl('accessRight') || getParamFromUrl('publisher')) {
    filteringOrTextSearchPerformed = true;
  }
  const initialCountSummaryShown = hitsCountInt && !filteringOrTextSearchPerformed;

  let requestCompleted = false;
  if(timeTaken > 0) {
    requestCompleted =  true;
  }

  if (
    requestCompleted &&
    filteringOrTextSearchPerformed
  ) {
    return (
      <div className="sk-hits-stats" data-qa="hits-stats">
        <div className="sk-hits-stats__info" data-qa="info">
          <span>{localization.page['result.summary']}</span> <span>{hitsCount}</span> {localization.page.dataset}
        </div>
      </div>
    );
  } else if (initialCountSummaryShown) {
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
