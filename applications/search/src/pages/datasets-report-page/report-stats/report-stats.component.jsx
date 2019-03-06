import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';

import localization from '../../../lib/localization';
import { getParamFromLocation } from '../../../lib/addOrReplaceUrlParam';
import { DatasetStats } from './dataset-stats/dataset-stats.component';
import { Tabs } from '../../../components/tabs/tabs.component';
import './report-stats.scss';

export const ReportStats = props => {
  const { stats, entityName, catalogs, fetchCatalogsIfNeeded } = props;
  const orgPath = getParamFromLocation(window.location, 'orgPath');

  fetchCatalogsIfNeeded();

  let name;
  if (entityName) {
    name =
      entityName === 'STAT' ||
      entityName === 'FYLKE' ||
      entityName === 'KOMMUNE' ||
      entityName === 'PRIVAT' ||
      entityName === 'ANNET'
        ? localization.facet.publishers[entityName]
        : _.capitalize(entityName);
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
        <div className="col-12 fdk-report-tabs">
          <Tabs
            tabContent={[
              {
                title: localization.report.datasetTab,
                body: (
                  <DatasetStats
                    stats={stats}
                    orgPath={orgPath}
                    catalogs={catalogs}
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
  stats: PropTypes.object.isRequired,
  entityName: PropTypes.string,
  catalogs: PropTypes.object
};
