import React from 'react';
import PropTypes from 'prop-types';
import * as _ from "lodash";
import cx from 'classnames';
const qs = require('qs');
const defaults = require("lodash/defaults");


export default class SearchHitItem extends React.Component { // eslint-disable-line react/prefer-stateless-function

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {

  }

  render() {
    /*
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
    */

    /*
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
     */

    return (
      <div>tester</div>
    )
  }

}


