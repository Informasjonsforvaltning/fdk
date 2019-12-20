import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import localization from '../../../../lib/localization';
import '../report-stats.scss';
import { StatBox } from '../stat-box/stat-box.component';

export const APIStats = props => {
  const { stats, orgPath } = props;

  if (!stats) {
    return null;
  }

  const encodedOrgPath = orgPath ? encodeURIComponent(orgPath) : null;
  const orgPathParam =
    encodedOrgPath !== null ? `&orgPath=${encodedOrgPath}` : '';

  const openApi = (
    <div className="d-flex flex-column flex-fill py-5">
      <StatBox label={localization.report.aggregation.apiOpenForAll}>
        <img src="/img/icon-api-access-all.svg" alt="icon" />
        <Link
          title={localization.report.aggregation.apiOpenForAll}
          className="mb-3"
          to={`/apis?isOpenAccess=true${orgPathParam}`}
        >
          {stats.openAccess}
        </Link>
      </StatBox>

      <StatBox label={localization.report.aggregation.apiNotOpenForAll}>
        <img src="/img/icon-api-access-limited.svg" alt="icon" />
        <Link
          title={localization.report.aggregation.apiNotOpenForAll}
          className="mb-3"
          to={`/apis?isOpenAccess=false${orgPathParam}`}
        >
          {stats.notOpenAccess}
        </Link>
      </StatBox>
    </div>
  );

  const license = (
    <div className="d-flex flex-column flex-fill py-5">
      <StatBox label={localization.report.aggregation.apiOpenLicense}>
        <img src="/img/icon-api-license-open.svg" alt="icon" />
        <Link
          title={localization.report.aggregation.apiOpenLicense}
          className="mb-3"
          to={`/apis?isOpenLicense=true${orgPathParam}`}
        >
          {stats.openLicense}
        </Link>
      </StatBox>

      <StatBox label={localization.report.aggregation.apiNotOpenLicense}>
        <img src="/img/icon-api-license-not-open.svg" alt="icon" />
        <Link
          title={localization.report.aggregation.apiNotOpenLicense}
          className="mb-3"
          to={`/apis?isOpenLicense=false${orgPathParam}`}
        >
          {stats.notOpenLicense}
        </Link>
      </StatBox>
    </div>
  );

  const freeUsage = (
    <div className="d-flex flex-column flex-fill py-5">
      <StatBox label={localization.report.aggregation.apiFreeUsage}>
        <img src="/img/icon-api-cost-none.svg" alt="icon" />
        <Link
          title={localization.report.aggregation.apiFreeUsage}
          className="mb-3"
          to={`/apis?isFree=true${orgPathParam}`}
        >
          {stats.freeUsage}
        </Link>
      </StatBox>

      <StatBox label={localization.report.aggregation.apiNotFreeUsage}>
        <img src="/img/icon-api-cost.svg" alt="icon" />
        <Link
          title={localization.report.aggregation.apiNotFreeUsage}
          className="mb-3"
          to={`/apis?isFree=false${orgPathParam}`}
        >
          {stats.notFreeUsage}
        </Link>
      </StatBox>
    </div>
  );

  const formatListItem = stats.formatCounts.map(formatRecord => (
    <div
      className="d-flex justify-content-between fdk-bg-color-neutral-lightest rounded p-4 mb-1"
      key={formatRecord.key}
    >
      <div>
        {formatRecord.key === 'MISSING'
          ? localization.unknown
          : formatRecord.key}
      </div>
      <div>
        <strong>
          <Link
            title={localization.page.datasetTab}
            className="fdk-plain-label"
            to={`/apis?format=${formatRecord.key}${orgPathParam}`}
          >
            {formatRecord.count}
          </Link>
        </strong>
      </div>
    </div>
  ));

  const formatList = (
    <div className="d-flex flex-column p-5 border-top">
      <div className="d-flex mt-5 mb-5 justify-content-center">
        <strong>{localization.report.distributionFormat}</strong>
      </div>
      <div className="d-flex justify-content-between fdk-bg-color-neutral-darkest fdk-color-white rounded p-4 mb-1">
        <div>{localization.format}</div>
        <div>{localization.report.apis}</div>
      </div>
      {formatListItem}
    </div>
  );

  return (
    <div className="px-0 fdk-container-stats">
      <div className="d-flex">
        {openApi}
        {license}
        {freeUsage}
      </div>
      {formatList}
    </div>
  );
};

APIStats.defaultProps = {
  stats: null,
  orgPath: null
};

APIStats.propTypes = {
  stats: PropTypes.object,
  orgPath: PropTypes.string
};
