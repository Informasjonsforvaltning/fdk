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
  publisherArray,
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
          filter={publisherArray}
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
      onFilterAccessRights,
      onFilterPublisherHierarchy,
      onFilterFormat,
      searchQuery,
      publisherArray,
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

    const page =
      searchQuery && searchQuery.from ? searchQuery.from / hitsPerPage : 0;
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
                  apiItems,
                  apiAggregations,
                  onFilterAccessRights,
                  searchQuery,
                  publisherArray,
                  publishers,
                  onFilterFormat,
                  onFilterPublisherHierarchy
                })}
                <SearchPublishersTree
                  title={localization.facet.provider}
                  filter={publisherArray}
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

            {_.get(apiItems, 'total', 0) > 50 && (
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
            )}
          </div>
        </div>
      </main>
    );
  }
}

ResultsApi.defaultProps = {
  showFilterModal: false,
  closeFilterModal: null,
  apiItems: [],
  apiTotal: 0,
  apiAggregations: null,
  onFilterAccessRights: null,
  onFilterPublisherHierarchy: null,
  onFilterFormat: null,
  searchQuery: {},
  publisherArray: null,
  publishers: null,
  onClearFilters: null,
  onPageChange: null,
  showClearFilterButton: null,
  hitsPerPage: null
};

ResultsApi.propTypes = {
  showFilterModal: PropTypes.bool,
  closeFilterModal: PropTypes.func,
  apiItems: PropTypes.array,
  apiTotal: PropTypes.number,
  apiAggregations: PropTypes.object,
  onFilterAccessRights: PropTypes.func,
  onFilterPublisherHierarchy: PropTypes.func,
  onFilterFormat: PropTypes.func,
  searchQuery: PropTypes.object,
  publisherArray: PropTypes.array,
  publishers: PropTypes.object,
  onClearFilters: PropTypes.func,
  onSortByLastModified: PropTypes.func.isRequired,
  onSortByScore: PropTypes.func.isRequired,
  onPageChange: PropTypes.func,
  showClearFilterButton: PropTypes.bool,
  hitsPerPage: PropTypes.number
};
