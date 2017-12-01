import React from 'react';
import PropTypes from 'prop-types';
import qs from 'qs';
import {
  SearchkitManager,
  SearchkitProvider,
  RefinementListFilter,
  HitsStats
} from 'searchkit';
import * as axios from "axios";
import createHistory from 'history/createBrowserHistory'
import './index.scss';
import { QueryTransport2 } from '../../utils/QueryTransport2';
import localization from '../localization';
import RefinementOptionPublishers from '../search-refinementoption-publishers';
import RefinementOptionOrgPath from '../search-refinementoption-orgpath';
import ReportStats from '../search-results-dataset-report-stats';
import SearchPublishers from '../search-results-dataset-report-publisher';

const host = '/dcat';
const history = createHistory();
const transportRef = new QueryTransport2();
const searchkit = new SearchkitManager(
  host,
  {
    transport: transportRef,
    createHistory: () => history
  }
);

export default class ResultsDatasetsReport extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      entity: '',
      aggregateDataset: {},
      catalog: {}
    }
    this.queryObj = qs.parse(window.location.search.substr(1));
    this.handleOnPublisherSearch = this.handleOnPublisherSearch.bind(this);
    this.handleOnPublisherSearch();
    if (!window.publishers) {
      axios.get('/publisher-names')
        .then((res) => {
          console.log('res is ', res);
          if (res) {
            window.publishers = res.data.hits;
          }
        });
    }
  }

  handleOnPublisherSearch(name, orgPath) {
    const query = orgPath || '';
    axios.get(`/aggregateDataset?q=${query}`)
      .then((response) => {
        const data = response.data;
        this.setState({
          entity: name || localization.report.allEntities,
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
      <SearchkitProvider searchkit={searchkit}>
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
                  <RefinementListFilter
                    id="orgPath"
                    title={localization.facet.organisation}
                    field="publisher.orgPath.raw"
                    operator="AND"
                    size={5/* NOT IN USE!!! see QueryTransport.jsx */}
                    itemComponent={RefinementOptionOrgPath}
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
      </SearchkitProvider>
    );
  }
}

ResultsDatasetsReport.defaultProps = {
  selectedLanguageCode: null
};

ResultsDatasetsReport.propTypes = {
  selectedLanguageCode: PropTypes.string
};
