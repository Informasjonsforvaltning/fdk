import React from 'react';
import PropTypes from 'prop-types';
import ReactPaginate from 'react-paginate';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import cx from 'classnames';

import localization from '../../../lib/localization';
import { SearchHitItem } from './search-hit-item/search-hit-item.component';
import { FilterBox } from '../../../components/filter-box/filter-box.component';
import { SearchPublishersTree } from '../search-publishers-tree/search-publishers-tree.component';
import { ErrorBoundary } from '../../../components/error-boundary/error-boundary';

export class ResultsDataset extends React.Component {
  componentWillMount() {
    const urlHasSortfieldModified =
      window.location.href.indexOf('sortfield=modified') !== -1;
    const datasetSortValueIsModified =
      this.props.datasetSortValue === 'modified';

    if (datasetSortValueIsModified || urlHasSortfieldModified) {
      this.props.setDatasetSort('modified');
      this.props.onSortByLastModified();
    } else {
      this.props.onSortByScore();
      this.props.setDatasetSort(undefined);
    }
  }

  _renderFilterModal() {
    const {
      showFilterModal,
      closeFilterModal,
      datasetAggregations,
      onFilterTheme,
      onFilterAccessRights,
      onFilterPublisherHierarchy,
      onFilterProvenance,
      onFilterSpatial,
      searchQuery,
      themesItems,
      publisherArray,
      publishers
    } = this.props;
    return (
      <Modal isOpen={showFilterModal} toggle={closeFilterModal}>
        <ModalHeader toggle={closeFilterModal}>Filter</ModalHeader>
        <ModalBody>
          <div className="search-filters">
            <FilterBox
              htmlKey={1}
              title={localization.facet.theme}
              filter={datasetAggregations.theme_count}
              onClick={onFilterTheme}
              activeFilter={searchQuery.theme}
              themesItems={themesItems}
            />
            <FilterBox
              htmlKey={2}
              title={localization.facet.accessRight}
              filter={datasetAggregations.accessRightsCount}
              onClick={onFilterAccessRights}
              activeFilter={searchQuery.accessrights}
            />
            <SearchPublishersTree
              title={localization.facet.organisation}
              filter={publisherArray}
              onFilterPublisherHierarchy={onFilterPublisherHierarchy}
              activeFilter={searchQuery.orgPath}
              publishers={publishers}
            />
            <FilterBox
              htmlKey={3}
              title={localization.facet.spatial}
              filter={datasetAggregations.spatial}
              onClick={onFilterSpatial}
              activeFilter={searchQuery.spatial}
            />
            <FilterBox
              htmlKey={4}
              title={localization.facet.provenance}
              filter={datasetAggregations.provenanceCount}
              onClick={onFilterProvenance}
              activeFilter={searchQuery.provenance}
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            className="fdk-button"
            onClick={closeFilterModal}
            color="primary"
          >
            Close
          </Button>
        </ModalFooter>
      </Modal>
    );
  }

  _renderHits() {
    const { datasetItems, referenceData } = this.props;
    if (datasetItems && Array.isArray(datasetItems)) {
      return datasetItems.map(item => (
        <ErrorBoundary key={item._source.id}>
          <SearchHitItem result={item} referenceData={referenceData} />
        </ErrorBoundary>
      ));
    }
    return null;
  }
  render() {
    const {
      datasetItems,
      datasetAggregations,
      datasetTotal,
      onClearFilters,
      onFilterTheme,
      onFilterAccessRights,
      onFilterPublisherHierarchy,
      onFilterProvenance,
      onFilterSpatial,
      onPageChange,
      showClearFilterButton,
      searchQuery,
      themesItems,
      hitsPerPage,
      publisherArray,
      publishers,
      onSortByScore,
      onSortByLastModified,
      setDatasetSort,
      datasetSortValue
    } = this.props;
    const page =
      searchQuery && searchQuery.from ? searchQuery.from / hitsPerPage : 0;
    const pageCount = Math.ceil((datasetTotal || 1) / hitsPerPage);

    const clearButtonClass = cx(
      'btn',
      'btn-primary',
      'fdk-button',
      'fade-in-500',
      {
        'd-none': !showClearFilterButton
      }
    );
    const sortByScoreClass = cx('fdk-button', 'fdk-button-black-toggle', {
      selected: datasetSortValue === undefined
    });
    const sortByLastModifiedClass = cx(
      'fdk-button',
      'fdk-button-black-toggle',
      {
        selected: datasetSortValue === 'modified'
      }
    );

    const onSortByScoreClick = () => {
      setDatasetSort(undefined);
      onSortByScore();
    };
    const onSortByModifiedClick = () => {
      setDatasetSort('modified');
      onSortByLastModified();
    };

    return (
      <main id="content" data-test-id="datasets">
        <section className="row mb-3">
          <div className="col-6 col-lg-4">
            <button
              className={clearButtonClass}
              onClick={onClearFilters}
              type="button"
            >
              {localization.query.clear}
            </button>
          </div>
          <div className="col-6 col-lg-4 offset-lg-4">
            <div className="d-flex justify-content-end">
              <Button
                className={sortByScoreClass}
                onClick={onSortByScoreClick}
                color="primary"
              >
                {localization.sort.relevance}
              </Button>
              <Button
                className={sortByLastModifiedClass}
                onClick={onSortByModifiedClick}
                color="primary"
              >
                {localization.sort.modified}
              </Button>
            </div>
          </div>
        </section>

        <section className="row">
          <aside className="search-filters col-lg-4 d-none d-lg-block">
            <span className="uu-invisible" aria-hidden="false">
              Filtrering tilgang
            </span>
            {datasetItems &&
              datasetAggregations && (
                <div>
                  {this._renderFilterModal()}
                  <FilterBox
                    htmlKey={1}
                    title={localization.facet.theme}
                    filter={datasetAggregations.theme_count}
                    onClick={onFilterTheme}
                    activeFilter={searchQuery.theme}
                    themesItems={themesItems}
                  />
                  <FilterBox
                    htmlKey={2}
                    title={localization.facet.accessRight}
                    filter={datasetAggregations.accessRightsCount}
                    onClick={onFilterAccessRights}
                    activeFilter={searchQuery.accessrights}
                  />
                  <SearchPublishersTree
                    title={localization.facet.organisation}
                    filter={publisherArray}
                    onFilterPublisherHierarchy={onFilterPublisherHierarchy}
                    activeFilter={searchQuery.orgPath}
                    publishers={publishers}
                  />
                  <FilterBox
                    htmlKey={3}
                    title={localization.facet.spatial}
                    filter={datasetAggregations.spatial}
                    onClick={onFilterSpatial}
                    activeFilter={searchQuery.spatial}
                  />
                  <FilterBox
                    htmlKey={4}
                    title={localization.facet.provenance}
                    filter={datasetAggregations.provenanceCount}
                    onClick={onFilterProvenance}
                    activeFilter={searchQuery.provenance}
                  />
                </div>
              )}
          </aside>

          <section className="col-12 col-lg-8">{this._renderHits()}</section>

          {datasetTotal > 50 && (
            <section className="col-12 col-lg-8 offset-lg-4 d-flex justify-content-center">
              <span className="uu-invisible" aria-hidden="false">
                Sidepaginering.
              </span>
              <ReactPaginate
                pageCount={pageCount}
                pageRangeDisplayed={2}
                marginPagesDisplayed={1}
                previousLabel={localization.page.prev}
                nextLabel={localization.page.next}
                breakLabel={<span>...</span>}
                breakClassName="break-me"
                containerClassName="pagination"
                onPageChange={onPageChange}
                subContainerClassName="pages pagination"
                activeClassName="active"
                initialPage={page}
                disableInitialCallback
              />
            </section>
          )}
        </section>
      </main>
    );
  }
}

ResultsDataset.defaultProps = {
  showFilterModal: false,
  closeFilterModal: null,
  datasetItems: null,
  datasetAggregations: null,
  datasetTotal: 1,
  onFilterTheme: null,
  onFilterAccessRights: null,
  onFilterPublisherHierarchy: null,
  onFilterProvenance: null,
  onFilterSpatial: null,
  searchQuery: {},
  themesItems: null,
  publisherArray: null,
  publishers: null,
  referenceData: null,
  onClearFilters: null,
  onPageChange: null,
  setDatasetSort: null,
  showClearFilterButton: null,
  hitsPerPage: null
};

ResultsDataset.propTypes = {
  showFilterModal: PropTypes.bool,
  closeFilterModal: PropTypes.func,
  datasetItems: PropTypes.array,
  datasetAggregations: PropTypes.object,
  datasetTotal: PropTypes.number,
  onFilterTheme: PropTypes.func,
  onFilterAccessRights: PropTypes.func,
  onFilterPublisherHierarchy: PropTypes.func,
  onFilterProvenance: PropTypes.func,
  onFilterSpatial: PropTypes.func,
  searchQuery: PropTypes.object,
  themesItems: PropTypes.object,
  publisherArray: PropTypes.array,
  publishers: PropTypes.object,
  referenceData: PropTypes.object,
  onClearFilters: PropTypes.func,
  setDatasetSort: PropTypes.func,
  onSortByLastModified: PropTypes.func.isRequired,
  onSortByScore: PropTypes.func.isRequired,
  onPageChange: PropTypes.func,
  showClearFilterButton: PropTypes.bool,
  hitsPerPage: PropTypes.number
};
