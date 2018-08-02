import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import qs from 'qs';

import localization from '../../lib/localization';
import { ReportStats } from './report-stats/report-stats.component';
import { PublishersSelect } from './publishers-select/publishers-select.component';
import { PublishersTree } from './publishers-tree/publishers-tree.component';
import {
  addOrReplaceParamWithoutEncoding,
  removeParam
} from '../../lib/addOrReplaceUrlParam';

export class DatasetsReportPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      entityName: '',
      aggregateDataset: {}
    };
    this.handleOnPublisherSearch = this.handleOnPublisherSearch.bind(this);
    this.handleOnChangeSearchField = this.handleOnChangeSearchField.bind(this);
    this.handleOnTreeChange = this.handleOnTreeChange.bind(this);
    this.handleOnClearSearch = this.handleOnClearSearch.bind(this);
    this.handleOnPublisherSearch();
    this.props.fetchPublishersIfNeeded();
  }

  static getOrgPath() {
    const parsed = qs.parse(window.location.search, {
      ignoreQueryPrefix: true
    });
    return (parsed && parsed.orgPath) || '';
  }

  getName(orgPath) {
    if (!orgPath) {
      return localization.report.allEntities;
    }
    const publisher = this.props.publishers[orgPath];
    return publisher ? publisher.name : orgPath;
  }

  handleOnPublisherSearch(value) {
    const orgPath = value && value.orgPath;

    // Get orgPath from input or try to find from query params.
    const query =
      orgPath !== null && orgPath !== undefined
        ? orgPath
        : DatasetsReportPage.getOrgPath();

    const paramWithRemovedOrgPath = removeParam(
      'orgPath',
      window.location.href
    );
    const replacedUrl = addOrReplaceParamWithoutEncoding(
      paramWithRemovedOrgPath,
      'orgPath',
      query
    );

    // Empty query params.
    const emptyParam = {
      title: document.title,
      url: paramWithRemovedOrgPath
    };
    window.history.pushState(emptyParam, emptyParam.title, emptyParam.url);

    // Set new query param if necessary.
    if (query && orgPath !== '') {
      const queryParam = {
        title: document.title,
        url: replacedUrl
      };
      window.history.pushState(queryParam, queryParam.title, queryParam.url);
    }

    // Get entityName from input or try to find from publishers using orgPath.
    const entityName = this.getName(query);

    axios
      .get(`/aggregateDataset?q=${query}`)
      .then(response => {
        this.setState({
          entityName,
          aggregateDataset: response.data
        });
      })
      .catch(error => {
        console.error(error);
      });
  }

  handleOnChangeSearchField(value) {
    this.setState({
      value
    });
    this.handleOnPublisherSearch(value);
  }

  handleOnTreeChange(value) {
    this.setState({
      value
    });
    this.handleOnPublisherSearch(value);
  }

  handleOnClearSearch() {
    this.setState({
      value: null
    });
    this.handleOnPublisherSearch(null);
  }

  render() {
    return (
      <section className="container">
        <div className="row">
          <div className="col-sm-4">
            <button
              className="fdk-button fdk-button-default-no-hover"
              onClick={this.handleOnClearSearch}
              type="button"
            >
              {localization.query.clear}
            </button>
            <PublishersSelect
              onChange={this.handleOnChangeSearchField}
              value={this.state.value}
            />
            <PublishersTree
              onChange={this.handleOnTreeChange}
              value={this.state.value}
            />
          </div>
          <div className="col-sm-8">
            <ReportStats
              aggregateDataset={this.state.aggregateDataset}
              entityName={this.state.entityName}
            />
          </div>
        </div>
      </section>
    );
  }
}

DatasetsReportPage.defaultProps = {
  fetchPublishersIfNeeded: _.noop
};

DatasetsReportPage.propTypes = {
  fetchPublishersIfNeeded: PropTypes.func
};
