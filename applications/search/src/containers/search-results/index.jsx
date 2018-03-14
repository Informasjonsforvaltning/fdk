import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import qs from 'qs';
import queryString from 'query-string';
import { Route, Switch } from 'react-router-dom';

import localization from '../../components/localization';
import {
  fetchDatasetsIfNeeded,
  fetchTermsIfNeeded,
  fetchThemesIfNeeded
} from '../../actions/index';
import ResultsDataset from '../../components/search-results-dataset';
import ResultsConcepts from '../../components/search-concepts-results';
import SearchBox from '../../components/search-app-searchbox';
import ResultsTabs from '../../components/search-results-tabs';
import { removeValue, addValue } from '../../utils/stringUtils';
import './index.scss';

const ReactGA = require('react-ga');

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
    this.handleSearchSubmit = this.handleSearchSubmit.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handleDatasetFilterThemes = this.handleDatasetFilterThemes.bind(this);
    this.handleDatasetFilterAccessRights = this.handleDatasetFilterAccessRights.bind(this);
    this.handleDatasetFilterPublisher = this.handleDatasetFilterPublisher.bind(this);
    this.handleDatasetSort = this.handleDatasetSort.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.close = this.close.bind(this);
    this.open = this.open.bind(this);

    const datasetsURL = '/datasets';
    this.props.dispatch(fetchDatasetsIfNeeded(`/datasets/${props.location.search}`));
    this.props.dispatch(fetchTermsIfNeeded(`/terms/${props.location.search}`));
    this.props.dispatch(fetchThemesIfNeeded());
  }

  componentWillReceiveProps(nextProps) {
    const { selectedLanguageCode } = nextProps;
    const datasetQuery = `datasets/${nextProps.location.search}`;
    if(nextProps.location.search !== this.props.location.search) {
      this.props.dispatch(fetchDatasetsIfNeeded(`/datasets/${nextProps.location.search}`));
      this.props.dispatch(fetchTermsIfNeeded(`/terms/${nextProps.location.search}`));
    }
    if(selectedLanguageCode !== this.props.selectedLanguageCode) {
      console.log("componentwillreceiveProps", JSON.stringify(selectedLanguageCode));
      if (selectedLanguageCode === 'nb') {
        this.setState(
          {
            searchQuery: {
              ...this.state.searchQuery,
              lang: undefined
            }
          }
        );
      } else {
        this.setState(
          {
            searchQuery: {
              ...this.state.searchQuery,
              lang: selectedLanguageCode
            }
          }
        );
      }
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
          q: event.target.value !== '' ? event.target.value : null,
          from: undefined
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
            theme:  addValue(theme, event.target.value),
            from: undefined
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
            theme: removeValue(theme, event.target.value),
            from: undefined
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
            accessrights: addValue(accessrights, event.target.value),
            from: undefined
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
            accessrights: removeValue(accessrights, event.target.value),
            from: undefined
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
            publisher: addValue(publisher, event.target.value),
            from: undefined
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
            publisher: removeValue(publisher, event.target.value),
            from: undefined
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

  handlePageChange(data) {
    console.log("handlePageChange", JSON.stringify(data));
    let selected = data.selected;
    let offset = Math.ceil(selected * 50);
    if (offset === 0) {
      this.setState(
        ({
          searchQuery: {
            ...this.state.searchQuery,
            from: undefined
          }
        }),
        () => this.props.history.push(`?${qs.stringify(this.state.searchQuery)}`)
      );
    } else {
      this.setState(
        ({
          searchQuery: {
            ...this.state.searchQuery,
            from: offset
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
                selectedLanguageCode={this.props.selectedLanguageCode}
                datasetItems={datasetItems}
                onFilterTheme={this.handleDatasetFilterThemes}
                onFilterAccessRights={this.handleDatasetFilterAccessRights}
                onFilterPublisher={this.handleDatasetFilterPublisher}
                onSort={this.handleDatasetSort}
                onPageChange={this.handlePageChange}
                searchQuery={this.state.searchQuery}
                themesItems={themesItems}
                showFilterModal={this.state.showFilterModal}
                closeFilterModal={this.close}
                hitsPerPage={50}
                {...props}
              />)
            }
          />
          <Route
            exact
            path="/concepts/:lang?"
            render={(props) =>
              (<ResultsConcepts
                selectedLanguageCode={this.props.selectedLanguageCode}
                termItems={termItems}
                onPageChange={this.handlePageChange}
                searchQuery={this.state.searchQuery}
                hitsPerPage={50}
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

function mapStateToProps({ datasets, terms, themes }) {

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
