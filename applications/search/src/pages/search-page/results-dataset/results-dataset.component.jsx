import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import ReactPaginate from 'react-paginate';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import cx from 'classnames';
import { withRouter } from 'react-router';

import localization from '../../../lib/localization';
import { SearchHitItem } from './search-hit-item/search-hit-item.component';
import { FilterBox } from '../../../components/filter-box/filter-box.component';
import { SearchPublishersTree } from '../search-publishers-tree/search-publishers-tree.component';
import { ErrorBoundary } from '../../../components/error-boundary/error-boundary';
import { getSortfield, setPage, setSortfield } from '../search-location-helper';
import { parseSearchParams } from '../../../lib/location-history-helper';

function _renderFilterModal({
  showFilterModal,
  closeFilterModal,
  datasetAggregations,
  onFilterTheme,
  onFilterAccessRights,
  onFilterPublisherHierarchy,
  onFilterProvenance,
  onFilterSpatial,
  locationSearch,
  themesItems,
  publishers
}) {
  return (
    <Modal isOpen={showFilterModal} toggle={closeFilterModal}>
      <ModalHeader toggle={closeFilterModal}>Filter</ModalHeader>
      <ModalBody>
        <div className="search-filters">
          <FilterBox
            htmlKey={1}
            title={localization.facet.theme}
            filter={datasetAggregations.theme}
            onClick={onFilterTheme}
            activeFilter={locationSearch.theme}
            themesItems={themesItems}
          />
          <FilterBox
            htmlKey={2}
            title={localization.facet.accessRight}
            filter={datasetAggregations.accessRights}
            onClick={onFilterAccessRights}
            activeFilter={locationSearch.accessrights}
          />
          <SearchPublishersTree
            title={localization.facet.organisation}
            publisherCounts={datasetAggregations.orgPath.buckets}
            onFilterPublisherHierarchy={onFilterPublisherHierarchy}
            activeFilter={locationSearch.orgPath}
            publishers={publishers}
          />
          <FilterBox
            htmlKey={3}
            title={localization.facet.spatial}
            filter={datasetAggregations.spatial}
            onClick={onFilterSpatial}
            activeFilter={locationSearch.spatial}
          />
          <FilterBox
            htmlKey={4}
            title={localization.facet.provenance}
            filter={datasetAggregations.provenance}
            onClick={onFilterProvenance}
            activeFilter={locationSearch.provenance}
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

function _renderHits({ datasetItems, referenceData }) {
  if (datasetItems && Array.isArray(datasetItems)) {
    return datasetItems.map(item => (
      <ErrorBoundary key={item._source.id}>
        <SearchHitItem result={item} referenceData={referenceData} />
      </ErrorBoundary>
    ));
  }
  return null;
}

export const ResultsDatasetPure = ({
  showFilterModal,
  closeFilterModal,
  datasetItems,
  datasetAggregations,
  datasetTotal,
  onClearFilters,
  onFilterTheme,
  onFilterAccessRights,
  onFilterPublisherHierarchy,
  onFilterProvenance,
  onFilterSpatial,
  showClearFilterButton,
  themesItems,
  hitsPerPage,
  publishers,
  referenceData,
  history,
  location
}) => {
  const locationSearch = parseSearchParams(location);

  const page = parseInt(locationSearch.page || 0, 10);
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

  const sortfield = getSortfield(location);
  const sortByScoreClass = cx('fdk-button', 'fdk-button-black-toggle', {
    selected: !sortfield
  });
  const sortByLastModifiedClass = cx('fdk-button', 'fdk-button-black-toggle', {
    selected: sortfield === 'modified'
  });

  const onSortByScoreClick = () => {
    setSortfield(history, location, undefined);
  };
  const onSortByModifiedClick = () => {
    setSortfield(history, location, 'modified');
  };

  const onPageChange = data => {
    setPage(history, location, data.selected);
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
                {_renderFilterModal({
                  showFilterModal,
                  closeFilterModal,
                  datasetAggregations,
                  onFilterTheme,
                  onFilterAccessRights,
                  onFilterPublisherHierarchy,
                  onFilterProvenance,
                  onFilterSpatial,
                  locationSearch,
                  themesItems,
                  publishers
                })}
                <FilterBox
                  htmlKey={1}
                  title={localization.facet.theme}
                  filter={datasetAggregations.theme}
                  onClick={onFilterTheme}
                  activeFilter={locationSearch.theme}
                  themesItems={themesItems}
                />
                <FilterBox
                  htmlKey={2}
                  title={localization.facet.accessRight}
                  filter={datasetAggregations.accessRights}
                  onClick={onFilterAccessRights}
                  activeFilter={locationSearch.accessrights}
                />
                <SearchPublishersTree
                  title={localization.facet.organisation}
                  publisherCounts={datasetAggregations.orgPath.buckets}
                  onFilterPublisherHierarchy={onFilterPublisherHierarchy}
                  activeFilter={locationSearch.orgPath}
                  publishers={publishers}
                />
                <FilterBox
                  htmlKey={3}
                  title={localization.facet.spatial}
                  filter={datasetAggregations.spatial}
                  onClick={onFilterSpatial}
                  activeFilter={locationSearch.spatial}
                />
                <FilterBox
                  htmlKey={4}
                  title={localization.facet.provenance}
                  filter={datasetAggregations.provenance}
                  onClick={onFilterProvenance}
                  activeFilter={locationSearch.provenance}
                />
              </div>
            )}
        </aside>

        <section className="col-12 col-lg-8">
          {_renderHits({ datasetItems, referenceData })}
        </section>

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
            forcePage={page}
            disableInitialCallback
          />
        </section>
      </section>
    </main>
  );
};

ResultsDatasetPure.defaultProps = {
  showFilterModal: false,
  closeFilterModal: _.noop,
  showClearFilterButton: false,

  datasetItems: null,
  datasetAggregations: null,
  datasetTotal: 1,

  onFilterTheme: _.noop,
  onFilterAccessRights: _.noop,
  onFilterPublisherHierarchy: _.noop,
  onFilterProvenance: _.noop,
  onFilterSpatial: _.noop,
  onClearFilters: _.noop,
  themesItems: null,
  publishers: null,
  referenceData: null,

  hitsPerPage: 10,

  history: { push: _.noop },
  location: { search: '' }
};

ResultsDatasetPure.propTypes = {
  showFilterModal: PropTypes.bool,
  closeFilterModal: PropTypes.func,
  showClearFilterButton: PropTypes.bool,

  datasetItems: PropTypes.array,
  datasetAggregations: PropTypes.object,
  datasetTotal: PropTypes.number,

  onFilterTheme: PropTypes.func,
  onFilterAccessRights: PropTypes.func,
  onFilterPublisherHierarchy: PropTypes.func,
  onFilterProvenance: PropTypes.func,
  onFilterSpatial: PropTypes.func,
  onClearFilters: PropTypes.func,
  themesItems: PropTypes.object,
  publishers: PropTypes.object,
  referenceData: PropTypes.object,

  hitsPerPage: PropTypes.number,

  history: PropTypes.object,
  location: PropTypes.object
};

export const ResultsDataset = withRouter(ResultsDatasetPure);
