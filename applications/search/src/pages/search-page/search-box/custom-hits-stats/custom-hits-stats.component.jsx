import React from 'react';
import PropTypes from 'prop-types';
import { FeatureToggle } from 'react-feature-toggles';
import { FEATURES } from '../../../../app/features';
import localization from '../../../../lib/localization';

export const CustomHitsStats = props => {
  const {
    countDatasets,
    countTerms,
    countApis,
    countInformationModels,
    filteringOrTextSearchPerformed
  } = props;

  if (filteringOrTextSearchPerformed) {
    const datasetTextCount = `${countDatasets} ${
      localization.hitstats.datasetHits
    }`;
    const apisTextCount = `${countApis} ${localization.hitstats.apiHits}`;
    const termsTextCount = `${countTerms} ${localization.hitstats.conceptHits}`;
    const informationModelsTextCount = `${countInformationModels} ${
      localization.hitstats.informationModelsHits
    }`;

    return (
      <div className="sk-hits-stats" data-qa="hits-stats">
        <div className="sk-hits-stats__info" data-qa="info">
          <span>{localization.hitstats.search}&nbsp;</span>
          <span>{datasetTextCount}</span>
          <span>,&nbsp;{apisTextCount}</span>

          <FeatureToggle
            featureName={FEATURES.INFORMATIONMODEL}
            showOnlyWhenDisabled
          >
            <span>&nbsp;{localization.hitstats.and}&nbsp;</span>
            <span>{termsTextCount}</span>

            {countDatasets === 0 &&
              countApis === 0 &&
              countTerms === 0 && <span>{localization.hitstats.noHits}</span>}
          </FeatureToggle>

          <FeatureToggle featureName={FEATURES.INFORMATIONMODEL}>
            <span>,&nbsp;{termsTextCount}</span>
            <span>&nbsp;{localization.hitstats.and}&nbsp;</span>
            <span>{informationModelsTextCount}</span>

            {countDatasets === 0 &&
              countApis === 0 &&
              countTerms === 0 &&
              countInformationModels === 0 && (
                <span>{localization.hitstats.noHits}</span>
              )}
          </FeatureToggle>
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
          <FeatureToggle
            featureName={FEATURES.INFORMATIONMODEL}
            showOnlyWhenDisabled
          >
            <span>
              &nbsp;{localization.hitstats.and} {countTerms}{' '}
              {localization.hitstats.concepts}
            </span>
          </FeatureToggle>

          <FeatureToggle featureName={FEATURES.INFORMATIONMODEL}>
            <span>
              , {countTerms} {localization.hitstats.concepts}
            </span>
            <span>
              &nbsp;{localization.hitstats.and} {countInformationModels}{' '}
              {localization.hitstats.informationModels}
            </span>
          </FeatureToggle>
        </div>
      </div>
    </div>
  );
};

CustomHitsStats.defaultProps = {
  countDatasets: 0,
  countTerms: 0,
  countApis: 0,
  countInformationModels: 0,
  filteringOrTextSearchPerformed: false
};

CustomHitsStats.propTypes = {
  countDatasets: PropTypes.number,
  countTerms: PropTypes.number,
  countApis: PropTypes.number,
  countInformationModels: PropTypes.number,
  filteringOrTextSearchPerformed: PropTypes.bool
};
