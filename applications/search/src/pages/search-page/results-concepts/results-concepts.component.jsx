import React from 'react';
import PropTypes from 'prop-types';
import ReactPaginate from 'react-paginate';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import cx from 'classnames';
import _get from 'lodash/get';
import _capitalize from 'lodash/capitalize';

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
      terms: []
    };
    this.handleAddTerm = this.handleAddTerm.bind(this);
    this.handleDeleteTerm = this.handleDeleteTerm.bind(this);
  }

  handleAddTerm(term) {
    this.setState({
      terms: [...this.state.terms, term]
    });
  }

  handleDeleteTerm(termIndex) {
    const { terms } = this.state;
    terms.splice(termIndex, 1);
    this.setState({
      terms
    });
  }

  _renderCompareTerms() {
    const { terms } = this.state;
    const children = items =>
      items.map((item, index) => {
        const { creator } = item;

        const publisherPrefLabel =
          getTranslateText(_get(creator, ['prefLabel'])) ||
          _capitalize(_get(creator, 'name', ''));

        return (
          <CompareTerms
            key={item.uri}
            prefLabel={item.prefLabel}
            creator={publisherPrefLabel}
            onDeleteTerm={this.handleDeleteTerm}
            termIndex={index}
          />
        );
      });

    const compareButton = (
      <CompareTermModal
        terms={terms}
        handleDeleteTerm={this.handleDeleteTerm}
      />
    );

    if (terms && terms.length > 0) {
      return (
        <div>
          <h3 className="mb-2">{localization.terms.compareTerms}</h3>
          {children(terms)}
          {compareButton}
        </div>
      );
    }
    return null;
  }

  _renderTerms() {
    const { termItems } = this.props;
    if (termItems && termItems.hits && termItems.hits.hits) {
      return termItems.hits.hits.map(item => (
        <ConceptsHitItem
          key={item._id}
          result={item}
          terms={this.state.terms}
          onAddTerm={this.handleAddTerm}
          onDeleteTerm={this.handleDeleteTerm}
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
      termItems,
      onClearSearch,
      onPageChange,
      onFilterPublisherHierarchy,
      searchQuery,
      showClearFilterButton,
      hitsPerPage,
      publisherArray,
      publishers
    } = this.props;
    const page =
      searchQuery && searchQuery.from ? searchQuery.from / hitsPerPage : 0;
    const pageCount = Math.ceil(
      (termItems && termItems.hits ? termItems.hits.total : 1) / hitsPerPage
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
              onClick={onClearSearch}
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
              {termItems &&
                termItems.aggregations && (
                  <div>
                    {this._renderFilterModal()}
                    <SearchPublishersTree
                      title={localization.facet.organisation}
                      filter={publisherArray}
                      onFilterPublisherHierarchy={onFilterPublisherHierarchy}
                      activeFilter={searchQuery.orgPath}
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
  termItems: null,
  onClearSearch: null,
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
  termItems: PropTypes.object,
  onClearSearch: PropTypes.func,
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
