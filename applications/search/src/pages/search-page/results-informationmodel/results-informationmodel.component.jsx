import _ from 'lodash';
import React from 'react';
import { withRouter } from 'react-router';
import ReactPaginate from 'react-paginate';
import PropTypes from 'prop-types';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import cx from 'classnames';

import localization from '../../../lib/localization';
import { SearchHitItem } from './search-hit-item/search-hit-item.component';
import { FilterTree } from '../filter-tree/filter-tree.component';
import { getSortfield, setPage, setSortfield } from '../search-location-helper';
import { parseSearchParams } from '../../../lib/location-history-helper';
import { FilterPills } from '../filter-pills/filter-pills.component';

const renderFilterModal = ({
  showFilterModal,
  closeFilterModal,
  locationSearch,
  publisherCounts,
  publishers,
  onFilterPublisherHierarchy
}) => (
  <Modal isOpen={showFilterModal} toggle={closeFilterModal}>
    <ModalHeader toggle={closeFilterModal}>{localization.filter}</ModalHeader>
    <ModalBody>
      <div className="search-filters">
        <FilterTree
          title={localization.responsible}
          aggregations={publisherCounts}
          handleFiltering={onFilterPublisherHierarchy}
          activeFilter={locationSearch.orgPath}
          referenceDataItems={publishers}
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

export const ResultsInformationModelPure = ({
  showFilterModal,
  closeFilterModal,
  informationModelItems,
  informationModelTotal,
  informationModelAggregations,
  onFilterPublisherHierarchy,
  publisherCounts,
  publishers,
  hitsPerPage,
  history,
  location
}) => {
  const locationSearch = parseSearchParams(location);
  const page = parseInt(locationSearch.page || 0, 10);
  const pageCount = Math.ceil((informationModelTotal || 1) / hitsPerPage);

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
    window.scrollTo(0, 0);
  };

  return (
    <main data-test-id="informationModels" id="content">
      <div className="row mb-3">
        <div className="col-6 col-lg-4" />
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

          <FilterPills
            history={history}
            location={location}
            locationSearch={locationSearch}
            publishers={publishers}
          />

          {informationModelAggregations && (
            <div>
              {renderFilterModal({
                showFilterModal,
                closeFilterModal,
                locationSearch,
                publisherCounts,
                publishers,
                onFilterPublisherHierarchy
              })}
              <FilterTree
                title={localization.responsible}
                aggregations={publisherCounts}
                handleFiltering={onFilterPublisherHierarchy}
                activeFilter={locationSearch.orgPath}
                referenceDataItems={publishers}
              />
            </div>
          )}
        </aside>
        <div id="informationModels" className="col-12 col-lg-8">
          {renderHits(informationModelItems, publishers)}
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
              forcePage={page}
              disableInitialCallback
            />
          </div>
        </div>
      </div>
    </main>
  );
};

ResultsInformationModelPure.defaultProps = {
  showFilterModal: false,
  closeFilterModal: _.noop,

  informationModelItems: [],
  informationModelTotal: 0,
  informationModelAggregations: null,

  onFilterPublisherHierarchy: _.noop,

  publisherCounts: [],
  publishers: null,

  hitsPerPage: 10,

  history: { push: _.noop },
  location: { search: '' }
};

ResultsInformationModelPure.propTypes = {
  showFilterModal: PropTypes.bool,
  closeFilterModal: PropTypes.func,

  informationModelItems: PropTypes.array,
  informationModelTotal: PropTypes.number,
  informationModelAggregations: PropTypes.object,

  onFilterPublisherHierarchy: PropTypes.func,
  publisherCounts: PropTypes.array,
  publishers: PropTypes.object,

  hitsPerPage: PropTypes.number,

  history: PropTypes.object,
  location: PropTypes.object
};

export const ResultsInformationModel = withRouter(ResultsInformationModelPure);
