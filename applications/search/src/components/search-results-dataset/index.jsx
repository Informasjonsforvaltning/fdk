import React from 'react';
import PropTypes from 'prop-types';
import {
  SearchkitManager,
  SearchkitProvider,
  RefinementListFilter,
  Hits,
  HitsStats,
  Pagination,
  SortingSelector,
  TopBar
} from 'searchkit';
import createHistory from 'history/createBrowserHistory'; // eslint-disable-line import/no-unresolved, import/extensions
import { Modal, Button } from 'react-bootstrap';
import { DatasetsQueryTransport } from '../../utils/DatasetsQueryTransport';
import localization from '../localization';
import RefinementOptionThemes from '../search-refinementoption-themes';
import RefinementOptionPublishers from '../search-refinementoption-publishers';
import RefinementOptionPublishersMobile from '../search-refinementoption-publishers-mobile';
import { SearchBox } from '../search-results-searchbox';
import SearchHitItem from '../search-results-hit-item';
import SelectDropdown from '../search-results-selector-dropdown';
import CustomHitsStats from '../search-result-custom-hitstats';
import ResultsTabs from '../search-results-tabs';

const host = '/dcat';

let searchkitDataset;

export default class ResultsDataset extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false
    }

    const history = createHistory();
    history.listen( location => {
      this.props.onHistoryListen(history, location);
    });

    searchkitDataset = new SearchkitManager(
      host,
      {
        transport: new DatasetsQueryTransport(),
        createHistory: ()=> history
      }
    );
    searchkitDataset.translateFunction = (key) => {
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

    this.close = this.close.bind(this);
    this.open = this.open.bind(this);
  }

  _renderPublisherRefinementListFilter() {
    this.publisherFilter =
      (<RefinementListFilter
        id="publisher"
        title={localization.facet.organisation}
        field="publisher.name.raw"
        operator="AND"
        size={5/* NOT IN USE!!! see QueryTransport.jsx */}
        itemComponent={RefinementOptionPublishers}
      />);

    return this.publisherFilter;
  }

  _renderPublisherRefinementListFilterMobile() {
    this.publisherFilter =
      (<RefinementListFilter
        id="publisher"
        title={localization.facet.organisation}
        field="publisher.name.raw"
        operator="AND"
        size={5/* NOT IN USE!!! see QueryTransport.jsx */}
        itemComponent={RefinementOptionPublishersMobile}
      />);

    return this.publisherFilter;
  }

  close() {
    this.setState({ showModal: false });
  }

  open() {
    this.setState({ showModal: true });
  }

  _renderFilterModal() {
    return (
      <Modal show={this.state.showModal} onHide={this.close}>
        <Modal.Header closeButton>
          <Modal.Title>Filter</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="search-filters">
            <RefinementListFilter
              id="theme"
              title={localization.facet.theme}
              field="theme.code.raw"
              operator="AND"
              size={5}
              itemComponent={RefinementOptionThemes}
            />
            <RefinementListFilter
              id="accessRight"
              title={localization.facet.accessRight}
              field="accessRights.authorityCode.raw"
              operator="AND"
              size={5/* NOT IN USE!!! see QueryTransport.jsx */}
              itemComponent={RefinementOptionPublishers}
            />
            {this._renderPublisherRefinementListFilterMobile()}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="fdk-button-default fdk-button"
            onClick={this.close}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

  render() {
    const selectDropdownWithProps = React.createElement(SelectDropdown, {
      selectedLanguageCode: this.props.selectedLanguageCode
    });

    const searchHitItemWithProps = React.createElement(SearchHitItem, {
      selectedLanguageCode: this.props.selectedLanguageCode
    });

    const datasetsHitStatsWithProps = React.createElement(CustomHitsStats, {
      prefLabel: localization.page['nosearch.descriptions']
    });
    return (
      <SearchkitProvider searchkit={searchkitDataset}>
        <div>
          <div className="container">
            <div className="row mb-60">
              <div className="col-md-12 fdk-search-flex">
                <div className="btn-group btn-group-default visible-xs visible-sm">
                  <Button
                    className="fdk-button-default fdk-button fdk-button-filter"
                    bsStyle="primary"
                    bsSize="large"
                    onClick={this.open}
                  >
                    Filter
                  </Button>
                  {this._renderFilterModal()}
                </div>
                <TopBar>
                  <SearchBox
                    autofocus
                    searchOnChange={false}
                    placeholder={localization.query.intro}
                  />
                </TopBar>
              </div>
              <div className="col-md-12 text-center">
                <HitsStats component={datasetsHitStatsWithProps} />
              </div>
            </div>
            <section>
              <ResultsTabs onSelectView={this.props.onSelectView} />
            </section>
            <section id="resultPanel">
              <div className="row">
                <div className="col-md-4 col-md-offset-8">
                  <div className="pull-right">
                    <SortingSelector
                      tabIndex="0"
                      options={[
                        {
                          label: 'sort.relevance',
                          field: '_score',
                          order: 'asc',
                          defaultOption: true
                        },
                        {
                          label: `sort.title`,
                          field: 'title',
                          order: 'asc'
                        },
                        {
                          label: `sort.modified`,
                          field: 'modified',
                          order: 'desc'
                        },
                        {
                          label: `sort.publisher`,
                          field: 'publisher.name',
                          order: 'asc'
                        }
                      ]}
                      listComponent={selectDropdownWithProps}
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="search-filters col-md-4 flex-move-first-item-to-bottom visible-md visible-lg">
                  <RefinementListFilter
                    id="theme"
                    title={localization.facet.theme}
                    field="theme.code.raw"
                    operator="AND"
                    size={5}
                    itemComponent={RefinementOptionThemes}
                  />
                  <RefinementListFilter
                    id="accessRight"
                    title={localization.facet.accessRight}
                    field="accessRights.authorityCode.raw"
                    operator="AND"
                    size={5/* NOT IN USE!!! see QueryTransport.jsx */}
                    itemComponent={RefinementOptionPublishers}
                  />
                  {this._renderPublisherRefinementListFilter()}
                </div>
                <div id="datasets" className="col-xs-12 col-md-8">
                  <Hits
                    mod="sk-hits-grid"
                    hitsPerPage={50}
                    itemComponent={searchHitItemWithProps}
                    sourceFilter={['title', 'description', 'keyword', 'catalog', 'theme', 'publisher', 'contactPoint', 'distribution']}
                  />
                  <div className="col-md-8 col-md-offset-2">
                    <Pagination
                      showNumbers
                    />
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </SearchkitProvider>
    );
  }
}

ResultsDataset.defaultProps = {
  selectedLanguageCode: null
};

ResultsDataset.propTypes = {
  selectedLanguageCode: PropTypes.string,
  onSelectView: PropTypes.func.isRequired,
  onHistoryListen: PropTypes.func.isRequired
};
