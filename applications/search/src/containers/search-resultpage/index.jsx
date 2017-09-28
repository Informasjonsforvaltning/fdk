import React from "react";
import {
  SearchkitManager,
  SearchkitProvider,
  RefinementListFilter,
  Hits,
  HitsStats,
  NoHits,
  Pagination,
  SortingSelector,
  PageSizeSelector,
  TopBar,
  ActionBar,
  ActionBarRow,
  Tabs,
  Toggle,
  ItemList
} from 'searchkit';
import {
  createHistory as createHistoryFn,
  useQueries
} from 'history';


import {RefinementOptionThemes} from '../../components/search-refinementoption-themes';
import {RefinementOptionPublishers} from "../../components/search-refinementoption-publishers";
import {SearchBox} from "../../SearchBox.jsx";
//import {Select2} from "../../select.jsx";
import {QueryTransport} from "../../QueryTransport.jsx";
import {addOrReplaceParam} from "../../addOrReplaceUrlParam.js";
import localization from "../../components/localization";
import SearchHitItem from "../../components/search-hit-item/index.jsx";
import {Select} from '../../components/search-searchkit-selector-dropdown';
import './index.scss';


const defaults = require("lodash/defaults");
const qs = require('qs');
const sa = require('superagent');
const host = "/dcat";

const searchkit = new SearchkitManager(
  host,
  {
    transport: new QueryTransport(),
    createHistoryFunc: useQueries(createHistoryFn)({ // TODO append lang string if it's not present
      stringifyQuery(ob) {
        Object.keys(ob).map((e) => {
          if (typeof ob[e] === 'object') { // is array
            ob[e] = ob[e].map((filterItem) => {
              return encodeURIComponent(filterItem);
            });
            ob[e] = ob[e].join(',');
          } else {
            ob[e] = encodeURIComponent(ob[e]);
          }
          if (ob[e].length === 0) delete ob[e];
        });
        if (window.location.search.indexOf('lang=') !== -1) {
          let queryObj = qs.parse(window.location.search.substr(1));
          ob['lang'] = queryObj.lang;
        }
        return qs.stringify(ob, {encode: false})
      },
      parseQueryString(str) {
        let parsedQuery = qs.parse(str);
        Object.keys(parsedQuery).map((e) => {
          if (parsedQuery[e].indexOf(',')) parsedQuery[e] = parsedQuery[e].split(',');
          if (e === 'sort') {
            var key = parsedQuery[e][0].slice(0, -4),
              value = parsedQuery[e][0].substr(-4);
            parsedQuery[e][key] = value;
            delete parsedQuery[e][0];
          }
        });
        return parsedQuery;
      }
    })
  }
);

//const searchkit = new SearchkitManager(host);

searchkit.translateFunction = (key) => {
  let translations = {
    "pagination.previous": localization.page.prev,
    "pagination.next": localization.page.next,
    "facets.view_more": localization.page.viewmore,
    "facets.view_all": localization.page.seeall,
    "facets.view_less": localization.page.seefewer,
    "reset.clear_all": localization.page.resetfilters,
    "hitstats.results_found": localization.page["result.summary"] + ' ' + " {hitCount}" + ' ' + localization.page['dataset'],
    "NoHits.Error": localization.noHits.error,
    "NoHits.ResetSearch": '.'
  }
  return translations[key]
}

/*
class RefinementOption extends React.Component {
  render() {
    let props = this.props;
    let themeLabel = '';
    const {
      bemBlocks, onClick, active, disabled, style, itemKey,
      label, count, showCount, showCheckbox
    } = props;
    if (window.themes.length > 0) {
      themeLabel = _.find(window.themes, props.label.substr(-4))[props.label.substr(-4)];
    }
    const block = bemBlocks.option;
    const className = block()
      .state({active, disabled})
      .mix(bemBlocks.container("item"))
    return (
      <div className={props.bemBlocks.option().state({selected: props.selected}).mix(props.bemBlocks.container("item"))}
           onClick={props.onClick}>
        <input type="checkbox" data-qa="checkbox" checked={active} readOnly className={block("checkbox").state({active}) }></input>
        <div className={props.bemBlocks.option("text")}>{themeLabel}</div>
        <div className={props.bemBlocks.option("count")}>{props.count}</div>
      </div>
    );
  }
}
*/

export class SearchPage extends React.Component {
  constructor(props) {
    super(props);
    let that = this;
    if (!window.themes) {
      window.themes = [];

      sa.get('/reference-data/themes')
        .end(function (err, res) {
          if (!err && res) {
            res.body.forEach(function (hit) {
              let queryObj = qs.parse(window.location.search.substr(1));
              if (queryObj.lang === 'en') {
                if (hit.title.en) {
                  let obj = {};
                  obj[hit.code] = hit.title.en;
                  themes.push(obj);
                }
              } else {
                if (hit.title.nb) {
                  let obj = {};
                  obj[hit.code] = hit.title.nb;
                  themes.push(obj);
                }
              }
            });
          } else {

          }
        });
    }
  }

  render() {
    let href = window.location.href.replace('#', '');
    let queryObj = qs.parse(window.location.search.substr(1));
    let getLangUrl = (langCode) => {
      if (langCode === 'nb') {
        return addOrReplaceParam(href, 'lang', '');
      } else if (href.indexOf('lang=') === -1) {
        return href.indexOf('?') === -1 ? href + '?' + '&lang=' + langCode : href + '&lang=' + langCode;
      } else if (langCode !== queryObj.lang) {
        return addOrReplaceParam(href, 'lang', langCode);
      } else {
        return href;
      }
    }
    let language = queryObj.lang ? queryObj.lang : 'nb';

    return (
      <SearchkitProvider searchkit={searchkit}>
        <div>
          <div className="container">
            <TopBar>
              <SearchBox
                autofocus={true}
                searchOnChange={false}
                placeholder={localization.query.intro}
              />
              <HitsStats/>
            </TopBar>
            <section id="resultPanel">
              <div className="container-fluid">
                <div className="row">
                </div>
                <div className="row">
                  <div className="col-sm-4 flex-move-first-item-to-bottom">
                    <RefinementListFilter
                      id="publisher"
                      title={localization.facet.organisation}
                      field="publisher.name.raw"
                      operator="AND"
                      size={5/* NOT IN USE!!! see QueryTransport.jsx */}
                      itemComponent={RefinementOptionPublishers}
                    />
                    <RefinementListFilter
                      id="theme"
                      title={localization.facet.theme}
                      field="theme.code.raw"
                      operator="AND"
                      size={5/* NOT IN USE!!! see QueryTransport.jsx */}
                      itemComponent={RefinementOptionThemes}
                    />
                    <RefinementListFilter
                      id="accessRight"
                      title={localization.facet.accessRight}
                      field="accessRights.authorityCode.raw"
                      operator="AND"
                      size={5/* NOT IN USE!!! see QueryTransport.jsx */}
                    />
                  </div>
                  <div id="datasets" className="col-sm-8">
                    <div className="row">
                      <div className="col-md-4 col-md-offset-8">
                        <div className="pull-right">
                        <SortingSelector
                          options={[
                            {
                              label: localization.sort.by + ' ' + localization.sort['by.relevance'],
                              className: "aaa",
                              field: "_score",
                              order: "asc",
                              defaultOption: true
                            },
                            {label: localization.sort.by + ' ' + localization.sort['by.title'], field: "title", order: "asc"},
                            {label: localization.sort.by + ' ' + localization.sort['by.modified'], field: "modified", order: "desc"},
                            {label: localization.sort.by + ' ' + localization.sort['by.publisher'], field: "publisher.name", order: "asc"},
                          ]}
                          listComponent={Select}
                        />
                        </div>
                      </div>
                    </div>
                    <Hits mod="sk-hits-grid" hitsPerPage={50} itemComponent={SearchHitItem}
                          sourceFilter={["title", "description", "keyword", "catalog", "theme", "publisher", "contactPoint", "distribution"]}/>
                    <NoHits translations={{
                      "NoHits.NoResultsFound": localization.page.nohits
                    }}/>
                    <Pagination
                      showNumbers={true}
                      listComponent={Toggle}
                    />
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </SearchkitProvider>
    )
  }
}
