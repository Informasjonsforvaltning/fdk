import * as React from "react";
import * as _ from "lodash";
import {
	SearchkitManager, SearchkitProvider,
	SimpleQueryString, ImmutableQuery,
	RefinementListFilter, MenuFilter, QueryAccessor,
	Hits, HitsStats, NoHits, Pagination, SortingSelector,
	PageSizeSelector, Select, Toggle,
	SelectedFilters, ResetFilters, ItemHistogramList,
	Layout, LayoutBody, LayoutResults, TopBar,
	SideBar, ActionBar, ActionBarRow,
  FastClick,
  ReactComponentType,
  PureRender, AxiosESTransport
} from "searchkit";
import cx from 'classnames';

import './index.scss';
import {RefinementOptionThemes} from './RefinementOptionThemes.jsx';
import {RefinementOptionPublishers} from './RefinementOptionPublishers.jsx';

import * as axios from "axios";
import {SearchBox} from './SearchBox.jsx';
import {Select2} from './select.jsx';
import {QueryTransport} from './QueryTransport.jsx';
const defaults = require("lodash/defaults");
import { createHistory as createHistoryFn, useQueries } from 'history';
const qs = require('qs');
import {getText} from './getText.js';
import {addOrReplaceParam} from './addOrReplaceUrlParam.js';
import localization from './components/localization';
import {SearchHitItem} from './components/search-hit-item/index.jsx';

const host = "/dcat";
const searchkit = new SearchkitManager(
	host,
	{
		transport: new QueryTransport(),
		createHistoryFunc: useQueries(createHistoryFn)({ // TODO append lang string if it's not present
      stringifyQuery(ob) {
				Object.keys(ob).map((e) => {
						if(typeof ob[e] === 'object') { // is array
							ob[e] = ob[e].map((filterItem) => {
								return encodeURIComponent(filterItem);
							});
							ob[e] = ob[e].join(',');
						} else {
							ob[e] = encodeURIComponent(ob[e]);
						}
						if(ob[e].length === 0) delete ob[e];
				});
				if(window.location.search.indexOf('lang=') !== -1) {
					let queryObj = qs.parse(window.location.search.substr(1));
					ob['lang'] = queryObj.lang;
				}
				return qs.stringify(ob, {encode:false})
      },
      parseQueryString(str) {
				let parsedQuery = qs.parse(str);
				Object.keys(parsedQuery).map((e) => {
						if(parsedQuery[e].indexOf(',')) parsedQuery[e] = parsedQuery[e].split(',');
						if(e==='sort') {
							var key = parsedQuery[e][0].slice(0,-4),
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


require("./index.scss");
const sa = require('superagent');


searchkit.translateFunction = (key) => {
  let translations = {
    "pagination.previous":localization.page.prev,
    "pagination.next":localization.page.next,
    "facets.view_more":localization.page.viewmore,
    "facets.view_all": localization.page.seeall,
    "facets.view_less": localization.page.seefewer,
		"reset.clear_all": localization.page.resetfilters,
		"hitstats.results_found": localization.page["result.summary"] + ' ' + " {hitCount}"  + ' ' + localization.page['dataset'],
		"NoHits.Error": localization.noHits.error,
		"NoHits.ResetSearch": '.'
  }
  return translations[key]
}

const extractDomain = (url)=> {
  var domain;
  //find & remove protocol (http, ftp, etc.) and get domain
  if (url.indexOf("://") > -1) {
      domain = url.split('/')[2];
  }
  else {
      domain = url.split('/')[0];
  }
  //find & remove port number
  domain = domain.split(':')[0];
  return domain;
}
class RefinementOption extends React.Component {
		render() {
			let props = this.props;
			let themeLabel = '';
		  const {
		    bemBlocks, onClick, active, disabled, style, itemKey,
		    label, count, showCount, showCheckbox} = props;
			if(window.themes.length > 0) {
				themeLabel =  _.find(window.themes, props.label.substr(-4))[props.label.substr(-4)];
			}
			const block = bemBlocks.option;
		  const className = block()
		    .state({ active, disabled })
		    .mix(bemBlocks.container("item"))
			return (
				<div className={props.bemBlocks.option().state({selected:props.selected}).mix(props.bemBlocks.container("item"))} onClick={props.onClick}>
						<input type="checkbox" data-qa="checkbox" checked={active} readOnly className={block("checkbox").state({ active }) } ></input>
					<div className={props.bemBlocks.option("text")}>{themeLabel}</div>
					<div className={props.bemBlocks.option("count")}>{props.count}</div>
				</div>
			);
		}
}

const MovieHitsGridItem = (props)=> {
  const {bemBlocks, result} = props;
  let url =  'datasets?id=' + encodeURIComponent(result._id);
	let queryObj = qs.parse(window.location.search.substr(1));
	var language = queryObj.lang ? queryObj.lang : 'nb';
	if(!queryObj.lang || queryObj.lang === 'nb') {
		url += '&lang=nb';
	} else if(queryObj.lang === 'nn'){
		url += '&lang=nn';
	} else {
		url += '&lang=en';
	}
  const source:any = _.extend({}, result._source, result.highlight)
	let themeLabels = '';
	if(source.theme) {
			source.theme.forEach((singleTheme, index)=> {
				if(singleTheme.title) {
					themeLabels += '<div class="fdk-label fdk-label-on-white">';
					themeLabels += singleTheme.title[language] || singleTheme.title.nb || singleTheme.title.nn || singleTheme.title.en;
					themeLabels += ' </div>';
				}
			});
	}
    let landingPage = '';
    if (source.landingPage) {
    	landingPage += '<a href="' + source.landingPage + '" target="_blank"><span class=\"glyphicon glyphicon-home\"></span></a>'
    }
	let distributionLabels = '';
	if(source.distribution) {
		source.distribution.forEach((dist) => {
			if(dist.format) {
				distributionLabels += '<span className="label label-info">';
				distributionLabels += dist.format;
				distributionLabels += '</span>';
			}
		})
	}
	let commaSeparatedKeywords = '';
	if(source.keyword && source.keyword.nb) {
			source.keyword.nb.forEach(function(keyword, index) {
				commaSeparatedKeywords += '<span className="label label-default">';
				commaSeparatedKeywords += keyword; // translate!
				commaSeparatedKeywords += '</span>';
			});
	}
	let logoHTML = '';
	if(source.contactPoint && source.contactPoint.email) {
		const publisherRootDomain = extractDomain(source.contactPoint.email).replace('www.','');
		const logoUrl = 'https://logo.clearbit.com/' + publisherRootDomain;
		logoHTML = '<img src="' + logoUrl + '" alt="Logo for ' + publisherRootDomain +'" />';
	}
	let themeTitle = ""; // https://logo.clearbit.com/brreg.no
	if(source.theme && source.theme.title) {
		themeTitle = source.theme.title.nb;
	}

	let distribution_restricted = false;
	let distribution_public = false;


	if (source.accessRights.authorityCode === 'RESTRICTED') {
    distribution_restricted = true;
	} else if (source.accessRights.authorityCode === 'PUBLIC') {
    distribution_public = true;
	}

  const distributionClass = cx(
    'fdk-container-distributions',
    {
      'fdk-distributions-red': distribution_restricted,
			'fdk-distributions-green': distribution_public
    }
  );

  let distributionFormats = '';
  if(source.distribution) {
    source.distribution.forEach((dist) => {
      if(dist.format) {
        distributionFormats += '<div class="fdk-button-format fdk-button-format-inactive"><i class="fa fa-download fdk-fa-left"></i>';
        distributionFormats += dist.format;
        distributionFormats += '</div>';
      }
    })
  }

  return (
    <div className="fdk-container fdk-container-search-hit">
			<h2 dangerouslySetInnerHTML={{__html:source.title[language] || source.title.nb || source.title.nn || source.title.en}}></h2>
			<div>
				{localization.search_hit.owned} <a href="#">{source.publisher ? source.publisher.name : ''}</a>
				<a dangerouslySetInnerHTML={{__html:themeLabels}}></a>
			</div>
			<p
				className="fdk-p-search-hit"
				dangerouslySetInnerHTML={
					{__html:source.description[language] || source.description.nb || source.description.nn || source.description.en}}
			>
			</p>


			<div className={distributionClass}>
				<strong>{source.accessRights.prefLabel[language]}</strong>
				<br />
				{distributionFormats}
			</div>
			{source.landingPage ? <div dangerouslySetInnerHTML={{__html:landingPage}}/> : ''}
    </div>
  )
}

export class SearchPage extends React.Component {
  constructor(props) {
    super(props);
		let that = this;
		if(!window.themes) {
			window.themes = [];

			sa.get('/reference-data/themes')
				.end(function(err, res) {
						if(!err && res) {
							res.body.forEach(function (hit) {
						  	let queryObj = qs.parse(window.location.search.substr(1));
								if(queryObj.lang === 'en') {
									if(hit.title.en) {
										let obj = {};
										obj[hit.code] = hit.title.en;
										themes.push(obj);
									}
								} else {
									if(hit.title.nb) {
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
	render(){
		var href = window.location.href.replace('#','');
	  let queryObj = qs.parse(window.location.search.substr(1));
		var getLangUrl = (langCode) => {
			if(langCode === 'nb') {
				return addOrReplaceParam(href, 'lang', '');
			} else if(href.indexOf('lang=') === -1) {
				return href.indexOf('?') === -1 ? href + '?' + '&lang=' + langCode : href + '&lang=' + langCode;
			} else if(langCode !== queryObj.lang) {
				return addOrReplaceParam(href, 'lang', langCode);
			} else {
				return href;
			}
		}
		var language = queryObj.lang ? queryObj.lang : 'nb';


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
									</div>
									<div id="datasets" className="col-sm-8">
									<ActionBar>
										<ActionBarRow>
											<SortingSelector
												options={[
													{label:localization.sort.by + ' ' + localization.sort['by.relevance'], className:"aaa", field:"_score", order:"asc", defaultOption:true},
                        	{label:localization.sort.by + ' ' + localization.sort['by.title'], field:"title", order:"asc"},
													{label:localization.sort.by + ' ' + localization.sort['by.modified'], field:"modified", order:"desc"},
													{label:localization.sort.by + ' ' + localization.sort['by.publisher'], field:"publisher.name", order:"asc"},
												]}
											/>
											<HitsStats/>
											<PageSizeSelector  options={[5,10,25,30,40,50]}/>
										</ActionBarRow>
										<ActionBarRow>
											{/*<ResetFilters/> */}
										</ActionBarRow>
									</ActionBar>
									<Hits mod="sk-hits-grid" hitsPerPage={10} itemComponent={SearchHitItem}
										sourceFilter={["title", "description", "keyword", "catalog", "theme", "publisher", "contactPoint", "distribution"]}/>
									<NoHits translations={{
        "NoHits.NoResultsFound":localization.page.nohits
      }} />
									<Pagination showNumbers={true}/>
									</div>
								</div>
							</div>
					</section>
				</div></div>
		  </SearchkitProvider>
		)
	}
}
