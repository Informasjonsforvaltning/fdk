import React from 'react';
import PropTypes from 'prop-types';
import ReactPaginate from 'react-paginate';

import localization from '../localization';
import ConceptsHitItem from '../search-concepts-hit-item';
import CompareTerms from '../search-concepts-compare';
import CompareTermModal from '../search-concepts-compare-modal';

export default class ResultsConcepts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      terms: []
    }
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
    const children = items => items.map((item, index) => {
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
          <h3 className="mb-2">
            {localization.terms.compareTerms}
          </h3>
          {children(terms)}
          {compareButton}
        </div>
      )
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

  render() {
    const { termItems, onPageChange, searchQuery, hitsPerPage } = this.props;
    const page = (searchQuery && searchQuery.from) ? (searchQuery.from / hitsPerPage) : 0;
    const pageCount = Math.ceil( ((termItems && termItems.hits) ? termItems.hits.total : 1) / hitsPerPage);

    return (
      <div>
        <div id="content" role="main">
          <div className="container">
            <div id="conceptsPanel">
              <div className="row">
                <div className="col-sm-4">
                  { this._renderCompareTerms() }
                </div>
                <div id="concepts" className="col-sm-8">
                  {this._renderTerms()}
                </div>
                <div className="col-xs-12 col-md-8 col-md-offset-4 text-center">
                  <span className="uu-invisible" aria-hidden="false">Sidepaginering.</span>
                  <ReactPaginate
                    previousLabel={localization.page.prev}
                    nextLabel={localization.page.next}
                    breakLabel={<span>...</span>}
                    breakClassName={"break-me"}
                    pageCount={pageCount}
                    marginPagesDisplayed={1}
                    pageRangeDisplayed={2}
                    containerClassName={"pagination"}
                    onPageChange={onPageChange}
                    subContainerClassName={"pages pagination"}
                    activeClassName={"active"}
                    initialPage={page}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ResultsConcepts.defaultProps = {
  selectedLanguageCode: '',
  isSelected: false
};

ResultsConcepts.propTypes = {
  selectedLanguageCode: PropTypes.string,
  isSelected: PropTypes.bool
};
