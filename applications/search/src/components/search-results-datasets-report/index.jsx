import React from 'react';
import PropTypes from 'prop-types';
import * as axios from "axios";
import createHistory from 'history/createBrowserHistory';
import localization from '../localization';
import ReportStats from '../search-results-dataset-report-stats';
import SearchPublishers from '../search-results-dataset-report-publisher';
import SearchPublishersTree from '../search-publishers-tree';
import { addOrReplaceParamWithoutEncoding, removeParam } from '../../utils/addOrReplaceUrlParam';

const history = createHistory();

export default class ResultsDatasetsReport extends React.Component {
  static getOrgPath() {
    const orgPath = window.location.search
      .substring(1)
      .split("&")
      .map(v => v.split("="))
      .reduce((map, [key, value]) =>
        map.set(key, decodeURIComponent(value)), new Map())
      .get('orgPath[0]');
    return (orgPath) || '';
  }

  constructor(props) {
    super(props);
    this.state = {
      entity: '',
      aggregateDataset: {},
      catalog: {},
      publishers: []
    }
    this.getPublishers();
    this.handleOnPublisherSearch = this.handleOnPublisherSearch.bind(this);
    this.handleOnPublisherSearch();
  }

  getPublishers() {
    axios.get('/publisher?q=')
      .then(response => {
        const publishers = response.data.hits.hits
          .map(item => item._source)
          .map(hit => (
            {
              name: hit.name,
              orgPath: hit.orgPath
            }
          ));
        const entity = this.getName(ResultsDatasetsReport.getOrgPath(), publishers);
        this.setState({
          publishers,
          entity
        });
      }
      );
  }

  getName(orgPath, publishersIn) {
    // Set publishers from state if exists, or input if exists.
    const publishers = (this.state.publishers.length > 0) ? this.state.publishers : (publishersIn) || null;
    if (publishers) {
      const result = publishers.find(publisher => publisher.orgPath === orgPath);
      const paramEntity = (result) ? result.name : localization.report.allEntities;
      return paramEntity;
    }
    // return localization.report.allEntities;
    return orgPath;
  }

  handleOnPublisherSearch(name, orgPath) {
    // Get orgPath from input or try to find from query params.
    const query = (orgPath !== null && orgPath !== undefined) ? orgPath : ResultsDatasetsReport.getOrgPath();
    // let query = (orgPath) || ResultsDatasetsReport.getOrgPath();

    const paramWithRemovedOrgPath = removeParam('orgPath[0]', window.location.href);
    const replacedUrl = addOrReplaceParamWithoutEncoding(paramWithRemovedOrgPath, 'orgPath[0]', query);

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
    const entity = (name) || this.getName(query);

    axios.get(`/aggregateDataset?q=${query}`)
      .then((response) => {
        const data = response.data;
        this.setState({
          entity,
          aggregateDataset: data
        });
      });
    axios.get(`/harvest/catalog?q=${query}`)
      .then((response) => {
        const data = response.data;
        this.setState({
          catalog: data
        });
      });
  }

  render() {

    history.listen((location)=> {
      if(location.search.indexOf('lang=') === -1 && this.props.selectedLanguageCode && this.props.selectedLanguageCode !== "nb") {
        let nextUrl = "";
        if (location.search.indexOf('?') === -1) {
          nextUrl = `${location.search  }?lang=${   this.props.selectedLanguageCode}`
        } else {
          nextUrl = `${location.search  }&lang=${   this.props.selectedLanguageCode}`
        }
        history.push(nextUrl);
      }
    });
    return (
      <div>
        <div className="container">
          <section id="resultPanel">
            <div className="row">
              <div className="col-md-4 col-md-offset-8" id="content" role="main" tabIndex="-1">
                <div className="pull-right" />
              </div>
            </div>
            <div className="row">
              <div className="search-filters col-sm-4 flex-move-first-item-to-bottom">
                <button
                  className='fdk-button fdk-button-default-no-hover mt-3'
                  onClick={() => {this.handleOnPublisherSearch(null, '')}}
                  type="button"
                >
                  {localization.query.clear}
                </button>
                <SearchPublishers
                  onSearch={this.handleOnPublisherSearch}
                />
                <SearchPublishersTree
                  onSearch={this.handleOnPublisherSearch}
                  orgPath={ResultsDatasetsReport.getOrgPath()}
                />
              </div>
              <div id="datasets" className="col-sm-8">
                <ReportStats
                  aggregateDataset={this.state.aggregateDataset}
                  entity={this.state.entity}
                  catalog={this.state.catalog}
                />
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }
}

ResultsDatasetsReport.defaultProps = {
  selectedLanguageCode: null
};

ResultsDatasetsReport.propTypes = {
  selectedLanguageCode: PropTypes.string
};
