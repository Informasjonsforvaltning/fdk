import React from 'react';
import './index.scss';
import localization from '../localization';

const ReportStats = (props) => {
  const {
    aggregateDataset,
    entity
  } = props;

  const stats = {
    total: (aggregateDataset.hits) ? aggregateDataset.hits.total : 0,
    public: (aggregateDataset.aggregations && aggregateDataset.aggregations.accessRightsCount.buckets.find(bucket => bucket.key.toUpperCase() === 'PUBLIC')) ?
      aggregateDataset.aggregations.accessRightsCount.buckets.find(bucket => bucket.key.toUpperCase() === 'PUBLIC').doc_count : 0,
    restricted: (aggregateDataset.aggregations && aggregateDataset.aggregations.accessRightsCount.buckets.find(bucket => bucket.key.toUpperCase() === 'RESTRICTED')) ?
      aggregateDataset.aggregations.accessRightsCount.buckets.find(bucket => bucket.key.toUpperCase() === 'RESTRICTED').doc_count : 0,
    nonPublic: (aggregateDataset.aggregations && aggregateDataset.aggregations.accessRightsCount.buckets.find(bucket => bucket.key.toUpperCase() === 'NONPUBLIC')) ?
      aggregateDataset.aggregations.accessRightsCount.buckets.find(bucket => bucket.key.toUpperCase() === 'NONPUBLIC').doc_count : 0,
    unknown: (aggregateDataset.aggregations && aggregateDataset.aggregations.accessRightsCount.buckets.find(bucket => bucket.key.toUpperCase() === 'UKJENT')) ?
      aggregateDataset.aggregations.accessRightsCount.buckets.find(bucket => bucket.key.toUpperCase() === 'UKJENT').doc_count : 0,
    newLastWeek: 0,
    deletedLastWeek: 0,
    newLastMonth: 0,
    deletedLastMonth: 0,
    newLastYear: 0,
    deletedLastYear: 0,
    withoutConcepts: (aggregateDataset.aggregations && aggregateDataset.aggregations.subjectsCount.buckets.find(bucket => bucket.key.toUpperCase() === 'UKJENT')) ?
      aggregateDataset.aggregations.subjectsCount.buckets.find(bucket => bucket.key.toUpperCase() === 'UKJENT').doc_count : 0,
    distributions: (aggregateDataset.aggregations && aggregateDataset.aggregations.distfilter && aggregateDataset.aggregations.distfilter.doc_count) ? aggregateDataset.aggregations.distfilter.doc_count : 0
  };

  const title = (
    <div className="row">
      <div className="fdk-container-stats">
        <h2>{localization.report.title}<strong>{(entity && entity.length > 0) ? entity : localization.report.allEntities}</strong></h2>
      </div>
    </div>
  );

  const total = (
    <div className="row">
      <div className="fdk-container-stats fdk-container-stats-total">
        <h1><strong>{stats.total}</strong></h1>
        <h1>{localization.report.total}</h1>
      </div>
    </div>
  );

  const accessLevel = (
    <div className="row">
      <div className="fdk-container-stats fdk-container-stats-accesslevel-title">
        <h2>{localization.report.accessLevel}</h2>
        <div className="row">
          <div className="col-md-3 fdk-container-stats-accesslevel fdk-container-stats-vr fdk-padding-no">
            <p><strong><i className="fa fdk-fa-left fa-unlock fdk-color-offentlig" />{stats.public}</strong></p>
            <p>{localization.report.public}</p>
          </div>
          <div className="col-md-3 fdk-container-stats-accesslevel fdk-container-stats-vr fdk-padding-no">
            <p><strong> <i className="fa fdk-fa-left fa-unlock-alt fdk-color-begrenset" />{stats.restricted}</strong></p>
            <p>{localization.report.restricted}</p>
          </div>
          <div className="col-md-3 fdk-container-stats-accesslevel fdk-container-stats-vr fdk-padding-no">
            <p><strong><i className="fa fdk-fa-left fa-lock fdk-color-unntatt" />{stats.nonPublic}</strong></p>
            <p>{localization.report.nonPublic}</p>
          </div>
          <div className="col-md-3 fdk-container-stats-accesslevel fdk-padding-no">
            <p><strong><i className="fa fdk-fa-left fa-question fdk-color4" />{stats.unknown}</strong></p>
            <p>{localization.report.unknown}</p>
          </div>
        </div>
      </div>
    </div>
  );

  const changes = (
    <div className="row">
      <div className="col-md-4 fdk-container-stats-changes-left">
        <div className="fdk-container-stats fdk-container-stats-changes">
          <h2>{localization.report.changesLastWeek}</h2>
          <div className="row">
            <div className="col-sm-6">
              <p><strong>{stats.newLastWeek}</strong></p>
              <p>{localization.report.newDatasets}</p>
            </div>
            <div className="col-sm-6">
              <p className="fdk-deleted-strong"><strong>{stats.deletedLastWeek}</strong></p>
              <p>{localization.report.deletedDatasets}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="col-md-4 fdk-container-stats-changes-middle">
        <div className="fdk-container-stats fdk-container-stats-changes">
          <h2>{localization.report.changesLastMonth}</h2>
          <div className="row">
            <div className="col-sm-6">
              <p><strong>{stats.newLastMonth}</strong></p>
              <p>{localization.report.newDatasets}</p>
            </div>
            <div className="col-sm-6">
              <p className="fdk-deleted-strong"><strong>{stats.deletedLastMonth}</strong></p>
              <p>{localization.report.deletedDatasets}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="col-md-4 fdk-container-stats-changes-right">
        <div className="fdk-container-stats fdk-container-stats-changes">
          <h2>{localization.report.changesLastYear}</h2>
          <div className="row">
            <div className="col-sm-6">
              <p><strong>{stats.newLastYear}</strong></p>
              <p>{localization.report.newDatasets}</p>
            </div>
            <div className="col-sm-6">
              <p className="fdk-deleted-strong"><strong>{stats.deletedLastYear}</strong></p>
              <p>{localization.report.deletedDatasets}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const concepts = (
    <div className="row">
      <div className="fdk-container-stats fdk-container-stats-concepts-title">
        <h2>{localization.report.concepts}</h2>
        <div className="row fdk-container-stats-concepts">
          <div className="col-md-6 fdk-container-stats-vr">
            <p><strong>{stats.total - stats.withoutConcepts}</strong></p>
            <p>{localization.report.withConcepts}</p>
          </div>
          <div className="col-md-6">
            <p><strong>{stats.withoutConcepts}</strong></p>
            <p>{localization.report.withoutConcepts}</p>
          </div>
        </div>
      </div>
    </div>
  );

  const distributions = (
    <div className="row">
      <div className="fdk-container-stats fdk-container-stats-concepts-title">
        <h2>{localization.report.distributions}</h2>
        <div className="row fdk-container-stats-concepts">
          <div className="col-md-6 fdk-container-stats-vr">
            <p><strong>{stats.distributions}</strong></p>
            <p>{localization.report.withDistributions}</p>
          </div>
          <div className="col-md-6">
            <p><strong>{stats.public - stats.distributions}</strong></p>
            <p>{localization.report.withoutDistributions}</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      {title}
      {total}
      {accessLevel}
      {changes}
      {concepts}
      {distributions}
    </div>
  );
}

export default ReportStats;
