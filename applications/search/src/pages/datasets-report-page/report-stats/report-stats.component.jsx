import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { CardDeck, Card, CardText, CardBody } from 'reactstrap';

import localization from '../../../lib/localization';
import { getParamFromLocation } from '../../../lib/addOrReplaceUrlParam';
import './report-stats.scss';
import { getTranslateText } from '../../../lib/translateText';

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
    <div className="row">
      <div className="col-12 fdk-container-stats">
        <h2>
          {localization.report.title}
          <strong>{name}</strong>
        </h2>
      </div>
    </div>
  );

  const total = (
    <div className="row">
      <div className="col-12 fdk-container-stats fdk-container-stats-total">
        <h1>
          <strong>
            <Link to={orgPath ? `/?orgPath=${encodedOrgPath}` : '/'}>
              {stats.total}
            </Link>
          </strong>
        </h1>
        <h1>{localization.report.total}</h1>
      </div>
    </div>
  );

  const accessLevel = (
    <div className="row">
      <div className="col-12 fdk-container-stats fdk-container-stats-accesslevel-title">
        <h2>{localization.report.accessLevel}</h2>
        <div className="row">
          <Link
            title={localization.report.public}
            className="col-lg-3 fdk-container-stats-accesslevel fdk-container-stats-vr p-0"
            to={`/?accessrights=PUBLIC${orgPathParam}`}
          >
            <p>
              <strong>
                <i className="fa fdk-fa-left fa-unlock fdk-color-offentlig" />
                {stats.public}
              </strong>
            </p>
            <p>{localization.report.public}</p>
          </Link>
          <Link
            title={localization.report.restricted}
            className="col-lg-3 fdk-container-stats-accesslevel fdk-container-stats-vr p-0"
            to={`/?accessrights=RESTRICTED${orgPathParam}`}
          >
            <p>
              <strong>
                {' '}
                <i className="fa fdk-fa-left fa-unlock-alt fdk-color-begrenset" />
                {stats.restricted}
              </strong>
            </p>
            <p>{localization.report.restricted}</p>
          </Link>
          <Link
            className="col-lg-3 fdk-container-stats-accesslevel fdk-container-stats-vr p-0"
            to={`/?accessrights=NON_PUBLIC${orgPathParam}`}
          >
            <p>
              <strong>
                <i className="fa fdk-fa-left fa-lock fdk-color-unntatt" />
                {stats.nonPublic}
              </strong>
            </p>
            <p>{localization.report.nonPublic}</p>
          </Link>
          <Link
            className="col-lg-3 fdk-container-stats-accesslevel p-0"
            to={`/?accessrights=Ukjent${orgPathParam}`}
          >
            <p>
              <strong>
                <i className="fa fdk-fa-left fa-question fdk-color4" />
                {stats.unknown}
              </strong>
            </p>
            <p>{localization.report.unknown}</p>
          </Link>
        </div>
      </div>
    </div>
  );

  const opendata = (
    <div className="row">
      <div className="col-12 fdk-container-stats fdk-container-stats-concepts-title">
        <h2>{localization.report.openData}</h2>
        <div className="fdk-container-stats-concepts">
          <Link
            className="fdk-container-stats-accesslevel"
            to={`/?opendata=true${orgPathParam}`}
          >
            <p>
              <strong>{stats.opendata}</strong>
            </p>
          </Link>
        </div>
      </div>
    </div>
  );

  const changes = (
    <div className="row mb-3">
      <div className="col-12 p-0">
        <CardDeck>
          <Card
            className="fdk-container-stats fdk-container-stats-changes"
            style={{ borderColor: 'transparent' }}
          >
            <CardBody>
              <h2>{localization.report.changesLastWeek}</h2>
              <CardText>
                <strong>
                  <Link
                    title={localization.report.newDatasets}
                    className="fdk-plain-label"
                    to={`/?firstHarvested=7${orgPathParam}`}
                  >
                    {stats.newLastWeek}
                  </Link>
                </strong>
              </CardText>
              <CardText>{localization.report.newDatasets}</CardText>
            </CardBody>
          </Card>
          <Card
            className="fdk-container-stats fdk-container-stats-changes"
            style={{ borderColor: 'transparent' }}
          >
            <CardBody>
              <h2>{localization.report.changesLastMonth}</h2>
              <CardText>
                <strong>
                  <Link
                    title={localization.report.newDatasets}
                    className="fdk-plain-label"
                    to={`/?firstHarvested=30${orgPathParam}`}
                  >
                    {stats.newLastMonth}
                  </Link>
                </strong>
              </CardText>
              <CardText>{localization.report.newDatasets}</CardText>
            </CardBody>
          </Card>
          <Card
            className="fdk-container-stats fdk-container-stats-changes"
            style={{ borderColor: 'transparent' }}
          >
            <CardBody>
              <h2>{localization.report.changesLastYear}</h2>
              <CardText>
                <strong>
                  <Link
                    title={localization.report.newDatasets}
                    className="fdk-plain-label"
                    to={`/?firstHarvested=365${orgPathParam}`}
                  >
                    {stats.newLastYear}
                  </Link>
                </strong>
              </CardText>
              <CardText>{localization.report.newDatasets}</CardText>
            </CardBody>
          </Card>
        </CardDeck>
      </div>
    </div>
  );

  const concepts = (
    <div className="row">
      <div className="col-12 fdk-container-stats fdk-container-stats-concepts-title">
        <h2>{localization.report.concepts}</h2>
        <div className="row fdk-container-stats-concepts">
          <div className="col-lg-6 fdk-container-stats-vr">
            <p>
              <strong>{stats.subjectCount}</strong>
            </p>
            <p>{localization.report.withConcepts}</p>
          </div>
          <div className="col-lg-6">
            <p>
              <strong>{stats.total - stats.subjectCount}</strong>
            </p>
            <p>{localization.report.withoutConcepts}</p>
          </div>
        </div>
      </div>
    </div>
  );

  const distributions = (
    <div className="row">
      <div className="col-12 fdk-container-stats fdk-container-stats-concepts-title">
        <h2>{localization.report.distributions}</h2>
        <div className="row fdk-container-stats-concepts">
          <div className="col-lg-6 fdk-container-stats-vr">
            <p>
              <strong>{stats.distOnPublicAccessCount}</strong>
            </p>
            <p>{localization.report.withDistributions}</p>
          </div>
          <div className="col-lg-6">
            <p>
              <strong>{stats.public - stats.distOnPublicAccessCount}</strong>
            </p>
            <p>{localization.report.withoutDistributions}</p>
          </div>
        </div>
      </div>
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
      {total}
      {accessLevel}
      {opendata}
      {changes}
      {concepts}
      {distributions}
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
