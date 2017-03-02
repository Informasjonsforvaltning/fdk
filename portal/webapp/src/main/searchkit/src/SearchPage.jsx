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
const host = "/dcat";
const searchkit = new SearchkitManager(
	host,
	{
		transport: new QueryTransport(),
		createHistoryFunc: useQueries(createHistoryFn)({
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
				return qs.stringify(ob, {encode:false})
      },
      parseQueryString(str) {
				let parsedQuery = qs.parse(str);
				Object.keys(parsedQuery).map((e) => {
						if(parsedQuery[e].indexOf(',')) parsedQuery[e] = parsedQuery[e].split(',');
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
    "pagination.previous":getText('page.prev'),
    "pagination.next":getText('page.next'),
    "facets.view_more":getText('page.viewmore'),
    "facets.view_all": getText('page.seeall'),
    "facets.view_less": getText('page.seefewer'),
		"reset.clear_all": getText('page.resetfilters'),
		"hitstats.results_found": getText("page.result.summary") + ' ' + " {hitCount}"  + ' ' + getText('page.results.in') + ' ' + "{timeTaken} ms"
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
					themeLabels += '<label>';
					themeLabels += singleTheme.title.nb; // translate!
					themeLabels += ' </label>';
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
				distributionLabels += dist.format; // translate!
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
  return (
    <a href={url}  className="row list-group-item dataset">
        <div className="col-sm-12">
            <h2 dangerouslySetInnerHTML={{__html:source.title.en || source.title.nn || source.title.nb}}></h2>
			<h4>
                {source.publisher ? source.publisher.name : ''}
                <small> • </small>
				<span dangerouslySetInnerHTML={{__html:themeLabels}}></span>
			</h4>
			<div className="overflow-text" dangerouslySetInnerHTML={{__html:source.description.nb}}></div>
			{source.landingPage ? <div dangerouslySetInnerHTML={{__html:landingPage}}/> : ''}
		</div>
    </a>
  )
}

export class SearchPage extends React.Component {
  constructor(props) {
    super(props);
		let that = this;
		if(!window.themes) {
			window.themes = [];
			sa.get('http://10.29.3.108:8083/themes')
				.end(function(err, res) {
						if(!err && res) {
							res.body.hits.hits.forEach(function (hit) {
						  	let queryObj = qs.parse(window.location.search.substr(1));
								if(queryObj.lang === 'en') {
									if(hit._source.title.en) {
										let obj = {};
										obj[hit._source.code] = hit._source.title.en;
										themes.push(obj);
									}
								} else {
									if(hit._source.title.nb) {
										let obj = {};
										obj[hit._source.code] = hit._source.title.nb;
										themes.push(obj);
									}
								}
							});
						} else {
							console.log("No response");
						}
				});
		}
  }
	render(){

		var enUrl = addOrReplaceParam(window.location.href, 'lang', 'en');
		var nbUrl = addOrReplaceParam(window.location.href, 'lang', '');
		var nnUrl = addOrReplaceParam(window.location.href, 'lang', 'nn');
	  let queryObj = qs.parse(window.location.search.substr(1));

		return (
			<SearchkitProvider searchkit={searchkit}>

<div>
			<div className="fdk-header-beta">
					{getText('beta.first')} <a className="white-link" href="mailto:fellesdatakatalog@brreg.no">{getText('beta.second')}</a> {getText('beta.last')}
			</div>

			<div className="container">
					<div className="fdk-header-menu">
							<div className="dropdown fdk-container-dropdown-menu">
									<div className="dropdown fdk-dropdown-toggle-menu">
											<a data-toggle="dropdown" href="#">&#9776;</a>
											<ul className="dropdown-menu fdk-dropdown-menu" role="menu" aria-labelledby="dLabel">
													<li><a href="#">{getText('about.title')}</a></li>
													<li><a href="#">{getText('faq')}</a></li>
													<li><a href="https://doc.difi.no/dcat-ap-no/">{getText('about.standard')}</a></li>
													<li><a href="http://portal-fdk.tt1.brreg.no/coverage.html">{getText('about.status')}</a></li>
											</ul>
									</div>
							</div>
							<div className="dropdown fdk-container-dropdown-language">
									<button className="btn btn-default fdk-dropdown-toggle-language" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
											<img className="fdk-dropdown-language-flag" src="img/flag-norway.png"/>{queryObj.lang ? queryObj.lang === 'en' ? getText('lang.english-en') : getText('lang.norwegian-nn') : getText('lang.norwegian-nb')}
											<span className="caret"></span>
									</button>
									<ul className="dropdown-menu fdk-dropdown-language" aria-labelledby="dropdownMenu1">
											<li><a href={enUrl}><img className="fdk-dropdown-language-flag" src="img/flag-england.png"/>{getText('lang.english-en')}</a></li>
											<li><a href={nbUrl}><img className="fdk-dropdown-language-flag" src="img/flag-norway.png"/>{getText('lang.norwegian-nb')}</a></li>
											<li><a href={nnUrl}><img className="fdk-dropdown-language-flag" src="img/flag-norway.png"/>{getText('lang.norwegian-nn')}</a></li>
									</ul>
							</div>
					</div>
						<h1 className="fdk-heading"><a href={queryObj.lang === 'nb' || !queryObj.lang ? '/' : '/?lang=' + queryObj.lang}>{getText('app.title')}</a></h1>
		      <TopBar>
		        <SearchBox
		          autofocus={true}
		          searchOnChange={false}
							placeholder={getText('query.intro')}
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
											title={getText('facet.organisation')}
											field="publisher.name.raw"
											operator="AND"
											size={5}
											itemComponent={RefinementOptionPublishers}
											/>
										<RefinementListFilter
											id="theme"
											title={getText('facet.theme')}
											field="theme.code.raw"
											operator="AND"
											size={2}
											itemComponent={RefinementOptionThemes}
											/>
									</div>
									<div id="datasets" className="col-sm-8 list-group">
									<ActionBar>
										<ActionBarRow>
											<SortingSelector listComponent={Select2} options={[
												{label:getText('sort.by') + ' ' + getText('sort.by.relevance'), className:"aaa", field:"_score", order:"asc", defaultOption:true},
                        {label:getText('sort.by') + ' ' + getText('sort.by.title'), field:"title", order:"asc"},
												{label:getText('sort.by') + ' ' + getText('sort.by.modified'), field:"modified", order:"desc"},
												{label:getText('sort.by') + ' ' + getText('sort.by.publisher'), field:"publisher.name", order:"asc"},
											]}/>
											<HitsStats/>
											<PageSizeSelector listComponent={Select2} options={[5,10,25,30,40,50]}/>
										</ActionBarRow>
										<ActionBarRow>
											{/*<ResetFilters/> */}
										</ActionBarRow>
									</ActionBar>
									<Hits mod="sk-hits-grid" hitsPerPage={10} itemComponent={MovieHitsGridItem}
										sourceFilter={["title", "description", "keyword", "catalog", "theme", "publisher", "contactPoint", "distribution"]}/>
									<NoHits/>
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
