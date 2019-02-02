import React from 'react';
import PropTypes from 'prop-types';
import ReactPaginate from 'react-paginate';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import cx from 'classnames';
import _ from 'lodash';

import localization from '../../../lib/localization';
import { SearchHitItem } from './search-hit-item/search-hit-item.component';
import { FilterBox } from '../../../components/filter-box/filter-box.component';
import { SearchPublishersTree } from '../search-publishers-tree/search-publishers-tree.component';

const renderFilterModal = ({
  showFilterModal,
  closeFilterModal,
  apiAggregations,
  searchQuery,
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
          activeFilter={searchQuery.orgPath}
          publishers={publishers}
        />
        <FilterBox
          htmlKey={2}
          title={localization.facet.format}
          filter={_.get(apiAggregations, 'formats')}
          onClick={onFilterFormat}
          activeFilter={searchQuery.format}
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

export class ResultsApi extends React.Component {
  componentWillMount() {
    const urlHasSortfieldModified =
      window.location.href.indexOf('sortfield=modified') !== -1;
    const apiSortValueIsModified = this.props.apiSortValue === 'modified';

    if (apiSortValueIsModified || urlHasSortfieldModified) {
      this.props.setApiSort('modified');
      this.props.onSortByLastModified();
    } else {
      this.props.onSortByScore();
      this.props.setApiSort(undefined);
    }
  }
  render() {
    const {
      showFilterModal,
      closeFilterModal,
      apiItems,
      apiTotal,
      apiAggregations,
      onFilterPublisherHierarchy,
      onFilterFormat,
      searchQuery,
      publisherCounts,
      publishers,
      onClearFilters,
      onPageChange,
      showClearFilterButton,
      hitsPerPage,
      onSortByScore,
      onSortByLastModified,
      apiSortValue,
      setApiSort
    } = this.props;

    const page = (searchQuery && searchQuery.page) || 0;
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
    const sortByScoreClass = cx('fdk-button', 'fdk-button-black-toggle', {
      selected: !apiSortValue
    });
    const sortByLastModifiedClass = cx(
      'fdk-button',
      'fdk-button-black-toggle',
      {
        selected: apiSortValue === 'modified'
      }
    );

    const onSortByScoreClick = () => {
      setApiSort(undefined);
      onSortByScore();
    };
    const onSortByModifiedClick = () => {
      setApiSort('modified');
      onSortByLastModified();
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
                  searchQuery,
                  publisherCounts,
                  publishers,
                  onFilterFormat,
                  onFilterPublisherHierarchy
                })}
                <SearchPublishersTree
                  title={localization.facet.provider}
                  publisherCounts={publisherCounts}
                  onFilterPublisherHierarchy={onFilterPublisherHierarchy}
                  activeFilter={searchQuery.orgPath}
                  publishers={publishers}
                />
                <FilterBox
                  htmlKey={2}
                  title={localization.facet.format}
                  filter={_.get(apiAggregations, 'formats')}
                  onClick={onFilterFormat}
                  activeFilter={searchQuery.format}
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
  }
}

ResultsApi.defaultProps = {
  showFilterModal: false,
  closeFilterModal: _.noop,
  showClearFilterButton: false,

  apiItems: [],
  apiTotal: 0,
  apiAggregations: null,

  onFilterPublisherHierarchy: _.noop,
  onFilterFormat: _.noop,
  onClearFilters: _.noop,
  searchQuery: {},

  publisherCounts: null,
  publishers: null,

  onPageChange: _.noop,
  hitsPerPage: 0,
  apiSortValue: ''
};

ResultsApi.propTypes = {
  showFilterModal: PropTypes.bool,
  closeFilterModal: PropTypes.func,
  showClearFilterButton: PropTypes.bool,

  apiItems: PropTypes.array,
  apiTotal: PropTypes.number,
  apiAggregations: PropTypes.object,

  onFilterPublisherHierarchy: PropTypes.func,
  onFilterFormat: PropTypes.func,
  onClearFilters: PropTypes.func,
  searchQuery: PropTypes.object,

  publisherCounts: PropTypes.array,
  publishers: PropTypes.object,

  onSortByLastModified: PropTypes.func.isRequired,
  onSortByScore: PropTypes.func.isRequired,
  onPageChange: PropTypes.func,
  hitsPerPage: PropTypes.number,
  setApiSort: PropTypes.func.isRequired,
  apiSortValue: PropTypes.string
};
