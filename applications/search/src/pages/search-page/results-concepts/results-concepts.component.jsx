import React from 'react';
import PropTypes from 'prop-types';
import ReactPaginate from 'react-paginate';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import cx from 'classnames';
import _get from 'lodash/get';
import _capitalize from 'lodash/capitalize';
import _ from 'lodash';
import { Link } from 'react-router-dom';

import {
  PATHNAME_CONCEPTS,
  PATHNAME_CONCEPTS_COMPARE
} from '../../../constants/constants';
import localization from '../../../lib/localization';
import { ConceptsHitItem } from './concepts-hit-item/concepts-hit-item.component';
import { CompareTerms } from './compare-terms/compare-terms.component';
import { SearchPublishersTree } from '../search-publishers-tree/search-publishers-tree.component';
import { getTranslateText } from '../../../lib/translateText';

export class ResultsConcepts extends React.Component {
  componentWillMount() {
    const urlHasSortfieldModified =
      window.location.href.indexOf('sortfield=modified') !== -1;
    const conceptSortValueIsModified =
      this.props.conceptSortValue === 'modified';

    if (conceptSortValueIsModified || urlHasSortfieldModified) {
      this.props.setConceptSort('modified');
      this.props.onSortByLastModified();
    } else {
      this.props.onSortByScore();
      this.props.setConceptSort(undefined);
    }
  }
  _renderCompareTerms() {
    const { conceptsCompare } = this.props;
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
            onDeleteTerm={this.props.removeConcept}
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

  _renderTerms() {
    const { conceptItems, conceptsCompare } = this.props;
    if (conceptItems && Array.isArray(conceptItems)) {
      return conceptItems.map(item => (
        <ConceptsHitItem
          key={item.id}
          result={item}
          concepts={conceptsCompare}
          onAddConcept={this.props.addConcept}
          onDeleteConcept={this.props.removeConcept}
        />
      ));
    }
    return null;
  }

  _renderFilterModal() {
    const {
      showFilterModal,
      closeFilterModal,
      onFilterPublisherHierarchy,
      searchQuery,
      publisherCounts,
      publishers
    } = this.props;
    return (
      <Modal isOpen={showFilterModal} toggle={closeFilterModal}>
        <ModalHeader toggle={closeFilterModal}>Filter</ModalHeader>
        <ModalBody>
          <div className="search-filters">
            <SearchPublishersTree
              title={localization.facet.organisation}
              publisherCounts={publisherCounts}
              onFilterPublisherHierarchy={onFilterPublisherHierarchy}
              activeFilter={searchQuery.orgPath}
              publishers={publishers}
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

  render() {
    const {
      conceptAggregations,
      conceptTotal,
      onClearFilters,
      onPageChange,
      onFilterPublisherHierarchy,
      searchQuery,
      showClearFilterButton,
      hitsPerPage,
      publisherCounts,
      publishers,
      onSortByScore,
      onSortByLastModified,
      conceptSortValue,
      setConceptSort
    } = this.props;
    const page = (searchQuery && searchQuery.page) || 0;
    const pageCount = Math.ceil((conceptTotal || 1) / hitsPerPage);
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
      selected: !conceptSortValue
    });
    const sortByLastModifiedClass = cx(
      'fdk-button',
      'fdk-button-black-toggle',
      {
        selected: conceptSortValue === 'modified'
      }
    );

    const onSortByScoreClick = () => {
      setConceptSort(undefined);
      onSortByScore();
    };
    const onSortByModifiedClick = () => {
      setConceptSort('modified');
      onSortByLastModified();
    };

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
              {conceptAggregations && (
                <div>
                  {this._renderFilterModal()}
                  <SearchPublishersTree
                    title={localization.facet.organisation}
                    publisherCounts={publisherCounts}
                    onFilterPublisherHierarchy={onFilterPublisherHierarchy}
                    activeFilter={_.get(searchQuery, 'orgPath')}
                    publishers={publishers}
                  />
                </div>
              )}
            </div>
            {this._renderCompareTerms()}
          </aside>

          <section className="col-lg-8">{this._renderTerms()}</section>

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
              initialPage={page}
              disableInitialCallback
            />
          </section>
        </section>
      </main>
    );
  }
}

ResultsConcepts.defaultProps = {
  showFilterModal: false,
  closeFilterModal: _.noop,
  showClearFilterButton: false,

  conceptItems: [],
  conceptTotal: 0,
  conceptAggregations: null,

  onClearFilters: _.noop,
  onFilterPublisherHierarchy: _.noop,
  searchQuery: null,

  publisherCounts: [],
  publishers: null,

  onPageChange: _.noop,
  hitsPerPage: 0,
  setConceptSort: _.noop,
  conceptSortValue: '',

  conceptsCompare: null,
  addConcept: _.noop,
  removeConcept: _.noop
};

ResultsConcepts.propTypes = {
  showFilterModal: PropTypes.bool,
  closeFilterModal: PropTypes.func,
  showClearFilterButton: PropTypes.bool,

  conceptItems: PropTypes.array,
  conceptTotal: PropTypes.number,
  conceptAggregations: PropTypes.object,

  onClearFilters: PropTypes.func,
  onFilterPublisherHierarchy: PropTypes.func,
  searchQuery: PropTypes.object,

  publisherCounts: PropTypes.array,
  publishers: PropTypes.object,

  onSortByLastModified: PropTypes.func.isRequired,
  onSortByScore: PropTypes.func.isRequired,
  onPageChange: PropTypes.func,
  hitsPerPage: PropTypes.number,
  setConceptSort: PropTypes.func,
  conceptSortValue: PropTypes.string,

  conceptsCompare: PropTypes.object,
  addConcept: PropTypes.func,
  removeConcept: PropTypes.func
};
