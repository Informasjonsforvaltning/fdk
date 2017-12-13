import React from 'react';
import PropTypes from 'prop-types';
import * as axios from "axios";
import createHistory from 'history/createBrowserHistory';
import { QueryTransport2 } from '../../utils/QueryTransport2';
import localization from '../localization';
import RefinementOptionPublishers from '../search-refinementoption-publishers';
import ReportStats from '../search-results-dataset-report-stats';
import SearchPublishers from '../search-results-dataset-report-publisher';
import { addOrReplaceParamWithoutEncoding, removeParam } from '../../utils/addOrReplaceUrlParam';

const history = createHistory();

export default class ResultsDatasetsReport extends React.Component {
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

  handleOnPublisherSearch(name, orgPath) {
    // Get orgPath from input or try to find from query params.
    let query = (orgPath) ? orgPath : this.getOrgPath(); 
    
    let paramWithRemovedOrgPath = removeParam('orgPath[0]', window.location.href);
    let replacedUrl = addOrReplaceParamWithoutEncoding(paramWithRemovedOrgPath, 'orgPath[0]', query);

    // Empty query params.
    let emptyParam = {
      title: document.title, 
      url: paramWithRemovedOrgPath
    };    
    window.history.pushState(emptyParam, emptyParam.title, emptyParam.url);
    console.log('emptyparam', window.location.href)
    // Set new query param if necessary.
    if (query) {
      let queryParam = {
        title: document.title,
        url: replacedUrl
      };
      window.history.pushState(queryParam, queryParam.title, queryParam.url);
    }
    console.log('query', window.location.href)
    // Get entity from input or try to find from publishers using orgPath. 
    let entity = (name) ? name : this.getName(query);

    axios.get(`/aggregateDataset?q=${query}`)
      .then((response) => {
        const data = response.data;
        this.setState({
          entity: entity,
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

  getPublishers() {
    let that = this;
    axios.get('/publisher?q=')
      .then(response => {        
        let publishers = response.data.hits.hits
          .map(item => item._source)
          .map(hit => 
            hit = {
              name: hit.name, 
              orgPath: hit.orgPath
            }
        ); 
        let entity = this.getName(this.getOrgPath(), publishers);
        this.setState({ 
          publishers: publishers,
          entity: entity
        });
      }
    );    
  }

  getName(orgPath, publishersIn) {
    // Set publishers from state if exists, or input if exists.
    let publishers = (this.state.publishers.length > 0) ? this.state.publishers : (publishersIn) ? publishersIn : null;
    if (publishers) {
      let result = publishers.find(publisher => publisher.orgPath === orgPath);
      let paramEntity = (result) ? result.name : localization.report.allEntities;
      return paramEntity;
    }
    return localization.report.allEntities;
  }

  getOrgPath() {
    let orgPath = window.location.search
      .substring(1)
      .split("&")
      .map(v => v.split("="))
      .reduce((map, [key, value]) => 
        map.set(key, decodeURIComponent(value)), new Map())
      .get('orgPath[0]');
    return (orgPath) ? orgPath : '';
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
              <div className="col-md-4 col-md-offset-8">
                <div className="pull-right" />
              </div>
            </div>
            <div className="row">
              <div className="search-filters col-sm-4 flex-move-first-item-to-bottom">
                <SearchPublishers
                  onSearch={this.handleOnPublisherSearch}
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
