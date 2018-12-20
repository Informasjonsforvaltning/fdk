import _ from 'lodash';
import React from 'react';
import qs from 'qs';
import { Route, Switch } from 'react-router-dom';
import cx from 'classnames';
import { detect } from 'detect-browser';
import { ResultsDataset } from './results-dataset/results-dataset.component';
import { ResultsConcepts } from './results-concepts/results-concepts.component';
import { ResultsApi } from './results-api/results-api.component';
import { SearchBox } from './search-box/search-box.component';
import { ResultsTabs } from './results-tabs/results-tabs.component';
import { removeValue, addValue } from '../../lib/stringUtils';

import './search-page.scss';
import { extractPublisherCounts } from '../../api/get-datasets';
import { extractPublisherConceptsCounts } from '../../api/get-concepts';
import {
  PATHNAME_DATASETS,
  PATHNAME_APIS,
  PATHNAME_CONCEPTS,
  HITS_PER_PAGE
} from '../../constants/constants';

const ReactGA = require('react-ga');

const browser = detect();

export class SearchPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showFilterModal: false
    };

    this.handleClearFilters = this.handleClearFilters.bind(this);
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
    this.handleFilterFormat = this.handleFilterFormat.bind(this);

    this.handlePageChange = this.handlePageChange.bind(this);

    this.sortByLastModified = this.sortByLastModified.bind(this);
    this.sortByScore = this.sortByScore.bind(this);

    this.close = this.close.bind(this);
    this.open = this.open.bind(this);

    this.props.fetchThemesIfNeeded();
    this.props.fetchPublishersIfNeeded();
    this.props.fetchReferenceDataIfNeeded();
  }

  handleClearFilters() {
    const { clearQuery, history } = this.props;
    clearQuery(history);
  }

  isFilterNotEmpty() {
    return _.some(
      _.values(
        _.omit(this.props.searchQuery, ['q', 'sortfield', 'sortdirection'])
      )
    );
  }

  handleSearchSubmit() {
    const { searchQuery } = this.props;
    this.props.history.push(
      `?${qs.stringify(searchQuery, { skipNulls: true })}`
    );
  }

  handleSearchChange(event) {
    const { setSearchQuery, history } = this.props;
    const query = event.target.value !== '' ? event.target.value : null;
    setSearchQuery(query, history);
  }

  handleDatasetFilterThemes(event) {
    const { searchQuery, setQueryFilter, history } = this.props;
    const { theme } = searchQuery;
    if (event.target.checked) {
      ReactGA.event({
        category: 'Fasett',
        action: 'Legge til tema',
        label: event.target.value
      });
      setQueryFilter('theme', addValue(theme, event.target.value), history);
    } else {
      ReactGA.event({
        category: 'Fasett',
        action: 'Fjerne tema',
        label: event.target.value
      });
      setQueryFilter('theme', removeValue(theme, event.target.value), history);
    }
  }

  handleDatasetFilterAccessRights(event) {
    const { searchQuery, setQueryFilter, history } = this.props;
    const { accessrights } = searchQuery;
    if (event.target.checked) {
      ReactGA.event({
        category: 'Fasett',
        action: 'Legge til tilgang',
        label: event.target.value
      });
      setQueryFilter(
        'accessrights',
        addValue(accessrights, event.target.value),
        history
      );
    } else {
      ReactGA.event({
        category: 'Fasett',
        action: 'Fjerne tilgang',
        label: event.target.value
      });
      setQueryFilter(
        'accessrights',
        removeValue(accessrights, event.target.value),
        history
      );
    }
  }

  handleDatasetFilterPublisher(event) {
    const { searchQuery, setQueryFilter, history } = this.props;
    const { publisher } = searchQuery;
    if (event.target.checked) {
      setQueryFilter(
        'publisher',
        addValue(publisher, event.target.value),
        history
      );
    } else {
      setQueryFilter(
        'publisher',
        removeValue(publisher, event.target.value),
        history
      );
    }
  }

  handleDatasetFilterPublisherHierarchy(event) {
    const { setQueryFilter, history } = this.props;

    if (event.target.checked) {
      ReactGA.event({
        category: 'Fasett',
        action: 'Legge til virksomhet',
        label: event.target.value
      });
      setQueryFilter('orgPath', event.target.value, history);
    } else {
      ReactGA.event({
        category: 'Fasett',
        action: 'Fjerne virksomhet',
        label: event.target.value
      });
      setQueryFilter('orgPath', undefined, history);
    }
  }

  handleDatasetFilterProvenance(event) {
    const { searchQuery, setQueryFilter, history } = this.props;
    const { provenance } = searchQuery;
    if (event.target.checked) {
      ReactGA.event({
        category: 'Fasett',
        action: 'Legge til opphav',
        label: event.target.value
      });
      setQueryFilter(
        'provenance',
        addValue(provenance, event.target.value),
        history
      );
    } else {
      ReactGA.event({
        category: 'Fasett',
        action: 'Fjerne opphav',
        label: event.target.value
      });
      setQueryFilter(
        'provenance',
        removeValue(provenance, event.target.value),
        history
      );
    }
  }

  handleDatasetFilterSpatial(event) {
    const { searchQuery, setQueryFilter, history } = this.props;
    const { spatial } = searchQuery;
    if (event.target.checked) {
      ReactGA.event({
        category: 'Fasett',
        action: 'Legge til geografi',
        label: event.target.value
      });
      setQueryFilter('spatial', addValue(spatial, event.target.value), history);
    } else {
      ReactGA.event({
        category: 'Fasett',
        action: 'Fjerne geografi',
        label: event.target.value
      });
      setQueryFilter(
        'spatial',
        removeValue(spatial, event.target.value),
        history
      );
    }
  }

  handleFilterFormat(event) {
    const { searchQuery, setQueryFilter, history } = this.props;
    const { format } = searchQuery;
    if (event.target.checked) {
      ReactGA.event({
        category: 'Fasett',
        action: 'Legge til format',
        label: event.target.value
      });
      setQueryFilter('format', addValue(format, event.target.value), history);
    } else {
      ReactGA.event({
        category: 'Fasett',
        action: 'Fjerne format',
        label: event.target.value
      });
      setQueryFilter(
        'format',
        removeValue(format, event.target.value),
        history
      );
    }
  }

  sortByScore() {
    const { setQueryFilter, history } = this.props;
    setQueryFilter('sortfield', undefined, history);
  }
  sortByLastModified() {
    const { setQueryFilter, history } = this.props;
    setQueryFilter('sortfield', 'modified', history);
  }

  handlePageChange(data) {
    const { setQueryFrom, history } = this.props;
    const { selected } = data;
    const offset = Math.ceil(selected * HITS_PER_PAGE);

    if (offset === 0) {
      setQueryFrom(undefined, history);
    } else {
      setQueryFrom(offset, history);
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
      conceptItems,
      apiItems,
      themesItems,
      publisherItems,
      referenceData,
      location,
      conceptsCompare,
      addConcept,
      removeConcept,
      setDatasetSort,
      setApiSort,
      setConceptSort,
      datasetSortValue,
      apiSortValue,
      conceptSortValue,
      searchQuery
    } = this.props;
    const topSectionClass = cx('top-section-search', 'mb-4', {
      'top-section-search--image': !!(browser && browser.name !== 'ie')
    });
    return (
      <div>
        <section className={topSectionClass}>
          <div className="container">
            <SearchBox
              onSearchSubmit={this.handleSearchSubmit}
              onSearchChange={this.handleSearchChange}
              searchQuery={searchQuery.q || ''}
              countDatasets={_.get(datasetItems, ['hits', 'total'])}
              countTerms={_.get(conceptItems, ['page', 'totalElements'])}
              countApis={_.get(apiItems, 'total')}
              open={this.open}
            />
            <ResultsTabs
              activePath={location.pathname}
              searchParam={location.search}
              countDatasets={_.get(datasetItems, ['hits', 'total'], 0)}
              countTerms={_.get(conceptItems, ['page', 'totalElements'], 0)}
              countApis={_.get(apiItems, 'total', 0)}
            />
          </div>
        </section>
        <div className="container">
          <Switch>
            <Route
              exact
              path={PATHNAME_DATASETS}
              render={props => (
                <ResultsDataset
                  datasetItems={datasetItems}
                  onClearFilters={this.handleClearFilters}
                  onFilterTheme={this.handleDatasetFilterThemes}
                  onFilterAccessRights={this.handleDatasetFilterAccessRights}
                  onFilterPublisher={this.handleDatasetFilterPublisher}
                  onFilterPublisherHierarchy={
                    this.handleDatasetFilterPublisherHierarchy
                  }
                  onFilterProvenance={this.handleDatasetFilterProvenance}
                  onFilterSpatial={this.handleDatasetFilterSpatial}
                  onPageChange={this.handlePageChange}
                  onSortByLastModified={this.sortByLastModified}
                  onSortByScore={this.sortByScore}
                  searchQuery={searchQuery}
                  themesItems={themesItems}
                  showFilterModal={this.state.showFilterModal}
                  showClearFilterButton={this.isFilterNotEmpty()}
                  closeFilterModal={this.close}
                  hitsPerPage={HITS_PER_PAGE}
                  publisherArray={extractPublisherCounts(datasetItems)}
                  publishers={publisherItems}
                  referenceData={referenceData}
                  setDatasetSort={setDatasetSort}
                  datasetSortValue={datasetSortValue}
                  {...props}
                />
              )}
            />
            <Route
              exact
              path={PATHNAME_APIS}
              render={props => (
                <ResultsApi
                  apiItems={this.props.apiItems}
                  onClearFilters={this.handleClearFilters}
                  onFilterTheme={this.handleDatasetFilterThemes}
                  onFilterAccessRights={this.handleDatasetFilterAccessRights}
                  onFilterPublisher={this.handleDatasetFilterPublisher}
                  onFilterPublisherHierarchy={
                    this.handleDatasetFilterPublisherHierarchy
                  }
                  onFilterFormat={this.handleFilterFormat}
                  onFilterProvenance={this.handleDatasetFilterProvenance}
                  onFilterSpatial={this.handleDatasetFilterSpatial}
                  onPageChange={this.handlePageChange}
                  onSortByLastModified={this.sortByLastModified}
                  onSortByScore={this.sortByScore}
                  searchQuery={searchQuery}
                  themesItems={themesItems}
                  showFilterModal={this.state.showFilterModal}
                  showClearFilterButton={this.isFilterNotEmpty()}
                  closeFilterModal={this.close}
                  hitsPerPage={HITS_PER_PAGE}
                  publisherArray={extractPublisherCounts(apiItems)}
                  publishers={publisherItems}
                  setApiSort={setApiSort}
                  apiSortValue={apiSortValue}
                  {...props}
                />
              )}
            />
            <Route
              exact
              path={PATHNAME_CONCEPTS}
              render={props => (
                <ResultsConcepts
                  conceptItems={conceptItems}
                  onClearFilters={this.handleClearFilters}
                  onPageChange={this.handlePageChange}
                  onSortByLastModified={this.sortByLastModified}
                  onSortByScore={this.sortByScore}
                  onFilterPublisherHierarchy={
                    this.handleDatasetFilterPublisherHierarchy
                  }
                  searchQuery={searchQuery}
                  hitsPerPage={HITS_PER_PAGE}
                  showFilterModal={this.state.showFilterModal}
                  closeFilterModal={this.close}
                  showClearFilterButton={!!searchQuery.orgPath}
                  publisherArray={extractPublisherConceptsCounts(conceptItems)}
                  publishers={publisherItems}
                  conceptsCompare={conceptsCompare}
                  addConcept={addConcept}
                  removeConcept={removeConcept}
                  setConceptSort={setConceptSort}
                  conceptSortValue={conceptSortValue}
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
