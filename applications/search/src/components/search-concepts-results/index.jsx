import React from 'react';
import PropTypes from 'prop-types';
import {
  SearchkitManager,
  SearchkitProvider,
  Hits,
  HitsStats,
  Pagination,
  TopBar
} from 'searchkit';
import createHistory from 'history/createBrowserHistory'; // eslint-disable-line import/no-unresolved, import/extensions
import ReactPaginate from 'react-paginate';

import { TermsQueryTransport } from '../../utils/TermsQueryTransport';
import localization from '../localization';
import { SearchBox } from '../search-results-searchbox';
import ConceptsHitItem from '../search-concepts-hit-item';
import CustomHitsStats from '../search-result-custom-hitstats';
import ResultsTabs from '../search-results-tabs';
import CompareTerms from '../search-concepts-compare';
import CompareTermModal from '../search-concepts-compare-modal';

const host = '/dcat';
let searchkitConcepts;


export default class ResultsConcepts extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      terms: []
    }

    const history = createHistory();
    history.listen( location => {
      this.props.onHistoryListen(history, location);
    });

    searchkitConcepts = new SearchkitManager(
      host,
      {
        transport: new TermsQueryTransport(),
        createHistory: ()=> history
      }
    );

    searchkitConcepts.translateFunction = (key) => {
      const translations = {
        'pagination.previous': localization.page.prev,
        'pagination.next': localization.page.next,
        'facets.view_more': localization.page.viewmore,
        'facets.view_all': localization.page.seeall,
        'facets.view_less': localization.page.seefewer,
        'reset.clear_all': localization.page.resetfilters,
        'hitstats.results_found': `${localization.page['result.summary']} {numberResults} ${localization.page.dataset}`,
        'NoHits.Error': localization.noHits.error,
        'NoHits.ResetSearch': '.',
        'sort.by': localization.sort.by,
        'sort.relevance': localization.sort.relevance,
        'sort.title': localization.sort.title,
        'sort.publisher': localization.sort.publisher,
        'sort.modified': localization.sort.modified
      };
      return translations[key];
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
    const { history, termItems, onFilterTheme, onFilterAccessRights, onFilterPublisher, onSort, onPageChange, searchQuery, themesItems, hitsPerPage } = this.props;
    const conceptsHitItemWithProps = React.createElement(ConceptsHitItem, {
      terms: this.state.terms,
      onAddTerm: this.handleAddTerm,
      onDeleteTerm: this.handleDeleteTerm,
      selectedLanguageCode: this.props.selectedLanguageCode
    });

    const conceptsHitStatsWithProps = React.createElement(CustomHitsStats, {
      prefLabel: localization.page['nosearch.concepts']
    });

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


        <SearchkitProvider searchkit={searchkitConcepts}>
          <div>
            <div className="container">

              <div className="row mb-60">
                <div className="col-md-12">
                  <TopBar>
                    <SearchBox
                      searchOnChange={false}
                      placeholder={localization.query.intro}
                    />
                  </TopBar>
                </div>
                <div className="col-md-12 text-center">
                  <HitsStats component={conceptsHitStatsWithProps} />
                </div>
              </div>

              <div id="conceptsPanel">
                <div className="row">
                  <div className="col-sm-4">
                    { this._renderCompareTerms() }
                  </div>
                  <div id="concepts" className="col-sm-8">
                    <Hits
                      mod="sk-hits-grid"
                      hitsPerPage={50}
                      itemComponent={conceptsHitItemWithProps}
                      sourceFilter={['title', 'description', 'keyword', 'catalog', 'theme', 'publisher', 'contactPoint', 'distribution']}
                    />
                    <Pagination
                      showNumbers
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SearchkitProvider>
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
