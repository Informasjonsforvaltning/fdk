import React from 'react';
import PropTypes from 'prop-types';
import ReactPaginate from 'react-paginate';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import cx from 'classnames';

import localization from '../../../lib/localization';
import { SearchHitItem } from './search-hit-item/search-hit-item.component';
import { SearchPublishersTree } from '../search-publishers-tree/search-publishers-tree.component';

const renderFilterModal = ({
  showFilterModal,
  closeFilterModal,
  searchQuery,
  publisherArray,
  publishers,
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

// eslint-disable-next-line react/prefer-stateless-function
export class ResultsInformationModel extends React.Component {
  componentWillMount() {
    const {
      informationModelSortValue,
      setInformationModelSort,
      onSortByLastModified,
      onSortByScore
    } = this.props;
    const urlHasSortfieldModified =
      window.location.href.indexOf('sortfield=modified') !== -1;
    const informationModelIsModified = informationModelSortValue === 'modified';

    if (informationModelIsModified || urlHasSortfieldModified) {
      setInformationModelSort('modified');
      onSortByLastModified();
    } else {
      onSortByScore();
      setInformationModelSort(undefined);
    }
  }
  render() {
    const {
      showFilterModal,
      closeFilterModal,
      informationModelItems,
      informationModelTotal,
      informationModelAggregations,
      onFilterAccessRights,
      onFilterPublisherHierarchy,
      searchQuery,
      publisherArray,
      publishers,
      onClearFilters,
      onPageChange,
      showClearFilterButton,
      hitsPerPage,
      onSortByScore,
      onSortByLastModified,
      informationModelSortValue,
      setInformationModelSort
    } = this.props;

    const page =
      searchQuery && searchQuery.from ? searchQuery.from / hitsPerPage : 0;
    const pageCount = Math.ceil((informationModelTotal || 1) / hitsPerPage);

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
      selected: !informationModelSortValue
    });
    const sortByLastModifiedClass = cx(
      'fdk-button',
      'fdk-button-black-toggle',
      {
        selected: informationModelSortValue === 'modified'
      }
    );

    const onSortByScoreClick = () => {
      setInformationModelSort(undefined);
      onSortByScore();
    };
    const onSortByModifiedClick = () => {
      setInformationModelSort('modified');
      onSortByLastModified();
    };

    return (
      <main data-test-id="informationModels" id="content">
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
            {informationModelAggregations && (
              <div>
                {renderFilterModal({
                  showFilterModal,
                  closeFilterModal,
                  informationModelItems,
                  informationModelAggregations,
                  onFilterAccessRights,
                  searchQuery,
                  publisherArray,
                  publishers,
                  onFilterPublisherHierarchy
                })}
                <SearchPublishersTree
                  title={localization.facet.provider}
                  filter={publisherArray}
                  onFilterPublisherHierarchy={onFilterPublisherHierarchy}
                  activeFilter={searchQuery.orgPath}
                  publishers={publishers}
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

ResultsInformationModel.defaultProps = {
  showFilterModal: false,
  closeFilterModal: null,
  informationModelItems: [],
  informationModelTotal: 0,
  informationModelAggregations: null,
  onFilterAccessRights: null,
  onFilterPublisherHierarchy: null,
  searchQuery: {},
  publisherArray: null,
  publishers: null,
  onClearFilters: null,
  setInformationModelSort: null,
  onPageChange: null,
  showClearFilterButton: null,
  hitsPerPage: null
};

ResultsInformationModel.propTypes = {
  showFilterModal: PropTypes.bool,
  closeFilterModal: PropTypes.func,
  informationModelItems: PropTypes.array,
  informationModelTotal: PropTypes.number,
  informationModelAggregations: PropTypes.object,
  onFilterAccessRights: PropTypes.func,
  onFilterPublisherHierarchy: PropTypes.func,
  searchQuery: PropTypes.object,
  publisherArray: PropTypes.array,
  publishers: PropTypes.object,
  onClearFilters: PropTypes.func,
  setInformationModelSort: PropTypes.func,
  onSortByLastModified: PropTypes.func.isRequired,
  onSortByScore: PropTypes.func.isRequired,
  onPageChange: PropTypes.func,
  showClearFilterButton: PropTypes.bool,
  hitsPerPage: PropTypes.number
};
