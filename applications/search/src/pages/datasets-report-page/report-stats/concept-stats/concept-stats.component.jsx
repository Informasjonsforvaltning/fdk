import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import localization from '../../../../lib/localization';
import '../report-stats.scss';
import { getTranslateText } from '../../../../lib/translateText';
import { StatBox } from '../stat-box/stat-box.component';
import { getPublisherByOrgNr } from '../../../../redux/modules/publishers';

export const ConceptStats = props => {
  const { stats, publishers, mostUsedConcepts, isFilterActive } = props;

  if (!stats) {
    return null;
  }

  const conceptsRelatedToDatasets = (
    <div className="d-flex flex-fill py-5">
      <StatBox label={localization.report.conceptsRelatedToDataset}>
        <img src="/img/icon-report-concept.svg" alt="icon" />
        <span className="stat-box--number">
          {Object.keys(_.get(stats, 'datasetCountsByConceptUri')).length}
        </span>
      </StatBox>
    </div>
  );

  const renderConceptItem = mostUsedConcepts =>
    mostUsedConcepts.map((conceptRecord, index) => (
      <Link
        key={`mostUsed-${index}`}
        className="fdk-label-item"
        to={`/concepts/${conceptRecord.id}`}
      >
        <strong className="fdk-text-size-medium">
          {getTranslateText(_.get(conceptRecord, 'prefLabel'))}
        </strong>
      </Link>
    ));

  const renderMostUsedConcepts = (
    <div className="py-5">
      <div className="d-flex justify-content-center">
        {localization.report.conceptMostUsed}:
      </div>
      <div className="d-flex justify-content-center flex-wrap">
        {renderConceptItem(mostUsedConcepts)}
      </div>
    </div>
  );

  const catalogListItem = stats.publisher.map(publisherRecord => {
    const publisherItem = getPublisherByOrgNr(publishers, publisherRecord.key);
    return (
      <div
        className="d-flex justify-content-between fdk-bg-color-neutral-lightest rounded p-4 mb-1"
        key={publisherRecord.key}
      >
        <div>
          {getTranslateText(_.get(publisherItem, 'prefLabel')) ||
            publisherRecord.key}
        </div>
        <div>
          <strong>
            <Link
              title={localization.page.datasetTab}
              className="fdk-plain-label"
              to={`/concepts?orgPath=${_.get(publisherItem, 'orgPath')}`}
            >
              {publisherRecord.count}
            </Link>
          </strong>
        </div>
      </div>
    );
  });

  const catalogList = (
    <div className="d-flex flex-column p-5 border-top">
      {!isFilterActive && (
        <div className="statbox d-flex justify-content-center">
          <span className="stat-box--number">
            {Object.keys(_.get(stats, 'publisher', [])).length}&nbsp;
          </span>
          <span>{localization.report.countConceptsCatalogsLabel}</span>
        </div>
      )}

      {Object.keys(_.get(stats, 'publisher', [])).length > 0 && (
        <>
          <div className="d-flex mt-5 mb-5 justify-content-center">
            <strong>{localization.report.conceptsFrom}</strong>
          </div>
          <div className="d-flex justify-content-between fdk-bg-color-neutral-darkest fdk-color-white rounded p-4 mb-1">
            <div>{localization.report.conceptsCatalog}</div>
            <div>{localization.page.termTab}</div>
          </div>
          {catalogListItem}
        </>
      )}
    </div>
  );

  return (
    <div className="px-0 fdk-container-stats">
      {conceptsRelatedToDatasets}
      {renderMostUsedConcepts}
      {catalogList}
    </div>
  );
};

ConceptStats.defaultProps = {
  stats: null,
  publishers: null,
  isFilterActive: false
};

ConceptStats.propTypes = {
  stats: PropTypes.object,
  publishers: PropTypes.object,
  isFilterActive: PropTypes.bool
};
