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

import { RefinementOptionThemes } from '../../components/search-refinementoption-themes';
import { RefinementOptionPublishers } from '../../components/search-refinementoption-publishers';
import { SearchBox } from '../../components/search-results-searchbox';
import { QueryTransport } from '../../utils/QueryTransport';
import localization from '../../components/localization';
import SearchHitItem from '../../components/search-results-hit-item';
import SelectDropdown from '../../components/search-results-selector-dropdown';
import CustomHitsStats from '../../components/search-result-custom-hitstats';
import './index.scss';
import '../../components/search-results-searchbox/index.scss';

const qs = require('qs');
const sa = require('superagent');

const host = '/dcat';

const searchkit = new SearchkitManager(
  host,
  {
    transport: new QueryTransport()
  }
);

// const searchkit = new SearchkitManager(host);

searchkit.translateFunction = (key) => {
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

export default class SearchPage extends React.Component {
  constructor(props) {
    super(props);
    this.queryObj = qs.parse(window.location.search.substr(1));
    if (!window.themes) {
      window.themes = [];

      sa.get('/reference-data/themes')
        .end((err, res) => {
          if (!err && res) {
            res.body.forEach((hit) => {
              const obj = {};
              obj[hit.code] = {};
              obj[hit.code].nb = hit.title.nb;
              obj[hit.code].nn = hit.title.nb;
              obj[hit.code].en = hit.title.en;
              window.themes.push(obj);
            });
          }
        });
    }
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

  render() {
    const selectDropdownWithProps = React.createElement(SelectDropdown, {
      selectedLanguageCode: this.props.selectedLanguageCode
    });

    const searchHitItemWithProps = React.createElement(SearchHitItem, {
      selectedLanguageCode: this.props.selectedLanguageCode
    });
    return (
      <SearchkitProvider searchkit={searchkit}>
        <div>
          <div className="container">
            <div className="row mb-60">
              <div className="col-md-12">
                <TopBar>
                  <SearchBox
                    autofocus
                    searchOnChange={false}
                    placeholder={localization.query.intro}
                  />
                </TopBar>
              </div>
              <div className="col-md-12 text-center">
                <HitsStats component={CustomHitsStats} />
              </div>
            </div>
            <section id="resultPanel">
              <div className="container-fluidxx">
                <div className="row">
                  <div className="col-md-4 col-md-offset-8">
                    <div className="pull-right">
                      <SortingSelector
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
                  <div className="search-filters col-sm-4 flex-move-first-item-to-bottom">
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
                  <div id="datasets" className="col-sm-8">
                    <Hits
                      mod="sk-hits-grid"
                      hitsPerPage={50}
                      itemComponent={searchHitItemWithProps}
                      sourceFilter={['title', 'description', 'keyword', 'catalog', 'theme', 'publisher', 'contactPoint', 'distribution']}
                    />
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

SearchPage.defaultProps = {
  selectedLanguageCode: null
};

SearchPage.propTypes = {
  selectedLanguageCode: PropTypes.string
};
