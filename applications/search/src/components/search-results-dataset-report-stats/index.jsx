import React from 'react';
import './index.scss';
import localization from '../localization';

const ReportStats = (props) => {
  const {
    aggregateDataset,
    entity,
    catalog
  } = props;

  const stats = {
    total: (aggregateDataset.hits) ? aggregateDataset.hits.total : 0,
    public: (aggregateDataset.aggregations && aggregateDataset.aggregations.accessRightsCount.buckets.find(bucket => bucket.key.toUpperCase() === 'PUBLIC')) ?
      aggregateDataset.aggregations.accessRightsCount.buckets.find(bucket => bucket.key.toUpperCase() === 'PUBLIC').doc_count : 0,
    restricted: (aggregateDataset.aggregations && aggregateDataset.aggregations.accessRightsCount.buckets.find(bucket => bucket.key.toUpperCase() === 'RESTRICTED')) ?
      aggregateDataset.aggregations.accessRightsCount.buckets.find(bucket => bucket.key.toUpperCase() === 'RESTRICTED').doc_count : 0,
    nonPublic: (aggregateDataset.aggregations && aggregateDataset.aggregations.accessRightsCount.buckets.find(bucket => bucket.key.toUpperCase() === 'NON_PUBLIC')) ?
      aggregateDataset.aggregations.accessRightsCount.buckets.find(bucket => bucket.key.toUpperCase() === 'NON_PUBLIC').doc_count : 0,
    unknown: (aggregateDataset.aggregations && aggregateDataset.aggregations.accessRightsCount.buckets.find(bucket => bucket.key.toUpperCase() === 'UKJENT')) ?
      aggregateDataset.aggregations.accessRightsCount.buckets.find(bucket => bucket.key.toUpperCase() === 'UKJENT').doc_count : 0,
    newLastWeek: catalog.aggregations && catalog.aggregations.last7days.inserts ?
      catalog.aggregations && catalog.aggregations.last7days.inserts.value : 0,
    deletedLastWeek: catalog.aggregations && catalog.aggregations.last7days.deletes ?
      catalog.aggregations && catalog.aggregations.last7days.deletes.value : 0,
    newLastMonth: catalog.aggregations && catalog.aggregations.last30days.inserts ?
      catalog.aggregations && catalog.aggregations.last30days.inserts.value : 0,
    deletedLastMonth: catalog.aggregations && catalog.aggregations.last30days.deletes ?
      catalog.aggregations && catalog.aggregations.last30days.deletes.value : 0,
    newLastYear: catalog.aggregations && catalog.aggregations.last365days.inserts ?
      catalog.aggregations && catalog.aggregations.last365days.inserts.value : 0,
    deletedLastYear: catalog.aggregations && catalog.aggregations.last365days.deletes ?
      catalog.aggregations && catalog.aggregations.last365days.deletes.value : 0,
    withoutConcepts: (aggregateDataset.aggregations && aggregateDataset.aggregations.subjectsCount && aggregateDataset.aggregations.subjectCount.doc_count) ? aggregateDataset.aggregations.subjectCount.doc_count : 0,
    distributions: (aggregateDataset.aggregations && aggregateDataset.aggregations.distCount && aggregateDataset.aggregations.distCount.doc_count) ? aggregateDataset.aggregations.distCount.doc_count : 0,
    distOnPublicAccessCount: (aggregateDataset.aggregations && aggregateDataset.aggregations.distOnPublicAccessCount && aggregateDataset.aggregations.distOnPublicAccessCount.doc_count) ? aggregateDataset.aggregations.distOnPublicAccessCount.doc_count : 0,
    subjectCount: (aggregateDataset.aggregations && aggregateDataset.aggregations.subjectCount && aggregateDataset.aggregations.subjectCount.doc_count) ? aggregateDataset.aggregations.subjectCount.doc_count : 0
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
            <p><strong>{stats.subjectCount}</strong></p>
            <p>{localization.report.withConcepts}</p>
          </div>
          <div className="col-md-6">
            <p><strong>{stats.total - stats.subjectCount}</strong></p>
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
            <p><strong>{stats.distOnPublicAccessCount}</strong></p>
            <p>{localization.report.withDistributions}</p>
          </div>
          <div className="col-md-6">
            <p><strong>{stats.public - stats.distOnPublicAccessCount}</strong></p>
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
