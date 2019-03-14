import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import PieChart from 'react-minimal-pie-chart';

import localization from '../../../../lib/localization';
import '../report-stats.scss';
import { getTranslateText } from '../../../../lib/translateText';
import { StatBox } from '../stat-box/stat-box.component';
import { ChartBar } from '../chart-bar/chart-bar.component';

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

export const DatasetStats = props => {
  const { stats, orgPath, catalogs } = props;

  if (!stats) {
    return null;
  }

  const encodedOrgPath = orgPath ? encodeURIComponent(orgPath) : null;
  const orgPathParam =
    encodedOrgPath !== null ? `&orgPath=${encodedOrgPath}` : '';

  const accessLevel = (
    <div className="d-flex flex-wrap flex-md-nowrap justify-content-around py-5">
      <StatBox
        componentKey={`PUBLIC-${orgPath}`}
        statBoxStyle="w-25"
        iconBgSize={calculateSize(stats.public, stats.total)}
        iconBgColor="green"
        iconType="unlock"
        iconColor="green"
        label={localization.report.aggregation.public}
      >
        <Link
          title={localization.report.aggregation.public}
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
        iconBgColor="yellow"
        iconType="unlock-alt"
        iconColor="yellow"
        label={localization.report.aggregation.restricted}
      >
        <Link
          title={localization.report.aggregation.restricted}
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
        iconBgColor="red"
        iconType="lock"
        iconColor="red"
        label={localization.report.aggregation.nonPublic}
      >
        <Link
          title={localization.report.aggregation.nonPublic}
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
        iconBgColor="grey"
        iconType="question"
        iconColor="dark"
        label={localization.report.aggregation.accessRightsUnknown}
      >
        <Link
          title={localization.report.aggregation.accessRightsUnknown}
          className="mb-3"
          to={`/?accessrights=Ukjent${orgPathParam}`}
        >
          {stats.unknown}
        </Link>
      </StatBox>
    </div>
  );

  const opendata = (
    <div className="d-flex flex-fill py-5">
      <StatBox
        pieData={[
          { value: stats.opendata, color: '#3CBEF0' },
          { value: stats.total - stats.opendata, color: '#AAE6FF' }
        ]}
      >
        <Link
          title={localization.report.aggregation.openDataset}
          className="mb-3"
          to={`/?opendata=true${orgPathParam}`}
        >
          <span>{stats.opendata}</span>
          <span>/{stats.total}</span>
        </Link>
        <span>{localization.report.aggregation.openDataset}</span>
        <div className="mt-3">
          {localization.report.aggregation.openDatasetDescription}
        </div>
      </StatBox>
    </div>
  );

  const distributions = (
    <React.Fragment>
      <div className="d-flex flex-fill py-5 border-top flex-wrap flex-md-nowrap">
        <StatBox
          label={localization.report.aggregation.publicWithDistributions}
        >
          <ChartBar
            componentKey={`withDistribution-${orgPath}`}
            percentHeight={calculatePercent(
              stats.distOnPublicAccessCount,
              stats.total
            )}
            barColor="green"
          />
          <Link
            title={localization.report.aggregation.publicWithDistributions}
            className="mb-3"
            to="/#"
          >
            {stats.distOnPublicAccessCount}
          </Link>
        </StatBox>

        <StatBox
          label={localization.report.aggregation.publicWithoutDistributions}
        >
          <ChartBar
            componentKey={`withoutDistribution-${orgPath}`}
            percentHeight={calculatePercent(
              stats.total - stats.distOnPublicAccessCount,
              stats.total
            )}
            barColor="green"
          />
          <Link
            title={localization.report.aggregation.publicWithoutDistributions}
            className="mb-3"
            to="/#"
          >
            {stats.total - stats.distOnPublicAccessCount}
          </Link>
        </StatBox>

        <StatBox
          label={
            localization.report.aggregation.restrictedDatasetWithDistributions
          }
        >
          <ChartBar
            componentKey={`restricedDatasetwithDistribution-${orgPath}`}
            percentHeight={calculatePercent(
              stats.restrictedDatasetWithDist,
              stats.total
            )}
            barColor="yellow"
          />
          <Link
            title={
              localization.report.aggregation.restrictedDatasetWithDistributions
            }
            className="mb-3"
            to="/#"
          >
            {stats.restrictedDatasetWithDist}
          </Link>
        </StatBox>

        <StatBox
          label={
            localization.report.aggregation
              .restrictedDatasetWithoutDistributions
          }
        >
          <ChartBar
            componentKey={`restricedDatasetwithDistribution-${orgPath}`}
            percentHeight={calculatePercent(
              stats.restrictedDatasetWithoutDist,
              stats.total
            )}
            barColor="yellow"
          />
          <Link
            title={
              localization.report.aggregation
                .restrictedDatasetWithoutDistributions
            }
            className="mb-3"
            to="/#"
          >
            {stats.restrictedDatasetWithoutDist}
          </Link>
        </StatBox>
      </div>
      <div className="d-flex flex-fill py-5">
        <StatBox label={localization.report.apis}>
          <img src="/static/img/icon-report-api.svg" alt="icon" />
          <Link title={localization.report.apis} className="mb-3" to="/#">
            {stats.distOnPublicAccessCount}
          </Link>
        </StatBox>

        <StatBox label={localization.report.aggregation.typeFile}>
          <img src="/static/img/icon-report-nedlastbar-fil.svg" alt="icon" />
          <Link
            title={localization.report.aggregation.typeFile}
            className="mb-3"
            to="/#"
          >
            {stats.distributionCountForTypeFile}
          </Link>
        </StatBox>

        <StatBox label={localization.report.aggregation.typeFeed}>
          <img src="/static/img/icon-report-feed.svg" alt="icon" />
          <Link
            title={localization.report.aggregation.typeFeed}
            className="mb-3"
            to="/#"
          >
            {stats.distributionCountForTypeFeed}
          </Link>
        </StatBox>
      </div>
    </React.Fragment>
  );

  const national = (
    <div className="d-flex flex-fill py-5 border-top">
      <StatBox label={localization.report.aggregation.national}>
        <img src="/static/img/icon-authoritative.svg" alt="icon" />
        <Link
          title={localization.report.aggregation.national}
          className="mb-3"
          to="/#"
        >
          {stats.nationalComponent}
        </Link>
      </StatBox>
    </div>
  );

  const concepts = (
    <div className="d-flex flex-fill py-5 border-top">
      <StatBox
        iconType="book"
        iconColor="blue"
        label={localization.report.aggregation.withConcepts}
      >
        <Link
          title={localization.report.aggregation.withConcepts}
          className="mb-3"
          to="/#"
        >
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
        iconType="book"
        iconColor="grey"
        label={localization.report.aggregation.withoutConcepts}
      >
        <Link
          title={localization.report.aggregation.withoutConcepts}
          className="mb-3"
          to="/#"
        >
          {stats.total - stats.subjectCount}
        </Link>
      </StatBox>
    </div>
  );

  const catalogListItem = stats.catalogCounts.map(catalogRecord => (
    <div
      className="d-flex justify-content-between fdk-bg-color-grey-4 rounded p-4 mb-1"
      key={catalogRecord.key}
    >
      <div>
        {getTranslateText(_.get(catalogs, [catalogRecord.key, 'title']))}
      </div>
      <div>
        <strong>
          <Link
            title={localization.page.datasetTab}
            className="fdk-plain-label"
            to={`/?catalog=${catalogRecord.key}${orgPathParam}`}
          >
            {catalogRecord.count}
          </Link>
        </strong>
      </div>
    </div>
  ));

  const catalogList = (
    <div className="d-flex flex-column p-5 border-top">
      <div className="d-flex justify-content-between fdk-bg-color-dark-1 fdk-color-white rounded p-4 mb-1">
        <div>{localization.report.catalogs}</div>
        <div>{localization.datasetLabel}</div>
      </div>
      {catalogListItem}
    </div>
  );

  return (
    <React.Fragment>
      <div className="px-0 fdk-container-stats">
        {accessLevel}
        {opendata}
        {distributions}
        {national}
        {concepts}
        {catalogList}
      </div>
    </React.Fragment>
  );
};

DatasetStats.defaultProps = {
  stats: null,
  orgPath: null,
  catalogs: null
};

DatasetStats.propTypes = {
  stats: PropTypes.object,
  orgPath: PropTypes.string,
  catalogs: PropTypes.object
};
