import _ from 'lodash';
import React from 'react';
import qs from 'qs';
import { Route, Switch } from 'react-router-dom';
import cx from 'classnames';
import { detect } from 'detect-browser';

import localization from '../../lib/localization';
import { ResultsDataset } from './results-dataset/results-dataset.component';
import { ResultsConcepts } from './results-concepts/results-concepts.component';
import { ResultsApi } from './results-api/results-api.component';
import { SearchBox } from './search-box/search-box.component';
import { ResultsTabs } from './results-tabs/results-tabs.component';
import { removeValue, addValue } from '../../lib/stringUtils';

import './search-page.scss';
import { extractPublisherCounts } from '../../api/get-datasets';
import { extractPublisherTermsCounts } from '../../api/get-terms';

const ReactGA = require('react-ga');

const browser = detect();

export class SearchPage extends React.Component {
  constructor(props) {
    super(props);

    const { search } = this.props.location;
    const searchQuery = qs.parse(search, { ignoreQueryPrefix: true }) || {};

    this.state = {
      showFilterModal: false,
      searchQuery
    };

    this.handleClearSearch = this.handleClearSearch.bind(this);
    this.handleSearchSubmit = this.handleSearchSubmit.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handleDatasetFilterThemes = this.handleDatasetFilterThemes.bind(this);
    this.handleDatasetFilterAccessRights = this.handleDatasetFilterAccessRights.bind(
      this
    );
    this.handleDatasetFilterPublisher = this.handleDatasetFilterPublisher.bind(
      this
    );
    this.handleDatasetFilterPublisherHierarchy = this.handleDatasetFilterPublisherHierarchy.bind(
      this
    );
    this.handleDatasetFilterProvenance = this.handleDatasetFilterProvenance.bind(
      this
    );
    this.handleDatasetFilterSpatial = this.handleDatasetFilterSpatial.bind(
      this
    );
    this.handleDatasetSort = this.handleDatasetSort.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.close = this.close.bind(this);
    this.open = this.open.bind(this);

    this.props.fetchThemesIfNeeded();
    this.props.fetchPublishersIfNeeded();
    this.props.fetchDistributionTypeIfNeeded();
  }

  handleClearSearch() {
    this.setState(
      {
        searchQuery: {}
      },
      this.handleSearchSubmit
    );
  }

  isFilterNotEmpty() {
    return _.some(_.values(this.state.searchQuery));
  }

  handleSearchSubmit() {
    this.props.history.push(
      `?${qs.stringify(this.state.searchQuery, { skipNulls: true })}`
    );
  }

  handleSearchChange(event) {
    this.setState({
      searchQuery: {
        ...this.state.searchQuery,
        q: event.target.value !== '' ? event.target.value : null,
        from: undefined
      }
    });
  }

  handleDatasetFilterThemes(event) {
    const { theme } = this.state.searchQuery;
    if (event.target.checked) {
      ReactGA.event({
        category: 'Fasett',
        action: 'Legge til tema',
        label: event.target.value
      });
      this.setState(
        {
          searchQuery: {
            ...this.state.searchQuery,
            theme: addValue(theme, event.target.value),
            from: undefined
          }
        },
        () =>
          this.props.history.push(`?${qs.stringify(this.state.searchQuery)}`)
      );
    } else {
      ReactGA.event({
        category: 'Fasett',
        action: 'Fjerne tema',
        label: event.target.value
      });
      this.setState(
        {
          searchQuery: {
            ...this.state.searchQuery,
            theme: removeValue(theme, event.target.value),
            from: undefined
          }
        },
        () =>
          this.props.history.push(`?${qs.stringify(this.state.searchQuery)}`)
      );
    }
  }

  handleDatasetFilterAccessRights(event) {
    const { accessrights } = this.state.searchQuery;
    if (event.target.checked) {
      ReactGA.event({
        category: 'Fasett',
        action: 'Legge til tilgang',
        label: event.target.value
      });
      this.setState(
        {
          searchQuery: {
            ...this.state.searchQuery,
            accessrights: addValue(accessrights, event.target.value),
            from: undefined
          }
        },
        () =>
          this.props.history.push(`?${qs.stringify(this.state.searchQuery)}`)
      );
    } else {
      ReactGA.event({
        category: 'Fasett',
        action: 'Fjerne tilgang',
        label: event.target.value
      });
      this.setState(
        {
          searchQuery: {
            ...this.state.searchQuery,
            accessrights: removeValue(accessrights, event.target.value),
            from: undefined
          }
        },
        () =>
          this.props.history.push(`?${qs.stringify(this.state.searchQuery)}`)
      );
    }
  }

  handleDatasetFilterPublisher(event) {
    const { publisher } = this.state.searchQuery;
    if (event.target.checked) {
      this.setState(
        {
          searchQuery: {
            ...this.state.searchQuery,
            publisher: addValue(publisher, event.target.value),
            from: undefined
          }
        },
        () =>
          this.props.history.push(`?${qs.stringify(this.state.searchQuery)}`)
      );
    } else {
      this.setState(
        {
          searchQuery: {
            ...this.state.searchQuery,
            publisher: removeValue(publisher, event.target.value),
            from: undefined
          }
        },
        () =>
          this.props.history.push(`?${qs.stringify(this.state.searchQuery)}`)
      );
    }
  }

  handleDatasetFilterPublisherHierarchy(event) {
    if (event.target.checked) {
      ReactGA.event({
        category: 'Fasett',
        action: 'Legge til virksomhet',
        label: event.target.value
      });
      this.setState(
        {
          searchQuery: {
            ...this.state.searchQuery,
            orgPath: event.target.value,
            from: undefined
          }
        },
        () =>
          this.props.history.push(`?${qs.stringify(this.state.searchQuery)}`)
      );
    } else {
      ReactGA.event({
        category: 'Fasett',
        action: 'Fjerne virksomhet',
        label: event.target.value
      });
      this.setState(
        {
          searchQuery: {
            ...this.state.searchQuery,
            orgPath: undefined,
            from: undefined
          }
        },
        () =>
          this.props.history.push(`?${qs.stringify(this.state.searchQuery)}`)
      );
    }
  }

  handleDatasetFilterProvenance(event) {
    const { provenance } = this.state.searchQuery;
    if (event.target.checked) {
      ReactGA.event({
        category: 'Fasett',
        action: 'Legge til opphav',
        label: event.target.value
      });
      this.setState(
        {
          searchQuery: {
            ...this.state.searchQuery,
            provenance: addValue(provenance, event.target.value),
            from: undefined
          }
        },
        () =>
          this.props.history.push(`?${qs.stringify(this.state.searchQuery)}`)
      );
    } else {
      ReactGA.event({
        category: 'Fasett',
        action: 'Fjerne opphav',
        label: event.target.value
      });
      this.setState(
        {
          searchQuery: {
            ...this.state.searchQuery,
            provenance: removeValue(provenance, event.target.value),
            from: undefined
          }
        },
        () =>
          this.props.history.push(`?${qs.stringify(this.state.searchQuery)}`)
      );
    }
  }

  handleDatasetFilterSpatial(event) {
    const { spatial } = this.state.searchQuery;
    if (event.target.checked) {
      ReactGA.event({
        category: 'Fasett',
        action: 'Legge til geografi',
        label: event.target.value
      });
      this.setState(
        {
          searchQuery: {
            ...this.state.searchQuery,
            spatial: addValue(spatial, event.target.value),
            from: undefined
          }
        },
        () =>
          this.props.history.push(`?${qs.stringify(this.state.searchQuery)}`)
      );
    } else {
      ReactGA.event({
        category: 'Fasett',
        action: 'Fjerne geografi',
        label: event.target.value
      });
      this.setState(
        {
          searchQuery: {
            ...this.state.searchQuery,
            spatial: removeValue(spatial, event.target.value),
            from: undefined
          }
        },
        () =>
          this.props.history.push(`?${qs.stringify(this.state.searchQuery)}`)
      );
    }
  }

  handleDatasetSort(event) {
    let sortField = event.field;

    ReactGA.event({
      category: 'Sortere',
      action: 'Sortere',
      label: sortField
    });

    if (sortField === '_score') {
      this.setState(
        {
          searchQuery: {
            ...this.state.searchQuery,
            sortfield: undefined,
            sortdirection: undefined
          }
        },
        () =>
          this.props.history.push(`?${qs.stringify(this.state.searchQuery)}`)
      );
    } else {
      if (sortField === 'title') {
        sortField = sortField.concat('.').concat(localization.getLanguage());
      }
      this.setState(
        {
          searchQuery: {
            ...this.state.searchQuery,
            sortfield: sortField,
            sortdirection: event.order
          }
        },
        () =>
          this.props.history.push(`?${qs.stringify(this.state.searchQuery)}`)
      );
    }
  }

  handlePageChange(data) {
    const { selected } = data;
    const offset = Math.ceil(selected * 50);

    if (offset === 0) {
      this.setState(
        {
          searchQuery: {
            ...this.state.searchQuery,
            from: undefined
          }
        },
        () =>
          this.props.history.push(`?${qs.stringify(this.state.searchQuery)}`)
      );
    } else {
      this.setState(
        {
          searchQuery: {
            ...this.state.searchQuery,
            from: offset
          }
        },
        () =>
          this.props.history.push(`?${qs.stringify(this.state.searchQuery)}`)
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
    const {
      datasetItems,
      termItems,
      themesItems,
      publisherItems,
      distributionTypeItems
    } = this.props;
    const topSectionClass = cx('top-section-search', 'mb-1-em', {
      'top-section-search--image': !!(browser && browser.name !== 'ie')
    });
    return (
      <div>
        <section className={topSectionClass}>
          <div className="container">
            <SearchBox
              onSearchSubmit={this.handleSearchSubmit}
              onSearchChange={this.handleSearchChange}
              searchQuery={this.state.searchQuery.q}
              countDatasets={
                datasetItems && datasetItems.hits
                  ? datasetItems.hits.total
                  : null
              }
              countTerms={
                termItems && termItems.hits ? termItems.hits.total : 0
              }
              open={this.open}
            />
            <ResultsTabs
              location={this.props.location}
              countDatasets={
                datasetItems && datasetItems.hits
                  ? datasetItems.hits.total
                  : null
              }
              countTerms={
                termItems && termItems.hits ? termItems.hits.total : 0
              }
            />
          </div>
        </section>
        <div className="container">
          <Switch>
            <Route
              exact
              path="/"
              render={props => (
                <ResultsDataset
                  datasetItems={datasetItems}
                  onClearSearch={this.handleClearSearch}
                  onFilterTheme={this.handleDatasetFilterThemes}
                  onFilterAccessRights={this.handleDatasetFilterAccessRights}
                  onFilterPublisher={this.handleDatasetFilterPublisher}
                  onFilterPublisherHierarchy={
                    this.handleDatasetFilterPublisherHierarchy
                  }
                  onFilterProvenance={this.handleDatasetFilterProvenance}
                  onFilterSpatial={this.handleDatasetFilterSpatial}
                  onSort={this.handleDatasetSort}
                  onPageChange={this.handlePageChange}
                  searchQuery={this.state.searchQuery}
                  themesItems={themesItems}
                  showFilterModal={this.state.showFilterModal}
                  showClearFilterButton={this.isFilterNotEmpty()}
                  closeFilterModal={this.close}
                  hitsPerPage={50}
                  publisherArray={extractPublisherCounts(datasetItems)}
                  publishers={publisherItems}
                  distributionTypeItems={distributionTypeItems}
                  {...props}
                />
              )}
            />
            <Route
              exact
              path="/apis"
              render={props => (
                <ResultsApi
                  apiItems={this.props.apiItems}
                  searchQuery={this.state.searchQuery}
                  onSort={this.handleDatasetSort}
                  {...props}
                />
              )}
            />
            <Route
              exact
              path="/concepts"
              render={props => (
                <ResultsConcepts
                  termItems={termItems}
                  onClearSearch={this.handleClearSearch}
                  onPageChange={this.handlePageChange}
                  onFilterPublisherHierarchy={
                    this.handleDatasetFilterPublisherHierarchy
                  }
                  searchQuery={this.state.searchQuery}
                  hitsPerPage={50}
                  showFilterModal={this.state.showFilterModal}
                  closeFilterModal={this.close}
                  showClearFilterButton={!!this.state.searchQuery.orgPath}
                  publisherArray={extractPublisherTermsCounts(termItems)}
                  publishers={publisherItems}
                  {...props}
                />
              )}
            />
          </Switch>
        </div>
      </div>
    );
  }
}
