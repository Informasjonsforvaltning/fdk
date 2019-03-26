import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import localization from '../../../lib/localization';
import { getParamFromLocation } from '../../../lib/addOrReplaceUrlParam';
import { DatasetStats } from './dataset-stats/dataset-stats.component';
import { APIStats } from './api-stats/api-stats.component';
import { Tabs } from '../../../components/tabs/tabs.component';
import './report-stats.scss';

export const ReportStats = props => {
  const {
    datasetStats,
    apiStats,
    conceptStats,
    entityName,
    catalogs,
    fetchCatalogsIfNeeded
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
              <img src="/static/img/icon-catalog-dataset.svg" alt="" />
              <br />
              <Link
                title={localization.report.aggregation.public}
                className="mb-3"
                to="/"
              >
                <strong>
                  {datasetStats.total} {localization.report.datasets}
                </strong>
              </Link>
              <br />
              <Link
                title={localization.report.aggregation.public}
                className="mb-3"
                to="/?firstHarvested=7"
              >
                {datasetStats.newLastWeek} {localization.report.newPastWeek}
              </Link>
            </div>
            <div className="col-4">
              <img src="/static/img/icon-catalog-api.svg" alt="" />
              <br />
              <Link
                title={localization.report.aggregation.public}
                className="mb-3"
                to="/apis"
              >
                <strong>
                  {apiStats.total} {localization.report.apis}
                </strong>
              </Link>
              <br />
              <Link
                title={localization.report.aggregation.public}
                className="mb-3"
                to="/apis?firstHarvested=7"
              >
                {apiStats.newLastWeek} {localization.report.newPastWeek}
              </Link>
            </div>
            <div className="col-4">
              <img src="/static/img/icon-catalog-begrep.svg" alt="" />
              <br />
              <Link
                title={localization.report.aggregation.public}
                className="mb-3"
                to="/concepts"
              >
                <strong>
                  {conceptStats.total} {localization.report.concepts}
                </strong>
              </Link>
              <br />
              <Link
                title={localization.report.aggregation.public}
                className="mb-3"
                to="/concepts?firstHarvested=7"
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
  catalogs: null
};

ReportStats.propTypes = {
  fetchCatalogsIfNeeded: PropTypes.func,
  datasetStats: PropTypes.object.isRequired,
  apiStats: PropTypes.object.isRequired,
  conceptStats: PropTypes.object.isRequired,
  entityName: PropTypes.string,
  catalogs: PropTypes.object
};
