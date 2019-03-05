import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import PieChart from 'react-minimal-pie-chart';

import localization from '../../../lib/localization';
import { getParamFromLocation } from '../../../lib/addOrReplaceUrlParam';
import './report-stats.scss';
import { getTranslateText } from '../../../lib/translateText';
import { StatBox } from './stat-box/stat-box.component';
import { ChartBar } from './chart-bar/chart-bar.component';

const calculatePercent = (number, total) => {
  const calculatedValue = (number / total) * 100;
  if (calculatedValue === 0) {
    return calculatedValue;
  } else if (calculatedValue < 1) {
    return 1;
  }
  return calculatedValue;
};

const calculateSize = (number, total) => {
  const calculatedValue = (number / total) * 100;
  if (calculatedValue < 25) {
    return 'small';
  } else if (calculatedValue >= 25 && calculatedValue < 50) {
    return 'medium';
  } else if (calculatedValue >= 50 && calculatedValue < 75) {
    return 'large';
  }
  return 'xlarge';
};

export const ReportStats = props => {
  props.fetchCatalogsIfNeeded();

  const { stats, entityName } = props;

  const orgPath = getParamFromLocation(window.location, 'orgPath');
  const encodedOrgPath = orgPath ? encodeURIComponent(orgPath) : null;
  const orgPathParam =
    encodedOrgPath !== null ? `&orgPath=${encodedOrgPath}` : '';

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

  const accessLevel = (
    <div className="d-flex flex-wrap flex-md-nowrap justify-content-around mb-5">
      <StatBox
        componentKey={`PUBLIC-${orgPath}`}
        statBoxStyle="w-25"
        iconBgSize={calculateSize(stats.public, stats.total)}
        iconBgColor="green"
        iconType="lock"
        iconColor="green"
        label={localization.report.public}
      >
        <Link
          title={localization.report.public}
          className="mb-3"
          to={`/?accessrights=PUBLIC${orgPathParam}`}
        >
          {stats.public}
        </Link>
      </StatBox>
      <StatBox
        componentKey={`RESTRICTED-${orgPath}`}
        statBoxStyle="w-25"
        iconBgSize={calculateSize(stats.restricted, stats.total)}
        iconBgColor="green"
        iconType="lock"
        iconColor="green"
        label={localization.report.restricted}
      >
        <Link
          title={localization.report.restricted}
          className="mb-3"
          to={`/?accessrights=RESTRICTED${orgPathParam}`}
        >
          {stats.restricted}
        </Link>
      </StatBox>
      <StatBox
        componentKey={`NONPUBLIC-${orgPath}`}
        statBoxStyle="w-25"
        iconBgSize={calculateSize(stats.nonPublic, stats.total)}
        iconBgColor="yellow"
        iconType="unlock"
        iconColor="yellow"
        label={localization.report.nonPublic}
      >
        <Link
          title={localization.report.nonPublic}
          className="mb-3"
          to={`/?accessrights=NON_PUBLIC${orgPathParam}`}
        >
          {stats.nonPublic}
        </Link>
      </StatBox>
      <StatBox
        componentKey={`UNKNOWN-${orgPath}`}
        statBoxStyle="w-25"
        iconBgSize={calculateSize(stats.unknown, stats.total)}
        iconBgColor="red"
        iconType="lock"
        iconColor="red"
        label={localization.report.unknown}
      >
        <Link
          title={localization.report.unknown}
          className="mb-3"
          to={`/?accessrights=Ukjent${orgPathParam}`}
        >
          {stats.unknown}
        </Link>
      </StatBox>
    </div>
  );

  const opendata = (
    <div className="d-flex flex-fill mb-5">
      <StatBox
        pieData={[
          { value: stats.opendata, color: '#3CBEF0' },
          { value: stats.total - stats.opendata, color: '#AAE6FF' }
        ]}
      >
        <Link
          title={localization.report.openDataset}
          className="mb-3"
          to={`/?opendata=true${orgPathParam}`}
        >
          <span>{stats.opendata}</span>
          <span>/{stats.total}</span>
        </Link>
        <span>{localization.report.openDataset}</span>
        <div className="mt-3">{localization.report.openDatasetDescription}</div>
      </StatBox>
    </div>
  );

  const distributions = (
    <div className="d-flex flex-fill mb-5 border-top">
      <StatBox statBoxStyle="w-25" label={localization.report.nonPublic}>
        <ChartBar
          componentKey={`withDistribution-${orgPath}`}
          percentHeight={calculatePercent(
            stats.distOnPublicAccessCount,
            stats.public
          )}
          barColor="green"
        />
        <Link
          title={localization.report.withDistributions}
          className="mb-3"
          to="/#"
        >
          {stats.distOnPublicAccessCount}
        </Link>
      </StatBox>

      <StatBox
        statBoxStyle="w-25"
        label={localization.report.withoutDistributions}
      >
        <ChartBar
          componentKey={`withoutDistribution-${orgPath}`}
          percentHeight={calculatePercent(
            stats.public - stats.distOnPublicAccessCount,
            stats.public
          )}
          barColor="green"
        />
        <Link
          title={localization.report.withoutDistributions}
          className="mb-3"
          to="/#"
        >
          {stats.public - stats.distOnPublicAccessCount}
        </Link>
      </StatBox>
    </div>
  );

  const concepts = (
    <div className="d-flex flex-fill mb-5 border-top">
      <StatBox
        statBoxStyle="w-25"
        iconType="book"
        iconColor="blue"
        label={localization.report.withConcepts}
      >
        <Link title={localization.report.withConcepts} className="mb-3" to="/#">
          {stats.subjectCount}
        </Link>
      </StatBox>

      <PieChart
        className="d-flex p-4 w-25"
        data={[
          { value: stats.subjectCount, color: '#3CBEF0' },
          { value: stats.total - stats.subjectCount, color: '#AAE6FF' }
        ]}
        startAngle={0}
        lineWidth={45}
        animate
      />

      <StatBox
        statBoxStyle="w-25"
        iconType="book"
        iconColor="grey"
        label={localization.report.withoutConcepts}
      >
        <Link
          title={localization.report.withoutConcepts}
          className="mb-3"
          to="/#"
        >
          {stats.total - stats.subjectCount}
        </Link>
      </StatBox>
    </div>
  );

  const catalogs = (
    <div className="row">
      <div className="col-12 fdk-container-stats fdk-container-stats-concepts-title">
        <h2>{localization.report.catalogs}</h2>
        {stats.catalogCounts.map(catalogRecord => (
          <div className="row" key={catalogRecord.key}>
            <div className="col-10">
              {getTranslateText(
                _.get(props.catalogs, [catalogRecord.key, 'title'])
              )}
            </div>
            <div className="col-2 text-right">
              <strong>
                <Link
                  title={localization.report.newDatasets}
                  className="fdk-plain-label"
                  to={`/?catalog=${catalogRecord.key}${orgPathParam}`}
                >
                  {catalogRecord.count}
                </Link>
              </strong>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="container">
      {title}

      <div className="row px-0 fdk-container-stats">
        {accessLevel}
        {opendata}
        {distributions}
        {concepts}
      </div>

      {catalogs}
    </div>
  );
};

ReportStats.defaultProps = {
  fetchCatalogsIfNeeded: _.noop
};

ReportStats.propTypes = {
  fetchCatalogsIfNeeded: PropTypes.func,
  stats: PropTypes.object.isRequired
};
