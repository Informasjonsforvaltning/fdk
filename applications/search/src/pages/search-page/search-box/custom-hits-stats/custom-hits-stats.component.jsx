import React from 'react';
import PropTypes from 'prop-types';
import localization from '../../../../lib/localization';

export const CustomHitsStats = props => {
  const { countDatasets, countTerms, filteringOrTextSearchPerformed } = props;

  if (filteringOrTextSearchPerformed) {
    return (
      <div className="sk-hits-stats" data-qa="hits-stats">
        <div className="sk-hits-stats__info" data-qa="info">
          {countDatasets > 0 &&
            countTerms === 0 && (
              <div>
                <span>{localization.hitstats.search}&nbsp;</span>
                <span>
                  {countDatasets} {localization.hitstats.datasetHits}
                </span>
              </div>
            )}
          {countDatasets > 0 &&
            countTerms > 0 && (
              <div>
                <span>{localization.hitstats.search}&nbsp;</span>
                <span>
                  {countDatasets} {localization.hitstats.datasetHits}
                </span>
                <span>&nbsp;{localization.hitstats.and}&nbsp;</span>
                {countTerms} {localization.hitstats.conceptHits}
              </div>
            )}
          {countDatasets === 0 &&
            countTerms > 0 && (
              <div>
                <span>{localization.hitstats.search}&nbsp;</span>
                <span>
                  {countTerms} {localization.hitstats.conceptHits}
                </span>
              </div>
            )}
          {countDatasets === 0 &&
            countTerms === 0 && <span>{localization.hitstats.noHits}</span>}
        </div>
      </div>
    );
  }
  return (
    <div className="sk-hits-stats" data-qa="hits-stats">
      <div className="sk-hits-stats__info nosearch" data-qa="info">
        <div>
          <span>
            {localization.hitstats.nosearch.search} {countDatasets}{' '}
            {localization.hitstats.nosearch.descriptions}
          </span>
          <span>
            &nbsp;{localization.hitstats.and} {countTerms}{' '}
            {localization.hitstats.concepts}
          </span>
        </div>
      </div>
    </div>
  );
};

CustomHitsStats.defaultProps = {
  countDatasets: null,
  countTerms: null,
  filteringOrTextSearchPerformed: false
};

CustomHitsStats.propTypes = {
  countDatasets: PropTypes.number,
  countTerms: PropTypes.number,
  filteringOrTextSearchPerformed: PropTypes.bool
};
