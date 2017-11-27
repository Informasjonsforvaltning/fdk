import React from 'react';
import PropTypes from 'prop-types';
import qs from 'qs';
import {
  SearchkitManager,
  SearchkitProvider,
  RefinementListFilter,
  HitsStats,
  TopBar
} from 'searchkit';
import * as axios from "axios";

import { QueryTransport2 } from '../../utils/QueryTransport2';
import localization from '../localization';
import RefinementOptionPublishers from '../search-refinementoption-publishers';
import { SearchBox } from '../search-results-searchbox';
import SearchHitItem from '../search-results-hit-item';
import SelectDropdown from '../search-results-selector-dropdown';
import CustomHitsStats2 from '../search-result-custom-hitstats2';
import createHistory from 'history/createBrowserHistory'
import { addOrReplaceParam } from '../../utils/addOrReplaceUrlParam';
import ReportStats from '../search-results-dataset-report-stats';
import SearchPublishers from '../search-results-dataset-report-publisher';

const host = '/dcat';

const history = createHistory();
console.log('history is ', history);
history.default = () => {
  console.log('default func?');
};
const transportRef = new QueryTransport2();
const searchkit = new SearchkitManager(
  host,
  {
    transport: transportRef,
    createHistory: ()=> {
      console.log('create history runs now');
      return history;
    }

  }
);

searchkit.translateFunction = (key) => {
  const translations = {
    'pagination.previous': localization.page.prev,
    'pagination.next': localization.page.next,
    'facets.view_more': localization.page.viewmore,
    'facets.view_all': localization.page.seeall,
    'facets.view_less': localization.page.seefewer,
    'reset.clear_all': localization.page.resetfilters,
    'hitstats.results_found': `${localization.page['result.summary']} {numberResults} ${localization.page.dataset}`,
    'NoHits.Error': localization.noHits.error,
    'NoHits.ResetSearch': '.',
    'sort.by': localization.sort.by,
    'sort.relevance': localization.sort.relevance,
    'sort.title': localization.sort.title,
    'sort.publisher': localization.sort.publisher,
    'sort.modified': localization.sort.modified
  };
  return translations[key];
};

export default class ResultsDatasetsReport extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      entity: '',
      aggregateDataset: {}
    }
    this.queryObj = qs.parse(window.location.search.substr(1));
    this.handleOnPublisherSearch = this.handleOnPublisherSearch.bind(this);
    this.handleOnPublisherSearch();
  }

  handleOnPublisherSearch(name, orgPath) {
    const query = orgPath || '';
    return axios.get(`http://localhost:8083/aggregateDataset?q=${query}`)
      .then((response) => {
        const hits = response.data;
        this.setState({
          entity: name || localization.report.allEntities,
          aggregateDataset: hits
        });
      });
  }

  _renderPublisherRefinementListFilter() {
    this.publisherFilter =
      (<RefinementListFilter
        id="publisher"
        title={localization.facet.organisation}
        field="publisher.name.raw"
        operator="AND"
        size={5/* NOT IN USE!!! see QueryTransport.jsx */}
        itemComponent={RefinementOptionPublishers}
      />);

    return this.publisherFilter;
  }

  render() {
    const selectDropdownWithProps = React.createElement(SelectDropdown, {
      selectedLanguageCode: this.props.selectedLanguageCode
    });

    const searchHitItemWithProps = React.createElement(SearchHitItem, {
      selectedLanguageCode: this.props.selectedLanguageCode
    });

    history.listen((location, action)=> {
      console.log(action, location);
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
                  {this._renderPublisherRefinementListFilter()}
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
