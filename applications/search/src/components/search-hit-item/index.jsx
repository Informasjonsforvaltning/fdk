import * as React from "react";
import PropTypes from 'prop-types';
import * as _ from "lodash";
import cx from 'classnames';
const qs = require('qs');
const defaults = require("lodash/defaults");

import localization from '../../components/localization';

export class SearchHitItem extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      result: props.result
    };
    this.extractDomain = this.extractDomain.bind(this);
  }

  componentDidUpdate() {
    console.log("search-hit-item componentDidUpdate");
    this.state = {
      result: this.props.result
    };
  }

  extractDomain(url) {
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

  _renderFormats(source) {
    let distribution = source.distribution;
    let formatRet;
    if(source.distribution) {
      formatRet = Object.keys(distribution).map(key => {
        if(distribution[key].format) {
          let formatArray = distribution[key].format.trim().split(',');
          let ret = '';
          formatArray.forEach((format) => {
            if (format !== null) {
              ret += '<div class="fdk-button-format fdk-button-format-inactive">';
              ret += '<i class="fa fa-download fdk-fa-left"></i>';
              ret += format;
              ret += '</div>';
            }
          });
          return ret;
        } return null;
      });
    }
    return formatRet;
  }

  render() {
    //let props = this.props;
    //const {result} = props;
    const result = this.state.result;
    let url =  'datasets?id=' + encodeURIComponent(result._id);
    let queryObj = qs.parse(window.location.search.substr(1));
    let language = queryObj.lang ? queryObj.lang : 'nb';
    if(!queryObj.lang || queryObj.lang === 'nb') {
      url += '&lang=nb';
    } else if(queryObj.lang === 'nn'){
      url += '&lang=nn';
    } else {
      url += '&lang=en';
    }
    const source:any = _.extend({}, result._source, result.highlight);

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

    let distribution_restricted = false;
    let distribution_public = false;

    if (source.accessRights && source.accessRights.authorityCode === 'RESTRICTED') {
      distribution_restricted = true;
    } else if (source.accessRights && source.accessRights.authorityCode === 'PUBLIC') {
      distribution_public = true;
    }

    const distributionClass = cx(
      'fdk-container-distributions',
      {
        'fdk-distributions-red': distribution_restricted,
        'fdk-distributions-green': distribution_public
      }
    );

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
          <strong>{source.accessRights ? source.accessRights.prefLabel[language] : ''}</strong>
          <br />
          <div dangerouslySetInnerHTML={{__html: this._renderFormats(source)}} />
        </div>
        {source.landingPage ? <div dangerouslySetInnerHTML={{__html:landingPage}}/> : ''}
      </div>
    );
  }
}
