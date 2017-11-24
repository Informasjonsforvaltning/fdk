import React from 'react';
import './index.scss';
import localization from '../localization';

const ReportStats = (props) => {
  const {
    aggregateDataset,
    stats,
    entity
  } = props;

  const title = (
    <div className="row">
      <div className="fdk-container fdk-container-stats">
        <h2>{localization.report.title}<strong>{entity}</strong></h2>
      </div>
    </div>
  );

  const total = (
    <div className="row">
      <div className="fdk-container fdk-container-stats fdk-container-stats-total">
        <h1><strong>{aggregateDataset.hits && aggregateDataset.hits.total}</strong></h1>
        <h1>{localization.report.total}</h1>
      </div>
    </div>
  );

  const accessLevel = (
    <div className="row">
      <div className="fdk-container fdk-container-stats fdk-container-stats-accesslevel-title">
        <h2>{localization.report.accessLevel}</h2>
        <div className="row">
          <div className="col-md-3 fdk-container-stats-accesslevel fdk-container-stats-vr">
            <p><strong><i className="fa fdk-fa-left fa-unlock fdk-color-green" />{stats.public}</strong></p>
            <p>{localization.report.public}</p>
          </div>
          <div className="col-md-3 fdk-container-stats-accesslevel fdk-container-stats-vr">
            <p><strong> <i className="fa fdk-fa-left fa-unlock-alt fdk-color-yellow" />{stats.restricted}</strong></p>
            <p>{localization.report.restricted}</p>
          </div>
          <div className="col-md-3 fdk-container-stats-accesslevel fdk-container-stats-vr">
            <p><strong><i className="fa fdk-fa-left fa-lock fdk-color-red" />{stats.nonPublic}</strong></p>
            <p>{localization.report.nonPublic}</p>
          </div>
          <div className="col-md-3 fdk-container-stats-accesslevel">
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
        <div className="fdk-container fdk-container-stats fdk-container-stats-changes">
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
        <div className="fdk-container fdk-container-stats fdk-container-stats-changes">
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
        <div className="fdk-container fdk-container-stats fdk-container-stats-changes">
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
      <div className="fdk-container fdk-container-stats fdk-container-stats-concepts-title">
        <h2>{localization.report.concepts}</h2>
        <div className="row fdk-container-stats-concepts">
          <div className="col-md-6 fdk-container-stats-vr">
            <p><strong>{stats.concepts}</strong></p>
            <p>{localization.report.withConcepts}</p>
          </div>
          <div className="col-md-6">
            <p><strong>{stats.total - stats.concepts}</strong></p>
            <p>{localization.report.withoutConcepts}</p>
          </div>
        </div>
      </div>
    </div>
  );

  const distributions = (
    <div className="row">
      <div className="fdk-container fdk-container-stats fdk-container-stats-concepts-title">
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
