import React from 'react';
import PropTypes from 'prop-types';
import ReactPaginate from 'react-paginate';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import cx from 'classnames';
import _ from 'lodash';
import { withRouter } from 'react-router';

import localization from '../../../lib/localization';
import { SearchHitItem } from './search-hit-item/search-hit-item.component';
import { FilterBox } from '../../../components/filter-box/filter-box.component';
import { SearchPublishersTree } from '../search-publishers-tree/search-publishers-tree.component';
import { getSortfield, setSortfield } from '../search-location-helper';

const renderFilterModal = ({
  showFilterModal,
  closeFilterModal,
  apiAggregations,
  locationSearch,
  publisherCounts,
  publishers,
  onFilterFormat,
  onFilterPublisherHierarchy
}) => (
  <Modal isOpen={showFilterModal} toggle={closeFilterModal}>
    <ModalHeader toggle={closeFilterModal}>{localization.filter}</ModalHeader>
    <ModalBody>
      <div className="search-filters">
        <SearchPublishersTree
          title={localization.facet.provider}
          publisherCounts={publisherCounts}
          onFilterPublisherHierarchy={onFilterPublisherHierarchy}
          activeFilter={locationSearch.orgPath}
          publishers={publishers}
        />
        <FilterBox
          htmlKey={2}
          title={localization.facet.format}
          filter={_.get(apiAggregations, 'formats')}
          onClick={onFilterFormat}
          activeFilter={locationSearch.format}
        />
      </div>
    </ModalBody>
    <ModalFooter>
      <Button className="fdk-button" onClick={closeFilterModal} color="primary">
        {localization.close}
      </Button>
    </ModalFooter>
  </Modal>
);

const renderHits = (hits, publishers) => {
  if (hits && Array.isArray(hits)) {
    return hits.map((item, index) => (
      <SearchHitItem
        key={item.id}
        item={item}
        fadeInCounter={index < 3 ? index : null}
        publishers={publishers}
      />
    ));
  }
  return null;
};

export const ResultsApiPure = ({
  showFilterModal,
  closeFilterModal,
  apiItems,
  apiTotal,
  apiAggregations,
  onFilterPublisherHierarchy,
  onFilterFormat,
  locationSearch,
  publisherCounts,
  publishers,
  onClearFilters,
  onPageChange,
  showClearFilterButton,
  hitsPerPage,
  history,
  location
}) => {
  const page = parseInt(locationSearch.page || 0, 10);
  const pageCount = Math.ceil((apiTotal || 1) / hitsPerPage);

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

  return (
    <main data-test-id="apis" id="content">
      <div className="row mb-3">
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
      </div>
      <div className="row">
        <aside className="search-filters col-lg-4 d-none d-lg-block">
          <span className="uu-invisible" aria-hidden="false">
            Filtrering
          </span>
          {apiAggregations && (
            <div>
              {renderFilterModal({
                showFilterModal,
                closeFilterModal,
                apiAggregations,
                locationSearch,
                publisherCounts,
                publishers,
                onFilterFormat,
                onFilterPublisherHierarchy
              })}
              <SearchPublishersTree
                title={localization.facet.provider}
                publisherCounts={publisherCounts}
                onFilterPublisherHierarchy={onFilterPublisherHierarchy}
                activeFilter={locationSearch.orgPath}
                publishers={publishers}
              />
              <FilterBox
                htmlKey={2}
                title={localization.facet.format}
                filter={_.get(apiAggregations, 'formats')}
                onClick={onFilterFormat}
                activeFilter={locationSearch.format}
              />
            </div>
          )}
        </aside>
        <div id="apis" className="col-12 col-lg-8">
          {renderHits(apiItems, publishers)}

          <div className="col-12 d-flex justify-content-center">
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
          </div>
        </div>
      </div>
    </main>
  );
};

ResultsApiPure.defaultProps = {
  showFilterModal: false,
  closeFilterModal: _.noop,
  showClearFilterButton: false,

  apiItems: [],
  apiTotal: 0,
  apiAggregations: null,

  onFilterPublisherHierarchy: _.noop,
  onFilterFormat: _.noop,
  onClearFilters: _.noop,
  locationSearch: {},
  publisherCounts: null,
  publishers: null,

  onPageChange: _.noop,
  hitsPerPage: 0,

  history: { push: _.noop },
  location: { search: '' }
};

ResultsApiPure.propTypes = {
  showFilterModal: PropTypes.bool,
  closeFilterModal: PropTypes.func,
  showClearFilterButton: PropTypes.bool,

  apiItems: PropTypes.array,
  apiTotal: PropTypes.number,
  apiAggregations: PropTypes.object,

  onFilterPublisherHierarchy: PropTypes.func,
  onFilterFormat: PropTypes.func,
  onClearFilters: PropTypes.func,
  locationSearch: PropTypes.object,

  publisherCounts: PropTypes.array,
  publishers: PropTypes.object,

  onPageChange: PropTypes.func,
  hitsPerPage: PropTypes.number,

  history: PropTypes.object,
  location: PropTypes.object
};

export const ResultsApi = withRouter(ResultsApiPure);
