import React from 'react';
import PropTypes from 'prop-types';
import ReactPaginate from 'react-paginate';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import cx from 'classnames';
import _get from 'lodash/get';
import _capitalize from 'lodash/capitalize';
import _ from 'lodash';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';

import {
  PATHNAME_CONCEPTS,
  PATHNAME_CONCEPTS_COMPARE
} from '../../../constants/constants';
import localization from '../../../lib/localization';
import { ConceptsHitItem } from './concepts-hit-item/concepts-hit-item.component';
import { CompareTerms } from './compare-terms/compare-terms.component';
import { FilterTree } from '../filter-tree/filter-tree.component';
import { getTranslateText } from '../../../lib/translateText';
import { getSortfield, setPage, setSortfield } from '../search-location-helper';
import { parseSearchParams } from '../../../lib/location-history-helper';
import { FilterPills } from '../filter-pills/filter-pills.component';

function _renderCompareTerms({ conceptsCompare, removeConcept }) {
  const conceptIdsArray = [];
  const children = items =>
    Object.keys(items).map(el => {
      const item = items[el];
      conceptIdsArray.push(item.id);
      const { publisher } = item;
      const publisherPrefLabel =
        getTranslateText(_get(publisher, ['prefLabel'])) ||
        _capitalize(_get(publisher, 'name', ''));

      return (
        <CompareTerms
          key={item.uri}
          uri={item.id}
          prefLabel={item.prefLabel}
          creator={publisherPrefLabel}
          onDeleteTerm={removeConcept}
        />
      );
    });

  if (conceptsCompare && Object.keys(conceptsCompare).length > 0) {
    return (
      <div className="mt-5">
        <h3 className="mb-3">{localization.terms.compareTerms}</h3>
        {children(conceptsCompare)}
        <div className="d-flex justify-content-center">
          <Link
            to={`${PATHNAME_CONCEPTS}${PATHNAME_CONCEPTS_COMPARE}?compare=${conceptIdsArray}`}
          >
            {localization.compare.openCompare}
          </Link>
        </div>
      </div>
    );
  }
  return null;
}

function _renderTerms({
  conceptItems,
  conceptsCompare,
  addConcept,
  removeConcept
}) {
  if (conceptItems && Array.isArray(conceptItems)) {
    return conceptItems.map(
      item =>
        item && (
          <ConceptsHitItem
            key={item.id}
            result={item}
            concepts={conceptsCompare}
            onAddConcept={addConcept}
            onDeleteConcept={removeConcept}
          />
        )
    );
  }
  return null;
}

function _renderFilterModal({
  showFilterModal,
  closeFilterModal,
  onFilterPublisherHierarchy,
  locationSearch,
  publisherCounts,
  publishers
}) {
  return (
    <Modal isOpen={showFilterModal} toggle={closeFilterModal}>
      <ModalHeader toggle={closeFilterModal}>Filter</ModalHeader>
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
        <Button
          className="fdk-button-default fdk-button"
          onClick={closeFilterModal}
        >
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
}

export const ResultsConceptsPure = ({
  showFilterModal,
  closeFilterModal,
  conceptAggregations,
  conceptTotal,
  onFilterPublisherHierarchy,
  hitsPerPage,
  publisherCounts,
  publishers,
  conceptItems,
  conceptsCompare,
  addConcept,
  removeConcept,
  history,
  location
}) => {
  const locationSearch = parseSearchParams(location);

  const page = parseInt(locationSearch.page || 0, 10);
  const pageCount = Math.ceil((conceptTotal || 1) / hitsPerPage);

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
    <main id="content">
      <section className="row mb-3">
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
      </section>

      <section className="row">
        <aside className="search-filters col-lg-4">
          <div className="d-none d-lg-block">
            <span className="uu-invisible" aria-hidden="false">
              Filtrering tilgang
            </span>

            <FilterPills
              history={history}
              location={location}
              locationSearch={locationSearch}
              publishers={publishers}
            />

            {conceptAggregations && (
              <div>
                {_renderFilterModal({
                  showFilterModal,
                  closeFilterModal,
                  onFilterPublisherHierarchy,
                  locationSearch,
                  publisherCounts,
                  publishers
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
          </div>
          {_renderCompareTerms({ conceptsCompare, removeConcept })}
        </aside>

        <section className="col-lg-8">
          {_renderTerms({
            conceptItems,
            conceptsCompare,
            addConcept,
            removeConcept
          })}
        </section>

        <section className="col-lg-8 offset-lg-4 d-flex justify-content-center">
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

ResultsConceptsPure.defaultProps = {
  showFilterModal: false,
  closeFilterModal: _.noop,

  conceptItems: [],
  conceptTotal: 0,
  conceptAggregations: null,

  onFilterPublisherHierarchy: _.noop,

  publisherCounts: [],
  publishers: null,

  hitsPerPage: 10,

  conceptsCompare: {},
  addConcept: _.noop,
  removeConcept: _.noop,

  history: { push: _.noop },
  location: { search: '' }
};

ResultsConceptsPure.propTypes = {
  showFilterModal: PropTypes.bool,
  closeFilterModal: PropTypes.func,

  conceptItems: PropTypes.array,
  conceptTotal: PropTypes.number,
  conceptAggregations: PropTypes.object,

  onFilterPublisherHierarchy: PropTypes.func,
  publisherCounts: PropTypes.array,
  publishers: PropTypes.object,

  hitsPerPage: PropTypes.number,

  conceptsCompare: PropTypes.object,
  addConcept: PropTypes.func,
  removeConcept: PropTypes.func,

  history: PropTypes.object,
  location: PropTypes.object
};

export const ResultsConcepts = withRouter(ResultsConceptsPure);
