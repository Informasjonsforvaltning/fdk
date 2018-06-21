import React from 'react';
import * as axios from 'axios';

import localization from '../../../lib/localization';
import { ReportStats } from './report-stats/report-stats.component';
import { SearchPublishers } from './search-publishers/search-publishers.component';
import { SearchPublishersTree } from '../search-publishers-tree/search-publishers-tree.component';
import {
  addOrReplaceParamWithoutEncoding,
  removeParam
} from '../../../lib/addOrReplaceUrlParam';

export class ResultsDatasetsReport extends React.Component {
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

  constructor(props) {
    super(props);
    this.state = {
      entity: '',
      aggregateDataset: {},
      publishers: [],
      searchValue: '',
      selectedOrgPath: null
    };
    this.handleOnPublisherSearch = this.handleOnPublisherSearch.bind(this);
    this.handleOnChangeSearchField = this.handleOnChangeSearchField.bind(this);
    this.handleOnTreeChange = this.handleOnTreeChange.bind(this);
    this.handleOnClearSearch = this.handleOnClearSearch.bind(this);
    this.getPublishers();
    this.handleOnPublisherSearch();
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
          ResultsDatasetsReport.getOrgPath(),
          publishers
        );
        this.setState({
          publishers,
          entity
        });
      })
      .catch(error => {
        console.error(error.response);
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
        : ResultsDatasetsReport.getOrgPath();

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
        const data = response.data;
        this.setState({
          entity,
          aggregateDataset: data
        });
      })
      .catch(error => {
        console.error(error.response);
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
      <div>
        <div className="container">
          <section id="resultPanel">
            <div className="row">
              <div
                className="col-md-4 col-md-offset-8"
                id="content"
                role="main"
              >
                <div className="pull-right" />
              </div>
            </div>
            <div className="row">
              <div className="search-filters col-sm-4 flex-move-first-item-to-bottom">
                <button
                  className="fdk-button fdk-button-default-no-hover"
                  onClick={this.handleOnClearSearch}
                  type="button"
                >
                  {localization.query.clear}
                </button>
                <SearchPublishers
                  onSearch={this.handleOnPublisherSearch}
                  onChange={this.handleOnChangeSearchField}
                  value={this.state.value}
                />
                <SearchPublishersTree
                  key={this.state.selectedOrgPath}
                  onSearch={this.handleOnTreeChange}
                  orgPath={ResultsDatasetsReport.getOrgPath()}
                />
              </div>
              <div id="datasets" className="col-sm-8">
                <ReportStats
                  aggregateDataset={this.state.aggregateDataset}
                  entity={this.state.entity}
                />
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }
}
