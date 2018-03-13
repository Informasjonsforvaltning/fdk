import React from 'react';

import localization from '../localization';
import { getParamFromUrl} from '../../utils/addOrReplaceUrlParam';

const CustomHitsStats = (props) => {
  const { countDatasets, isFetchingDatasets, countTerms, isFetchingTerms, timeTaken } = props;
  // const countDatasetsInt = countDatasets ? parseInt(countDatasets, 10) : 0;
  // const countTermsInt = countTerms ? parseInt(countTerms, 10) : 0;

  let filteringOrTextSearchPerformed = false;

  if (getParamFromUrl('q') || getParamFromUrl('theme') || getParamFromUrl('accessRight') || getParamFromUrl('publisher')) {
    filteringOrTextSearchPerformed = true;
  }
  // const initialCountSummaryShown = countDatasetsInt && !filteringOrTextSearchPerformed;
  const initialCountSummaryShown = !filteringOrTextSearchPerformed;

  let requestCompleted = false;
  if(timeTaken > 0) {
    requestCompleted =  true;
  }

  if (

    filteringOrTextSearchPerformed
  ) {
    return (
      <div className="sk-hits-stats" data-qa="hits-stats">
        <div className="sk-hits-stats__info" data-qa="info">
          <span>{localization.hitstats.search}&nbsp;</span>
          {countDatasets > 0 &&
          <span>{countDatasets} {localization.hitstats.datasetHits}</span>
          }
          {countDatasets === 0 && countTerms > 0 &&
          <span>,&nbsp;{localization.hitstats.but}</span>
          }
          {countDatasets > 0 && countTerms > 0 &&
          <span>&nbsp;{localization.hitstats.and}</span>
          }
          {countTerms > 0 &&
            <span>&nbsp;{localization.hitstats.and} {countTerms} {localization.hitstats.conceptHits}</span>
          }
          {countDatasets === 0 && countTerms === 0 &&
          <span>{localization.hitstats.noHits}</span>
          }
        </div>
      </div>

    );
  } else if (!filteringOrTextSearchPerformed) {
    return (
      <div className="sk-hits-stats" data-qa="hits-stats">
        <div className="sk-hits-stats__info nosearch" data-qa="info">
          <div>
            <span>{localization.hitstats.nosearch.search}</span> <span>{countDatasets}</span>
            <span>{localization.hitstats.nosearch.descriptions}</span>
            <span>&nbsp;{localization.hitstats.and} {countTerms} {localization.hitstats.concepts}</span>
          </div>
        </div>

      </div>
    );
  }
  return null;
};

export default CustomHitsStats;
