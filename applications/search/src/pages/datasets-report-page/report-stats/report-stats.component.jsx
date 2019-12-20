import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import qs from 'qs';

import localization from '../../../lib/localization';
import { getParamFromLocation } from '../../../lib/addOrReplaceUrlParam';
import { DatasetStats } from './dataset-stats/dataset-stats.component';
import { APIStats } from './api-stats/api-stats.component';
import { ConceptStats } from './concept-stats/concept-stats.component';
import { Tabs } from '../../../components/tabs/tabs.component';
import { isFilterActive } from '../filter-helper';
import './report-stats.scss';

export const ReportStats = props => {
  const {
    datasetStats,
    apiStats,
    conceptStats,
    entityName,
    catalogs,
    fetchCatalogsIfNeeded,
    publishers,
    mostUsedConcepts
  } = props;
  const orgPath = getParamFromLocation(window.location, 'orgPath');
  fetchCatalogsIfNeeded();

  let name;
  if (entityName) {
    name = _.capitalize(
      localization.facet.publishers[entityName] || entityName
    );
  } else {
    name = localization.report.allEntities;
  }
  const title = (
    <div className="row mb-4">
      <div className="col-12 fdk-container-statsx">
        <h1>
          {localization.report.title}
          <strong>{name}</strong>
        </h1>
      </div>
    </div>
  );

  return (
    <div>
      {title}

      <div className="row">
        <div className="col-12 fdk-container-stats fdk-container-stats-total">
          <div className="row">
            <div className="col-4">
              <img src="/img/icon-catalog-dataset.svg" alt="" />
              <br />
              <Link
                title={localization.report.aggregation.public}
                className="mb-3"
                to={`/${qs.stringify({ orgPath }, { addQueryPrefix: true })}`}
              >
                <strong>
                  {datasetStats.total} {localization.report.datasets}
                </strong>
              </Link>
              <br />
              <Link
                title={localization.report.aggregation.public}
                className="mb-3"
                to={`/${qs.stringify(
                  { firstHarvested: 7, orgPath },
                  { addQueryPrefix: true }
                )}`}
              >
                {datasetStats.newLastWeek} {localization.report.newPastWeek}
              </Link>
            </div>
            <div className="col-4">
              <img src="/img/icon-catalog-api.svg" alt="" />
              <br />
              <Link
                title={localization.report.aggregation.public}
                className="mb-3"
                to={`/apis${qs.stringify(
                  { orgPath },
                  { addQueryPrefix: true }
                )}`}
              >
                <strong>
                  {apiStats.total} {localization.report.apis}
                </strong>
              </Link>
              <br />
              <Link
                title={localization.report.aggregation.public}
                className="mb-3"
                to={`/apis${qs.stringify(
                  { firstHarvested: 7, orgPath },
                  { addQueryPrefix: true }
                )}`}
              >
                {apiStats.newLastWeek} {localization.report.newPastWeek}
              </Link>
            </div>
            <div className="col-4">
              <img src="/img/icon-catalog-begrep.svg" alt="" />
              <br />
              <Link
                title={localization.report.aggregation.public}
                className="mb-3"
                to={`/concepts${qs.stringify(
                  { orgPath },
                  { addQueryPrefix: true }
                )}`}
              >
                <strong>
                  {conceptStats.total} {localization.report.concepts}
                </strong>
              </Link>
              <br />
              <Link
                title={localization.report.aggregation.public}
                className="mb-3"
                to={`/concepts${qs.stringify(
                  { firstHarvested: 7, orgPath },
                  { addQueryPrefix: true }
                )}`}
              >
                {conceptStats.newLastWeek} {localization.report.newPastWeek}
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12 fdk-report-tabs">
          <Tabs
            tabContent={[
              {
                title: localization.report.datasetTab,
                body: (
                  <DatasetStats
                    stats={datasetStats}
                    orgPath={orgPath}
                    catalogs={catalogs}
                    name={name}
                    isFilterActive={isFilterActive(props)}
                  />
                )
              },
              {
                title: localization.report.apiTab,
                body: (
                  <APIStats
                    stats={apiStats}
                    orgPath={orgPath}
                    catalogs={catalogs}
                    name={name}
                    isFilterActive={isFilterActive(props)}
                  />
                )
              },
              {
                title: localization.report.conceptTab,
                body: (
                  <ConceptStats
                    stats={conceptStats}
                    publishers={publishers}
                    mostUsedConcepts={mostUsedConcepts}
                    isFilterActive={isFilterActive(props)}
                  />
                )
              }
            ]}
          />
        </div>
      </div>
    </div>
  );
};

ReportStats.defaultProps = {
  fetchCatalogsIfNeeded: _.noop,
  entityName: null,
  catalogs: null,
  publishers: null
};

ReportStats.propTypes = {
  fetchCatalogsIfNeeded: PropTypes.func,
  datasetStats: PropTypes.object.isRequired,
  apiStats: PropTypes.object.isRequired,
  conceptStats: PropTypes.object.isRequired,
  entityName: PropTypes.string,
  catalogs: PropTypes.object,
  publishers: PropTypes.object
};
