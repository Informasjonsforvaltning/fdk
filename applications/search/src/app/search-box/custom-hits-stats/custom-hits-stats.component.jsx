import React from 'react';
import PropTypes from 'prop-types';
import localization from '../../../lib/localization';

export const CustomHitsStats = props => {
  const {
    countDatasets,
    countTerms,
    countApis,
    filteringOrTextSearchPerformed
  } = props;

  if (filteringOrTextSearchPerformed) {
    const datasetTextCount =
      countDatasets > 0
        ? `${countDatasets} ${localization.hitstats.datasetHits}`
        : '';
    const apisTextCount =
      countApis > 0 ? `${countApis} ${localization.hitstats.apiHits}` : '';
    const termsTextCount =
      countTerms > 0
        ? `${countTerms} ${localization.hitstats.conceptHits}`
        : '';
    return (
      <div className="sk-hits-stats" data-qa="hits-stats">
        <div className="sk-hits-stats__info" data-qa="info">
          {countDatasets > 0 &&
            countApis > 0 &&
            countTerms > 0 && (
              <React.Fragment>
                <span>{localization.hitstats.search}&nbsp;</span>
                <span>{datasetTextCount}</span>
                <span>,&nbsp;{apisTextCount}</span>
                <span>&nbsp;{localization.hitstats.and}&nbsp;</span>
                <span>{termsTextCount}</span>
              </React.Fragment>
            )}

          {countDatasets > 0 &&
            ((countApis > 0 && countTerms === 0) ||
              (countApis === 0 && countTerms > 0)) && (
              <div>
                <span>{localization.hitstats.search}&nbsp;</span>
                <span>{datasetTextCount}</span>
                <span>
                  &nbsp;{localization.hitstats.and}&nbsp;{apisTextCount}
                  {termsTextCount}
                </span>
              </div>
            )}

          {countDatasets === 0 &&
            (countApis > 0 || countTerms > 0) && (
              <React.Fragment>
                <span>{localization.hitstats.search}&nbsp;</span>
                <span>{apisTextCount}</span>
                {countApis > 0 &&
                  countTerms > 0 && (
                    <span>&nbsp;{localization.hitstats.and}&nbsp;</span>
                  )}
                <span>{termsTextCount}</span>
              </React.Fragment>
            )}

          {countDatasets > 0 &&
            (countApis === 0 && countTerms === 0) && (
              <React.Fragment>
                <span>{localization.hitstats.search}&nbsp;</span>
                <span>{datasetTextCount}</span>
              </React.Fragment>
            )}

          {countDatasets === 0 &&
            countApis === 0 &&
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
          {countApis > 0 && (
            <span>
              , {countApis} {localization.hitstats.apis}
            </span>
          )}
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
  countApis: null,
  filteringOrTextSearchPerformed: false
};

CustomHitsStats.propTypes = {
  countDatasets: PropTypes.number,
  countTerms: PropTypes.number,
  countApis: PropTypes.number,
  filteringOrTextSearchPerformed: PropTypes.bool
};
