import * as React from "react";
import * as _ from "lodash";
import {
	SearchkitManager, SearchkitProvider,
	SimpleQueryString, ImmutableQuery,
	RefinementListFilter, MenuFilter, QueryAccessor,
	Hits, HitsStats, NoHits, Pagination, SortingSelector,
	SelectedFilters, ResetFilters, ItemHistogramList,
	Layout, LayoutBody, LayoutResults, TopBar,
	SideBar, ActionBar, ActionBarRow,
  FastClick,
  ReactComponentType,
  PureRender, AxiosESTransport
} from "searchkit";
import * as axios from "axios";
import {SearchBox} from './SearchBox.jsx';
import {QueryTransport} from './QueryTransport.jsx';

const defaults = require("lodash/defaults");

const host = "/dcat";
const searchkit = new SearchkitManager(host, {transport: new QueryTransport()});
//const searchkit = new SearchkitManager(host);


require("./index.scss");
const sa = require('superagent');


searchkit.translateFunction = (key) => {
  let translations = {
    "pagination.previous":"Forrige side",
    "pagination.next":"Neste side",
    "facets.view_more":"Se flere",
    "facets.view_all": "Se alle",
    "facets.view_less": "Se færre",
		"reset.clear_all": "Nullstill filtre"
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
  let url =  'http://localhost:8070/detail?id=' + result._id;
  const source:any = _.extend({}, result._source, result.highlight)
	let themeLabels = '';
	if(source.theme) {
			source.theme.forEach((singleTheme, index)=> {
				if(singleTheme.title) {
					themeLabels += '<span class="label label-default">';
					themeLabels += singleTheme.title.nb; // translate!
					themeLabels += '</span>';
				}
			});
	}
	let distributionLabels = '';
	if(source.distribution) {
		source.distribution.forEach((dist) => {
			if(dist.format) {
				distributionLabels += '<span class="label label-info">';
				distributionLabels += dist.format; // translate!
				distributionLabels += '</span>';
			}
		})
	}
	let commaSeparatedKeywords = '';
	if(source.keyword && source.keyword.nb) {
			source.keyword.nb.forEach(function(keyword, index) {
				commaSeparatedKeywords += '<span class="label label-default">';
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
    <a href="" target="_blank" className="row list-group-item dataset">
        <div alt="{props.source.url}" className="col-sm-12">
						<span dangerouslySetInnerHTML={{__html:''}}></span>
            <h4 dangerouslySetInnerHTML={{__html:source.title.en || source.title.nn || source.title.nb}}></h4>
						<button className="btn btn-default btn-sm publisher" type="button" dangerouslySetInnerHTML={{__html:source.publisher ? source.publisher.name : ''}}></button>
						<div className="overflow-text" dangerouslySetInnerHTML={{__html:source.description.nb}}></div>
						<span dangerouslySetInnerHTML={{__html:themeLabels}}></span>
						<span dangerouslySetInnerHTML={{__html:distributionLabels}}></span>
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
			sa.get('http://localhost:8083/themes')
				.end(function(err, res) {
						if(!err && res) {
							res.body.hits.hits.forEach(function (hit) {
								if(hit._source.title.nb) {
									let obj = {};
									obj[hit._source.code] = hit._source.title.nb;
									themes.push(obj);
								}
							});
						} else {
							console.log("No response");
						}
				});
		}
  }
	render(){
		return (
			<SearchkitProvider searchkit={searchkit}>
		    <Layout>
				<header className="a-header" role="banner">
			    <nav className="navbar navbar-default">
			        <div className="container">
			            <div className="navbar-header">
			                <a className="navbar-brand" href="/">Felles datakatalog</a>
			            </div>
			            <ul className="nav navbar-nav navbar-right">
			                <li><a href="#" title="Tilbakemelding"><span className="glyphicon glyphicon-envelope"></span></a>
			                </li>
			                <li className="dropdown">
			                    <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false" title="Velg språk">
			                        <span id="chosenhistoryEntry">Norsk (bokmål)</span>
			                        <span className="caret"></span></a>
			                    <ul className="dropdown-menu" id="historyEntry-list">
			                        <li><a href="?lang=nb" lang="nb">Norsk (bokmål)</a></li>
			                        <li><a href="?lang=nn" lang="nn">Norsk (nynorsk)</a></li>
			                        <li><a href="?lang=en" lang="en">Engelsk</a></li>
			                    </ul>
			                </li>
			                <li><a href="#" title="Logg inn"><span className="glyphicon glyphicon-user"></span></a></li>
			                <li className="dropdown">
			                    <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false" title="Om applikasjonen">
			                        <span>Om</span>
															<span className="caret"></span>
													</a>
			                    <ul className="dropdown-menu">
			                        <li className="dropdown">Hjelp</li>
			                        <ul className="dropdown-menu">
			                            <li><a href="help/help.html" target="_blank">Språkstøtte</a></li>
			                            <li><a href="help/ResulPageNavigation.html" target="_blank">Navigering i søkeresultat</a>
			                            </li>
			                        </ul>
			                        <li><a href="coverage.html" target="_blank">Status implementasjon</a>
			                        </li>
			                        <li><a href="https://doc.difi.no/dcat-ap-no/" target="_blank">DCAT-AP-NO 1.1 standarden</a></li>
			                        <li><a href="#">Veileder</a></li>
			                        <li><a href="#">For dataeiere</a></li>
			                        <li><a href="#">For databrukere</a></li>
			                        <li role="separator" className="divider"></li>
			                        <li><a href="#">Teknisk</a></li>
			                    </ul>
			                </li>
			            </ul>
			        </div>
			    	</nav>
					</header>
		      <TopBar>
		        <SearchBox
		          autofocus={true}
		          searchOnChange={false}
							placeholder="Søk etter datasett"
							/>
		      </TopBar>

					    <section id="resultPanel">
					        <div className="container-fluid">
										<div className="row">
										</div>
										<div className="row">
											<div className="col-sm-3">
												<RefinementListFilter
													id="publisher"
													title="Virksomhet"
													field="publisher.name.raw"
													operator="AND"
													size={10}
													/>
												<RefinementListFilter
													id="theme"
													title="Tema"
													field="theme.code.raw"
													operator="AND"
													size={100}
													itemComponent={RefinementOption}
													/>
											</div>
											<div id="datasets" className="col-sm-8 list-group">
											<ActionBar>

												<ActionBarRow>
													<HitsStats/>
													<SortingSelector options={[
														{label:"Relevans", field:"_score", order:"desc", defaultOption:true},
                                                        {label:"Tittel", field:"title", order:"desc"},
														{label:"Sist endret", field:"modified", order:"asc"},
														{label:"Virksomhet", field:"publisher"},
													]}/>
												</ActionBarRow>
												<ActionBarRow>
													<ResetFilters/>
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
		    </Layout>
		  </SearchkitProvider>
		)
	}
}
