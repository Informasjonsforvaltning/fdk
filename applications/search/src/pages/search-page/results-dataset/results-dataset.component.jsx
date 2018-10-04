import React from 'react';
import PropTypes from 'prop-types';
import ReactPaginate from 'react-paginate';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import cx from 'classnames';
import _ from 'lodash';

import localization from '../../../lib/localization';
import { SearchHitItem } from './search-hit-item/search-hit-item.component';
import { Select } from '../../../components/select/select.component';
import { FilterBox } from '../../../components/filter-box/filter-box.component';
import { SearchPublishersTree } from '../search-publishers-tree/search-publishers-tree.component';
import { ErrorBoundary } from '../../../components/error-boundary/error-boundary';

export class ResultsDataset extends React.Component {
  _renderFilterModal() {
    const {
      showFilterModal,
      closeFilterModal,
      datasetItems,
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
              filter={datasetItems.aggregations.theme_count}
              onClick={onFilterTheme}
              activeFilter={searchQuery.theme}
              themesItems={themesItems}
            />
            <FilterBox
              htmlKey={2}
              title={localization.facet.accessRight}
              filter={datasetItems.aggregations.accessRightsCount}
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
              filter={datasetItems.aggregations.spatial}
              onClick={onFilterSpatial}
              activeFilter={searchQuery.spatial}
            />
            <FilterBox
              htmlKey={4}
              title={localization.facet.provenance}
              filter={datasetItems.aggregations.provenanceCount}
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
    if (datasetItems && datasetItems.hits && datasetItems.hits.hits) {
      return datasetItems.hits.hits.map(item => (
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
      onClearFilters,
      onFilterTheme,
      onFilterAccessRights,
      onFilterPublisherHierarchy,
      onFilterProvenance,
      onFilterSpatial,
      onSort,
      onPageChange,
      showClearFilterButton,
      searchQuery,
      themesItems,
      hitsPerPage,
      publisherArray,
      publishers
    } = this.props;
    const page =
      searchQuery && searchQuery.from ? searchQuery.from / hitsPerPage : 0;
    const pageCount = Math.ceil(
      (datasetItems && datasetItems.hits ? datasetItems.hits.total : 1) /
        hitsPerPage
    );

    const clearButtonClass = cx(
      'btn',
      'btn-primary',
      'fdk-button',
      'fade-in-500',
      {
        'd-none': !showClearFilterButton
      }
    );

    return (
      <main id="content">
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
            <div className="float-right">
              <Select
                items={[
                  {
                    label: 'relevance',
                    field: '_score',
                    order: 'asc',
                    defaultOption: true
                  },
                  {
                    label: 'title',
                    field: 'title',
                    order: 'asc'
                  },
                  {
                    label: 'modified',
                    field: 'modified',
                    order: 'desc'
                  },
                  {
                    label: 'publisher',
                    field: 'publisher.name',
                    order: 'asc'
                  }
                ]}
                onChange={onSort}
                activeSort={searchQuery.sortfield}
              />
            </div>
          </div>
        </section>

        <section className="row">
          <aside className="search-filters col-lg-4 d-none d-lg-block">
            <span className="uu-invisible" aria-hidden="false">
              Filtrering tilgang
            </span>
            {datasetItems &&
              datasetItems.aggregations && (
                <div>
                  {this._renderFilterModal()}
                  <FilterBox
                    htmlKey={1}
                    title={localization.facet.theme}
                    filter={datasetItems.aggregations.theme_count}
                    onClick={onFilterTheme}
                    activeFilter={searchQuery.theme}
                    themesItems={themesItems}
                  />
                  <FilterBox
                    htmlKey={2}
                    title={localization.facet.accessRight}
                    filter={datasetItems.aggregations.accessRightsCount}
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
                    filter={datasetItems.aggregations.spatial}
                    onClick={onFilterSpatial}
                    activeFilter={searchQuery.spatial}
                  />
                  <FilterBox
                    htmlKey={4}
                    title={localization.facet.provenance}
                    filter={datasetItems.aggregations.provenanceCount}
                    onClick={onFilterProvenance}
                    activeFilter={searchQuery.provenance}
                  />
                </div>
              )}
          </aside>

          <section className="col-12 col-lg-8">{this._renderHits()}</section>

          {_.get(datasetItems, ['hits', 'total'], 0) > 50 && (
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
  showClearFilterButton: null,
  hitsPerPage: null
};

ResultsDataset.propTypes = {
  showFilterModal: PropTypes.bool,
  closeFilterModal: PropTypes.func,
  datasetItems: PropTypes.object,
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
  onSort: PropTypes.func.isRequired,
  onPageChange: PropTypes.func,
  showClearFilterButton: PropTypes.bool,
  hitsPerPage: PropTypes.number
};
