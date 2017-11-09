import React from 'react';
import PropTypes from 'prop-types';
import qs from 'qs';
import sa from 'superagent';
import {
  SearchkitManager,
  SearchkitProvider,
  Hits,
  HitsStats,
  Pagination,
  SortingSelector,
  TopBar
} from 'searchkit';

import { QueryTransport } from '../../utils/QueryTransport';
import localization from '../localization';
import { SearchBox } from '../search-results-searchbox';
import ConceptsHitItem from '../search-concepts-hit-item';
import SelectDropdown from '../search-results-selector-dropdown';
import CustomHitsStats from '../search-result-custom-hitstats';
import ResultsTabs from '../search-results-tabs';

const host = '/dcat';

const searchkitConcepts = new SearchkitManager(
  host,
  {
    transport: new QueryTransport()
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

export default class ResultsConcepts extends React.Component {
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

  render() {
    const selectDropdownWithProps = React.createElement(SelectDropdown, {
      selectedLanguageCode: this.props.selectedLanguageCode
    });

    const conceptsHitItemWithProps = React.createElement(ConceptsHitItem, {
      selectedLanguageCode: this.props.selectedLanguageCode
    });
    return (
      <SearchkitProvider searchkit={searchkitConcepts}>
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
                <div id="datasets" className="col-sm-8 col-sm-offset-4">
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
            </section>
          </div>
        </div>
      </SearchkitProvider>
    );
  }
}

ResultsConcepts.defaultProps = {
  selectedLanguageCode: ''
};

ResultsConcepts.propTypes = {
  onSelectView: PropTypes.func.isRequired,
  selectedLanguageCode: PropTypes.string
};
