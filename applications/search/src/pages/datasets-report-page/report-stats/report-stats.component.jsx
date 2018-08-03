import * as _ from 'lodash';
import React from 'react';
import { Link } from 'react-router-dom';
import _capitalize from 'lodash/capitalize';
import { CardDeck, Card, CardText, CardBody } from 'reactstrap';

import localization from '../../../lib/localization';
import { getParamFromLocation } from '../../../lib/addOrReplaceUrlParam';
import './report-stats.scss';

export const ReportStats = props => {
  const { aggregateDataset, entityName } = props;
  // const { entityName } = props;
  // const aggregateDataset = require('../../../../api-mocks/aggregateDataset_opendata.json')
  const stats = {
    total: aggregateDataset.hits ? aggregateDataset.hits.total : 0,
    public:
      aggregateDataset.aggregations &&
      aggregateDataset.aggregations.accessRightsCount.buckets.find(
        bucket => bucket.key.toUpperCase() === 'PUBLIC'
      )
        ? aggregateDataset.aggregations.accessRightsCount.buckets.find(
            bucket => bucket.key.toUpperCase() === 'PUBLIC'
          ).doc_count
        : 0,
    restricted:
      aggregateDataset.aggregations &&
      aggregateDataset.aggregations.accessRightsCount.buckets.find(
        bucket => bucket.key.toUpperCase() === 'RESTRICTED'
      )
        ? aggregateDataset.aggregations.accessRightsCount.buckets.find(
            bucket => bucket.key.toUpperCase() === 'RESTRICTED'
          ).doc_count
        : 0,
    nonPublic:
      aggregateDataset.aggregations &&
      aggregateDataset.aggregations.accessRightsCount.buckets.find(
        bucket => bucket.key.toUpperCase() === 'NON_PUBLIC'
      )
        ? aggregateDataset.aggregations.accessRightsCount.buckets.find(
            bucket => bucket.key.toUpperCase() === 'NON_PUBLIC'
          ).doc_count
        : 0,
    unknown:
      aggregateDataset.aggregations &&
      aggregateDataset.aggregations.accessRightsCount.buckets.find(
        bucket => bucket.key.toUpperCase() === 'UKJENT'
      )
        ? aggregateDataset.aggregations.accessRightsCount.buckets.find(
            bucket => bucket.key.toUpperCase() === 'UKJENT'
          ).doc_count
        : 0,
    opendata: _.get(aggregateDataset, 'aggregations.opendata.doc_count', 0),
    newLastWeek:
      aggregateDataset.aggregations &&
      aggregateDataset.aggregations.firstHarvested.buckets &&
      aggregateDataset.aggregations.firstHarvested.buckets.last7days
        ? aggregateDataset.aggregations.firstHarvested.buckets.last7days
            .doc_count
        : 0,

    newLastMonth:
      aggregateDataset.aggregations &&
      aggregateDataset.aggregations.firstHarvested.buckets &&
      aggregateDataset.aggregations.firstHarvested.buckets.last30days
        ? aggregateDataset.aggregations.firstHarvested.buckets.last30days
            .doc_count
        : 0,

    newLastYear:
      aggregateDataset.aggregations &&
      aggregateDataset.aggregations.firstHarvested.buckets &&
      aggregateDataset.aggregations.firstHarvested.buckets.last365days
        ? aggregateDataset.aggregations.firstHarvested.buckets.last365days
            .doc_count
        : 0,

    withoutConcepts:
      aggregateDataset.aggregations &&
      aggregateDataset.aggregations.subjectsCount &&
      aggregateDataset.aggregations.subjectCount.doc_count
        ? aggregateDataset.aggregations.subjectCount.doc_count
        : 0,
    distributions:
      aggregateDataset.aggregations &&
      aggregateDataset.aggregations.distCount &&
      aggregateDataset.aggregations.distCount.doc_count
        ? aggregateDataset.aggregations.distCount.doc_count
        : 0,
    distOnPublicAccessCount:
      aggregateDataset.aggregations &&
      aggregateDataset.aggregations.distOnPublicAccessCount &&
      aggregateDataset.aggregations.distOnPublicAccessCount.doc_count
        ? aggregateDataset.aggregations.distOnPublicAccessCount.doc_count
        : 0,
    subjectCount:
      aggregateDataset.aggregations &&
      aggregateDataset.aggregations.subjectCount &&
      aggregateDataset.aggregations.subjectCount.doc_count
        ? aggregateDataset.aggregations.subjectCount.doc_count
        : 0
  };

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
        : _capitalize(entityName);
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
            className="col-lg-3 fdk-container-stats-accesslevel fdk-container-stats-vr fdk-padding-no"
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
            className="col-lg-3 fdk-container-stats-accesslevel fdk-container-stats-vr fdk-padding-no"
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
            className="col-lg-3 fdk-container-stats-accesslevel fdk-container-stats-vr fdk-padding-no"
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
            className="col-lg-3 fdk-container-stats-accesslevel fdk-padding-no"
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
                <div>{localization.report.newDatasets}</div>
              </CardText>
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
                    title={localization.report.deletedLastMonth}
                    className="fdk-plain-label"
                    to={`/?firstHarvested=30${orgPathParam}`}
                  >
                    {stats.newLastMonth}
                  </Link>
                </strong>
                <div>{localization.report.newDatasets}</div>
              </CardText>
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
                <div>{localization.report.newDatasets}</div>
              </CardText>
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

  return (
    <div className="container">
      {title}
      {total}
      {accessLevel}
      {opendata}
      {changes}
      {concepts}
      {distributions}
    </div>
  );
};
