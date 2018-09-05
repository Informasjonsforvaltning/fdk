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

const renderFilterModal = (
  showFilterModal,
  closeFilterModal,
  apiItems,
  onFilterAccessRights,
  searchQuery
) => (
  <Modal isOpen={showFilterModal} toggle={closeFilterModal}>
    <ModalHeader toggle={closeFilterModal}>{localization.filter}</ModalHeader>
    <ModalBody>
      <div className="search-filters">
        <FilterBox
          htmlKey={2}
          title={localization.facet.accessRight}
          filter={apiItems.aggregations.accessRights}
          onClick={onFilterAccessRights}
          activeFilter={searchQuery.accessrights}
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
  if (hits) {
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

export const ResultsApi = props => {
  const {
    showFilterModal,
    closeFilterModal,
    apiItems,
    onFilterAccessRights,
    onFilterPublisherHierarchy,
    onFilterFormat,
    searchQuery,
    publisherArray,
    publishers,
    onClearSearch,
    onSort,
    onPageChange,
    showClearFilterButton,
    hitsPerPage
  } = props;

  const page =
    searchQuery && searchQuery.from ? searchQuery.from / hitsPerPage : 0;
  const pageCount = Math.ceil(
    (apiItems && apiItems.hits ? apiItems.hits.total : 1) / hitsPerPage
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
      <div className="row mb-3">
        <div className="col-12 d-flex justify-content-between">
          <button
            className={clearButtonClass}
            onClick={onClearSearch}
            type="button"
          >
            {localization.query.clear}
          </button>
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
      <div className="row">
        <aside className="search-filters col-lg-4 d-none d-lg-block">
          <span className="uu-invisible" aria-hidden="false">
            Filtrering
          </span>
          {_.get(apiItems, 'aggregations') && (
            <div>
              {renderFilterModal(
                showFilterModal,
                closeFilterModal,
                apiItems,
                onFilterAccessRights,
                searchQuery
              )}
              <FilterBox
                htmlKey={1}
                title={localization.facet.accessRight}
                filter={_.get(apiItems, ['aggregations', 'accessRights'])}
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
                htmlKey={2}
                title={localization.facet.format}
                filter={_.get(apiItems, ['aggregations', 'formats'])}
                onClick={onFilterFormat}
                activeFilter={searchQuery.format}
              />
            </div>
          )}
        </aside>
        <div id="apis" className="col-12 col-lg-8">
          {renderHits(apiItems.hits, publishers)}
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

ResultsApi.defaultProps = {
  showFilterModal: false,
  closeFilterModal: null,
  apiItems: [],
  onFilterAccessRights: null,
  onFilterPublisherHierarchy: null,
  onFilterFormat: null,
  searchQuery: {},
  publisherArray: null,
  publishers: null,
  onClearSearch: null,
  onPageChange: null,
  showClearFilterButton: null,
  hitsPerPage: null
};

ResultsApi.propTypes = {
  showFilterModal: PropTypes.bool,
  closeFilterModal: PropTypes.func,
  apiItems: PropTypes.object,
  onFilterAccessRights: PropTypes.func,
  onFilterPublisherHierarchy: PropTypes.func,
  onFilterFormat: PropTypes.func,
  searchQuery: PropTypes.object,
  publisherArray: PropTypes.array,
  publishers: PropTypes.object,
  onClearSearch: PropTypes.func,
  onSort: PropTypes.func.isRequired,
  onPageChange: PropTypes.func,
  showClearFilterButton: PropTypes.bool,
  hitsPerPage: PropTypes.number
};
