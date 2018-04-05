import React from "react";

import localization from "../localization";
import { getParamFromUrl } from "../../utils/addOrReplaceUrlParam";

const CustomHitsStats = props => {
  const { countDatasets, countTerms } = props;

  let filteringOrTextSearchPerformed = false;

  if (
    getParamFromUrl("q") ||
    getParamFromUrl("theme") ||
    getParamFromUrl("accessRight") ||
    getParamFromUrl("publisher")
  ) {
    filteringOrTextSearchPerformed = true;
  }

  if (filteringOrTextSearchPerformed) {
    return (
      <div className="sk-hits-stats" data-qa="hits-stats">
        <div className="sk-hits-stats__info" data-qa="info">
          <span>{localization.hitstats.search}&nbsp;</span>
          {countDatasets > 0 && (
            <span>
              {countDatasets} {localization.hitstats.datasetHits}
            </span>
          )}
          {countDatasets > 0 &&
            countTerms > 0 && (
              <span>&nbsp;{localization.hitstats.and}&nbsp;</span>
            )}
          {countTerms > 0 && (
            <span>
              {countTerms} {localization.hitstats.conceptHits}
            </span>
          )}
          {countDatasets === 0 &&
            countTerms === 0 && <span>{localization.hitstats.noHits}</span>}
        </div>
      </div>
    );
  } else if (!filteringOrTextSearchPerformed) {
    return (
      <div className="sk-hits-stats" data-qa="hits-stats">
        <div className="sk-hits-stats__info nosearch" data-qa="info">
          <div>
            <span>
              {localization.hitstats.nosearch.search} {countDatasets}{" "}
              {localization.hitstats.nosearch.descriptions}
            </span>
            <span>
              &nbsp;{localization.hitstats.and} {countTerms}{" "}
              {localization.hitstats.concepts}
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export default CustomHitsStats;
