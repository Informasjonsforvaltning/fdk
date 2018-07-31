import React from 'react';
import * as axios from 'axios';

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
      entity: '',
      aggregateDataset: {},
      publishers: [],
      selectedOrgPath: null
    };
    this.handleOnPublisherSearch = this.handleOnPublisherSearch.bind(this);
    this.handleOnChangeSearchField = this.handleOnChangeSearchField.bind(this);
    this.handleOnTreeChange = this.handleOnTreeChange.bind(this);
    this.handleOnClearSearch = this.handleOnClearSearch.bind(this);
    this.getPublishers();
    this.handleOnPublisherSearch();
  }

  static getOrgPath() {
    const orgPath = window.location.search
      .substring(1)
      .split('&')
      .map(v => v.split('='))
      .reduce(
        (map, [key, value]) => map.set(key, decodeURIComponent(value)),
        new Map()
      )
      .get('orgPath[0]');
    return orgPath || '';
  }

  getPublishers() {
    axios
      .get('/publisher?q=')
      .then(response => {
        const publishers = response.data.hits.hits
          .map(item => item._source)
          .map(hit => ({
            name: hit.name,
            orgPath: hit.orgPath
          }));
        const entity = this.getName(
          DatasetsReportPage.getOrgPath(),
          publishers
        );
        this.setState({
          publishers,
          entity
        });
      })
      .catch(error => {
        console.error(error);
      });
  }

  getName(orgPath, publishersIn) {
    // Set publishers from state if exists, or input if exists.
    const publishers =
      this.state.publishers.length > 0
        ? this.state.publishers
        : publishersIn || null;
    if (publishers) {
      const result = publishers.find(
        publisher => publisher.orgPath === orgPath
      );
      const paramEntity = result
        ? result.name
        : localization.report.allEntities;
      return paramEntity;
    }
    return orgPath;
  }

  handleOnPublisherSearch(name, orgPath) {
    // Get orgPath from input or try to find from query params.
    const query =
      orgPath !== null && orgPath !== undefined
        ? orgPath
        : DatasetsReportPage.getOrgPath();

    const paramWithRemovedOrgPath = removeParam(
      'orgPath[0]',
      window.location.href
    );
    const replacedUrl = addOrReplaceParamWithoutEncoding(
      paramWithRemovedOrgPath,
      'orgPath[0]',
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

    // Get entity from input or try to find from publishers using orgPath.
    const entity = name || this.getName(query);

    axios
      .get(`/aggregateDataset?q=${query}`)
      .then(response => {
        this.setState({
          entity,
          aggregateDataset: response.data
        });
      })
      .catch(error => {
        console.error(error);
      });
  }

  handleOnChangeSearchField(value) {
    this.setState({
      value: value || null,
      selectedOrgPath: value ? value.orgPath : null
    });
    if (!value) {
      this.handleOnPublisherSearch(null, '');
    } else {
      this.handleOnPublisherSearch(value.name, value.orgPath);
    }
  }

  handleOnTreeChange(name, orgPath) {
    this.setState({
      value: ''
    });
    this.handleOnPublisherSearch(name, orgPath);
  }

  handleOnClearSearch() {
    this.setState({
      value: '',
      selectedOrgPath: Math.random()
    });
    this.handleOnPublisherSearch(null, '');
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
              onSearch={this.handleOnPublisherSearch}
              onChange={this.handleOnChangeSearchField}
              value={this.state.value}
            />
            <PublishersTree
              key={this.state.selectedOrgPath}
              onSearch={this.handleOnTreeChange}
              orgPath={DatasetsReportPage.getOrgPath()}
            />
          </div>
          <div className="col-sm-8">
            <ReportStats
              aggregateDataset={this.state.aggregateDataset}
              entity={this.state.entity}
            />
          </div>
        </div>
      </section>
    );
  }
}
