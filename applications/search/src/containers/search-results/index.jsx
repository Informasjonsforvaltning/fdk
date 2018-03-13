import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { browserHistory } from 'react-router';
import qs from 'qs';
import queryString from 'query-string';
import { Link, Route, Switch } from 'react-router-dom';

import localization from '../../components/localization';
import {
  fetchDatasetsIfNeeded,
  fetchTermsIfNeeded,
  fetchThemesIfNeeded
} from '../../actions/index';
import { addOrReplaceParam, getParamFromUrl, removeParam } from '../../utils/addOrReplaceUrlParam';
import ResultsDataset from '../../components/search-results-dataset';
import ResultsConcepts from '../../components/search-concepts-results';
import SearchBox from '../../components/search-app-searchbox';
import ResultsTabs from '../../components/search-results-tabs';
import { removeValue, addValue } from '../../utils/stringUtils';
import './index.scss';
// import '../../components/search-results-searchbox/index.scss';

const ReactGA = require('react-ga');
const sa = require('superagent');

const getTabUrl = (tab) => {
  const href = window.location.search;
  const queryObj = qs.parse(window.location.search.substr(1));
  if (href.indexOf('tab=') === -1) {
    return href.indexOf('?') === -1 ? `${href}?tab=${tab}` : `${href}&tab=${tab}`;
  } else if (tab !== queryObj.tab) {
    const replacedUrl = addOrReplaceParam(href, 'tab', tab);
    return replacedUrl.substring(replacedUrl.indexOf('?'));
  }
  return href;
}

class SearchPage extends React.Component {
  constructor(props) {
    super(props);
    const searchQuery = queryString.parse(props.location.search) || {
        searchQuery: {
          size: 50
        },
        showFilterModal: false,
    }

    this.state = {
      showConcepts: false,
      searchQuery
    }
    this.queryObj = qs.parse(window.location.search.substr(1));
    if (!window.themes) {
      window.themes = [];

      sa.get('/reference-data/themes')
        .end((err, res) => {
          if (!err && res) {
            res.body.forEach((hit) => {
              const obj = {};
              obj[hit.code] = {};
              obj[hit.code].nb = hit.title.nb;
              obj[hit.code].nn = hit.title.nb;
              obj[hit.code].en = hit.title.en;
              window.themes.push(obj);
            });
          }
        });
    }
    this.handleSelectView = this.handleSelectView.bind(this);
    this.handleHistoryListen = this.handleHistoryListen.bind(this);
    this.handleSearchSubmit = this.handleSearchSubmit.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handleDatasetFilterThemes = this.handleDatasetFilterThemes.bind(this);
    this.handleDatasetFilterAccessRights = this.handleDatasetFilterAccessRights.bind(this);
    this.handleDatasetFilterPublisher = this.handleDatasetFilterPublisher.bind(this);
    this.handleDatasetSort = this.handleDatasetSort.bind(this);
    this.close = this.close.bind(this);
    this.open = this.open.bind(this);

    const datasetsURL = '/datasets';
    this.props.dispatch(fetchDatasetsIfNeeded(`/datasets/${props.location.search}`));
    this.props.dispatch(fetchTermsIfNeeded(`/terms/${props.location.search}`));
    this.props.dispatch(fetchThemesIfNeeded());
  }

  componentWillMount() {
    const tabCode = getParamFromUrl('tab');
    if (tabCode !== null) {
      if (tabCode === 'datasets') {
        ReactGA.modalview('/datasets');
        this.setState({
          showConcepts: false
        });
      } else if (tabCode === 'concepts') {
        ReactGA.modalview('/concepts');
        this.setState({
          showConcepts: true
        });
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    const datasetQuery = `datasets/${nextProps.location.search}`;
    console.log("old props", JSON.stringify(this.props.location.search));
    console.log("next props", JSON.stringify(nextProps.location.search));
    //if(nextProps.location !== this.props.location) {
    if(nextProps.location.search !== this.props.location.search) {
      this.props.dispatch(fetchDatasetsIfNeeded(`/datasets/${nextProps.location.search}`));
      this.props.dispatch(fetchTermsIfNeeded(`/terms/${nextProps.location.search}`));
    }
  }

  handleSelectView(chosenView) {
    let tabUrl = getTabUrl(chosenView);
    tabUrl = removeParam('p', tabUrl); // remove this parameter when navigating between tabs.
    const nextUrl = `${location.pathname}${tabUrl}`;
    browserHistory.push(nextUrl);

    if (chosenView === 'datasets') {
      ReactGA.modalview('/datasets');
      this.setState({
        showConcepts: false
      });
    } else if (chosenView === 'concepts') {
      ReactGA.modalview('/concepts');
      this.setState({
        showConcepts: true
      });
    }
  }

  handleHistoryListen(history, location) {
    if(location.search.indexOf('lang=') === -1 && this.props.selectedLanguageCode && this.props.selectedLanguageCode !== "nb") {
      let nextUrl = "";
      if (location.search.indexOf('?') === -1) {
        nextUrl = `${location.search}?lang=${   this.props.selectedLanguageCode}`
      } else {
        nextUrl = `${location.search}&lang=${   this.props.selectedLanguageCode}`
      }
      history.push(nextUrl);
    }

    if (location.search.indexOf('tab=') === -1 && this.state.showConcepts) {
      let nextUrl = "";
      if (location.search.indexOf('?') === -1 && this.state.showConcepts) {
        nextUrl = `${location.search}?tab=concepts`
      } else {
        nextUrl = `${location.search}&tab=concepts`
      }
      history.push(nextUrl);
    }
  }

  handleSearchSubmit(event) {
    this.props.history.push(`?${qs.stringify(this.state.searchQuery, { skipNulls: true })}`);
  }

  handleSearchChange(event) {
    this.setState(
      {
        searchQuery: {
          ...this.state.searchQuery,
          q: event.target.value !== '' ? event.target.value : null
        }
      }
    );
  }

  handleDatasetFilterThemes(event) {
    const { theme } = this.state.searchQuery;
    if (event.target.checked) {
      this.setState(
        ({
          searchQuery: {
            ...this.state.searchQuery,
            theme:  addValue(theme, event.target.value)
          }
        }),
        () => this.props.history.push(`?${qs.stringify(this.state.searchQuery)}`)
      );
    }
    else {
      this.setState(
        ({
          searchQuery: {
            ...this.state.searchQuery,
            theme: removeValue(theme, event.target.value)
          }
        }),
        () => this.props.history.push(`?${qs.stringify(this.state.searchQuery)}`)
      );
    }
  }

  handleDatasetFilterAccessRights(event) {
    const { accessrights } = this.state.searchQuery;
    if (event.target.checked) {
      this.setState(
        ({
          searchQuery: {
            ...this.state.searchQuery,
            accessrights: addValue(accessrights, event.target.value)
          }
        }),
        () => this.props.history.push(`?${qs.stringify(this.state.searchQuery)}`)
      );
    }
    else {
      this.setState(
        ({
          searchQuery: {
            ...this.state.searchQuery,
            accessrights: removeValue(accessrights, event.target.value)
          }
        }),
        () => this.props.history.push(`?${qs.stringify(this.state.searchQuery)}`)
      );
    }
  }

  handleDatasetFilterPublisher(event) {
    const { publisher } = this.state.searchQuery;
    if (event.target.checked) {
      this.setState(
        ({
          searchQuery: {
            ...this.state.searchQuery,
            publisher: addValue(publisher, event.target.value)
          }
        }),
        () => this.props.history.push(`?${qs.stringify(this.state.searchQuery)}`)
      );
    }
    else {
      this.setState(
        ({
          searchQuery: {
            ...this.state.searchQuery,
            publisher: removeValue(publisher, event.target.value)
          }
        }),
        () => this.props.history.push(`?${qs.stringify(this.state.searchQuery)}`)
      );
    }
  }

  handleDatasetSort(event) {
    let sortField = event.field;

    if (sortField === '_score') {
      this.setState(
        ({
          searchQuery: {
            ...this.state.searchQuery,
            sortfield: undefined,
            sortdirection: undefined
          }
        }),
        () => this.props.history.push(`?${qs.stringify(this.state.searchQuery)}`)
      );
    } else {
      if (sortField === 'title') {
        sortField = sortField.concat('.').concat(localization.getLanguage())
      }
      this.setState(
        ({
          searchQuery: {
            ...this.state.searchQuery,
            sortfield: sortField,
            sortdirection: event.order
          }
        }),
        () => this.props.history.push(`?${qs.stringify(this.state.searchQuery)}`)
      );
    }
  }

  close() {
    this.setState({ showFilterModal: false });
  }

  open() {
    this.setState({ showFilterModal: true });
  }

  render() {
    const { selectedLanguageCode, datasetItems, isFetchingDatasets, termItems, isFetchingTerms, themesItems }  = this.props;
    const showDatasets = cx(
      {
        show: !this.state.showConcepts,
        hide: this.state.showConcepts
      }
    );
    const showConcepts = cx(
      {
        show: this.state.showConcepts,
        hide: !this.state.showConcepts
      }
    );

    /*
     <div className={showDatasets}>
     <ResultsDataset
     onHistoryListen={this.handleHistoryListen}
     onSelectView={this.handleSelectView}
     isSelected={!this.state.showConcepts}
     selectedLanguageCode={this.props.selectedLanguageCode}
     datasetItems={datasetItems}
     location={this.props.location}
     history={this.props.history}
     match={this.props.match}
     onSearch={this.handleSearch}
     onFilterTheme={this.handleDatasetFilterThemes}
     onFilterAccessRights={this.handleDatasetFilterAccessRights}
     onFilterPublisher={this.handleDatasetFilterPublisher}
     onSort={this.handleDatasetSort}
     searchQuery={this.state.searchQuery}
     themesItems={themesItems}
     showFilterModal={this.state.showFilterModal}
     closeFilterModal={this.close}
     />
     </div>

     <div className={showConcepts}>
     <ResultsConcepts
     onSelectView={this.handleSelectView}
     isSelected={this.state.showConcepts}
     onHistoryListen={this.handleHistoryListen}
     selectedLanguageCode={this.props.selectedLanguageCode}
     />
     </div>
     */
    return (
      <div className="container">
        <SearchBox
          onSearchSubmit={this.handleSearchSubmit}
          onSearchChange={this.handleSearchChange}
          searchQuery={this.state.searchQuery.q}
          countDatasets={(datasetItems && datasetItems.hits) ? datasetItems.hits.total : null}
          isFetchingDatasets={isFetchingDatasets}
          countTerms={(termItems && termItems.hits) ? termItems.hits.total : null}
          isFetchingTerms={isFetchingTerms}
          open={this.open}
        />
        <ResultsTabs
          onSelectView={this.handleSelectView}
          location={this.props.location}
          countDatasets={(datasetItems && datasetItems.hits) ? datasetItems.hits.total : null}
          countTerms={(termItems && termItems.hits) ? termItems.hits.total : null}
          selectedLanguageCode={selectedLanguageCode}
        />
        <Switch>
          <Route
            exact
            path="/"
            render={(props) =>
              (<ResultsDataset
                onHistoryListen={this.handleHistoryListen}
                selectedLanguageCode={this.props.selectedLanguageCode}
                datasetItems={datasetItems}
                onFilterTheme={this.handleDatasetFilterThemes}
                onFilterAccessRights={this.handleDatasetFilterAccessRights}
                onFilterPublisher={this.handleDatasetFilterPublisher}
                onSort={this.handleDatasetSort}
                searchQuery={this.state.searchQuery}
                themesItems={themesItems}
                showFilterModal={this.state.showFilterModal}
                closeFilterModal={this.close}
                {...props}
              />)
            }
          />
          <Route
            exact
            path="/concepts/:lang?"
            render={(props) =>
              (<ResultsConcepts
                onHistoryListen={this.handleHistoryListen}
                selectedLanguageCode={this.props.selectedLanguageCode}
                termItems={termItems}
                {...props}
              />)
            }
          />
        </Switch>

      </div>
    );
  }
}

SearchPage.defaultProps = {
  selectedLanguageCode: null
};

SearchPage.propTypes = {
  selectedLanguageCode: PropTypes.string
};

function mapStateToProps({ datasets, terms, themes }, ownProps) {

  const { datasetItems, isFetchingDatasets } = datasets || {
    datasetItems: null
  }

  const { termItems, isFetchingTerms } = terms || {
    termItems: null
  }

  const { themesItems, isFetchingThemes } = themes || {
    themesItems: null
  }

  return {
    datasetItems,
    isFetchingDatasets,
    termItems,
    isFetchingTerms,
    themesItems,
    isFetchingThemes
  }
}

export default connect(mapStateToProps)(SearchPage);
