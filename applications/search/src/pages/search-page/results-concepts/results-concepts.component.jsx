import React from 'react';
import PropTypes from 'prop-types';
import ReactPaginate from 'react-paginate';
import { Modal, Button } from 'react-bootstrap';
import cx from 'classnames';

import localization from '../../../lib/localization';
import { ConceptsHitItem } from './concepts-hit-item/concepts-hit-item.component';
import { CompareTerms } from './compare-terms/compare-terms.component';
import { CompareTermModal } from './compare-term-modal/compare-term-modal.component';
import { SearchPublishersTree } from '../search-publishers-tree/search-publishers-tree.component';

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
    const terms = this.state.terms;
    terms.splice(termIndex, 1);
    this.setState({
      terms
    });
  }

  _renderCompareTerms() {
    const { terms } = this.state;
    const children = items =>
      items.map((item, index) => {
        let creator;
        if (item.creator && item.creator.name) {
          creator = item.creator.name;
        }
        return (
          <CompareTerms
            key={item.uri}
            prefLabel={item.prefLabel}
            creator={creator}
            onDeleteTerm={this.handleDeleteTerm}
            termIndex={index}
            selectedLanguageCode={this.props.selectedLanguageCode}
          />
        );
      });

    const compareButton = (
      <CompareTermModal
        terms={terms}
        handleDeleteTerm={this.handleDeleteTerm}
        selectedLanguageCode={this.props.selectedLanguageCode}
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
          selectedLanguageCode={this.props.selectedLanguageCode}
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
      <Modal show={showFilterModal} onHide={closeFilterModal}>
        <Modal.Header closeButton>
          <Modal.Title>Filter</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="search-filters">
            <SearchPublishersTree
              title={localization.facet.organisation}
              filter={publisherArray}
              onFilterPublisherHierarchy={onFilterPublisherHierarchy}
              activeFilter={searchQuery.orgPath}
              publishers={publishers}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="fdk-button-default fdk-button"
            onClick={closeFilterModal}
          >
            Close
          </Button>
        </Modal.Footer>
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
      'fdk-button',
      'fdk-button-default-no-hover',
      'fade-in-500',
      {
        hidden: !showClearFilterButton
      }
    );

    return (
      <div id="content" role="main">
        <div id="conceptsPanel">
          <div className="row mt-1 mb-1-em fdk-button-row">
            <div className="col-md-4">
              <button
                className={clearButtonClass}
                onClick={onClearSearch}
                type="button"
              >
                {localization.query.clear}
              </button>
            </div>
          </div>

          <div className="row">
            <div className="search-filters col-sm-4 col-md-4 flex-move-first-item-to-bottom">
              <div className="visible-sm visible-md visible-lg">
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
            </div>

            <div id="concepts" className="col-sm-8">
              {this._renderTerms()}
            </div>
            <div className="col-xs-12 col-md-8 col-md-offset-4 text-center">
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
                breakClassName={'break-me'}
                containerClassName={'pagination'}
                onPageChange={onPageChange}
                subContainerClassName={'pages pagination'}
                activeClassName={'active'}
                initialPage={page}
                disableInitialCallback
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ResultsConcepts.defaultProps = {
  selectedLanguageCode: null,
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
  selectedLanguageCode: PropTypes.string,
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
