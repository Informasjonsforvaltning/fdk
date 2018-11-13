import React from 'react';
import PropTypes from 'prop-types';
import ReactPaginate from 'react-paginate';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import cx from 'classnames';
import _get from 'lodash/get';
import _capitalize from 'lodash/capitalize';
import _ from 'lodash';

import localization from '../../../lib/localization';
import { ConceptsHitItem } from './concepts-hit-item/concepts-hit-item.component';
import { CompareTerms } from './compare-terms/compare-terms.component';
import { CompareTermModal } from './compare-term-modal/compare-term-modal.component';
import { SearchPublishersTree } from '../search-publishers-tree/search-publishers-tree.component';
import { getTranslateText } from '../../../lib/translateText';

export class ResultsConcepts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      concepts: []
    };
    this.handleAddConcept = this.handleAddConcept.bind(this);
    this.handleDeleteConcept = this.handleDeleteConcept.bind(this);
  }

  handleAddConcept(term) {
    this.setState({
      concepts: [...this.state.concepts, term]
    });
  }

  handleDeleteConcept(uri) {
    const { concepts } = this.state;
    const filteredItems = concepts.filter(item => item.uri !== uri);
    this.setState({
      concepts: filteredItems
    });
  }

  _renderCompareTerms() {
    const { concepts } = this.state;
    const children = items =>
      items.map(item => {
        const { publisher } = item;
        const publisherPrefLabel =
          getTranslateText(_get(publisher, ['prefLabel'])) ||
          _capitalize(_get(publisher, 'name', ''));

        return (
          <CompareTerms
            key={item.uri}
            uri={item.uri}
            prefLabel={item.prefLabel}
            creator={publisherPrefLabel}
            onDeleteTerm={this.handleDeleteConcept}
          />
        );
      });

    const compareButton = (
      <CompareTermModal
        terms={concepts}
        handleDeleteTerm={this.handleDeleteConcept}
      />
    );

    if (concepts && concepts.length > 0) {
      return (
        <div className="mt-4">
          <h3 className="mb-2">{localization.terms.compareTerms}</h3>
          {children(concepts)}
          {compareButton}
        </div>
      );
    }
    return null;
  }

  _renderTerms() {
    const { conceptItems } = this.props;
    if (_.get(conceptItems, ['_embedded', 'concepts'])) {
      return _.get(conceptItems, ['_embedded', 'concepts']).map(item => (
        <ConceptsHitItem
          key={item.id}
          result={item}
          concepts={this.state.concepts}
          onAddConcept={this.handleAddConcept}
          onDeleteConcept={this.handleDeleteConcept}
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
      publisherArray,
      publishers
    } = this.props;
    return (
      <Modal isOpen={showFilterModal} toggle={closeFilterModal}>
        <ModalHeader toggle={closeFilterModal}>Filter</ModalHeader>
        <ModalBody>
          <div className="search-filters">
            <SearchPublishersTree
              title={localization.facet.organisation}
              filter={publisherArray}
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
      conceptItems,
      onClearFilters,
      onPageChange,
      onFilterPublisherHierarchy,
      searchQuery,
      showClearFilterButton,
      hitsPerPage,
      publisherArray,
      publishers
    } = this.props;
    const page = _.get(searchQuery, 'from')
      ? searchQuery.from / hitsPerPage
      : 0;
    const pageCount = Math.ceil(
      (_.get(conceptItems, ['page', 'totalElements'])
        ? conceptItems.page.totalElements
        : 1) / hitsPerPage
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
        <section className="row mb-3 fdk-button-row">
          <div className="col-lg-4">
            <button
              className={clearButtonClass}
              onClick={onClearFilters}
              type="button"
            >
              {localization.query.clear}
            </button>
          </div>
        </section>

        <section className="row">
          <aside className="search-filters col-lg-4">
            <div className="d-none d-lg-block">
              <span className="uu-invisible" aria-hidden="false">
                Filtrering tilgang
              </span>
              {_.get(conceptItems, 'aggregations') && (
                <div>
                  {this._renderFilterModal()}
                  <SearchPublishersTree
                    title={localization.facet.organisation}
                    filter={publisherArray}
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

          {_.get(conceptItems, ['page', 'totalElements'], 0) > 50 && (
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
          )}
        </section>
      </main>
    );
  }
}

ResultsConcepts.defaultProps = {
  conceptItems: null,
  onClearFilters: null,
  onPageChange: null,
  onFilterPublisherHierarchy: null,
  searchQuery: null,
  hitsPerPage: null,
  showFilterModal: null,
  closeFilterModal: null,
  showClearFilterButton: null,
  publisherArray: null,
  publishers: null
};

ResultsConcepts.propTypes = {
  conceptItems: PropTypes.object,
  onClearFilters: PropTypes.func,
  onPageChange: PropTypes.func,
  onFilterPublisherHierarchy: PropTypes.func,
  searchQuery: PropTypes.object,
  hitsPerPage: PropTypes.number,
  showFilterModal: PropTypes.bool,
  closeFilterModal: PropTypes.func,
  showClearFilterButton: PropTypes.bool,
  publisherArray: PropTypes.array,
  publishers: PropTypes.object
};
