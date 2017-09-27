
import {AxiosESTransport} from "searchkit";
const defaults = require("lodash/defaults");
import * as axios from "axios";
const qs = require('qs');

export class QueryTransport extends AxiosESTransport {
  constructor(host, options){
    super()
    this.options = defaults(options, {
      headers:{},
      //searchUrlPath: window.fdkSettings.queryUrl + "/search"
        // TODO MAKE THIS GENERIC
        searchUrlPath: "http://localhost:8083/search"
    })
    if(this.options.basicAuth){
      this.options.headers["Authorization"] = (
        "Basic " + btoa(this.options.basicAuth))
    }
    this.axios = axios.create({
      baseURL:this.host,
      timeout:AxiosESTransport.timeout,
      headers:this.options.headers
    })
  }

  search(query){
    console.log('query is ', query);
		// http://localhost:8083/search?q=test&from=0&size=10&lang=nb&publisher=AKERSHUS%20FYLKESKOMMUNE
    const publisherKey = 'publisher.name.raw';
    const themeKey = 'theme.code.raw';
    const accessRightKey = 'accessRights.authorityCode.raw';
    let publisherFilter = '';
    let themeFilter = '';
    let accessRightFilter = '';
    let multiplePublishers = false;
    let multipleAccessRights = false;
    let multipleThemes = false;
    if(query.post_filter) { // there is an aggregation post_filter
      if(query.post_filter.bool) { // array of post_filters
        query.post_filter.bool.must.forEach((post_filter) => {
          if(post_filter.term[publisherKey]) {
            if(publisherFilter.length === 0) {
              publisherFilter += '&publisher=';
            }
            if (multiplePublishers) {
                publisherFilter += ',';
            }
            publisherFilter += encodeURIComponent(post_filter.term[publisherKey]);
            multiplePublishers = true;
          } else if(post_filter.term[themeKey]) {
            if(themeFilter.length === 0) {
              themeFilter += '&theme=';
            }
            if (multipleThemes) {
                themeFilter += ",";
            }
            themeFilter += post_filter.term[themeKey];
            multipleThemes = true;
        } else if(post_filter.term[accessRightKey]) {
            if(accessRightFilter.length === 0) {
              accessRightFilter += '&accessright=';
            }
            if (multipleAccessRights) {
                accessRightFilter += ',';
            }
            accessRightFilter += encodeURIComponent(post_filter.term[accessRightKey]);
            multipleAccessRights = true;
        }
        })
      } else if(query.post_filter.term) { // single post_filter
        publisherFilter = (query.post_filter.term[publisherKey] ? '&publisher=' + encodeURIComponent(query.post_filter.term[publisherKey]) : '');
        accessRightFilter = (query.post_filter.term[accessRightKey] ? '&accessright=' + encodeURIComponent(query.post_filter.term[accessRightKey]) : '');
  			themeFilter = ((query.post_filter.term[themeKey]) ? '&theme=' + query.post_filter.term[themeKey] : '');
      }
    }

    let sortfield = "_score";
    let sortdirection = "asc";

    /* ois - MÅ GJØRES OM FOR Å STØTTE CUSTOM DROPDOWN PÅ SORTERING, queryObj får ikke med seg siste valg
    let queryObj = qs.parse(window.location.search.substr(1));
    console.log(JSON.stringify("qyery her: " + JSON.stringify(query.sort)));
    if (queryObj['sort']) { // there is a sort code
      console.log("sort");
        var lastIndexOfUnderscore = queryObj['sort'].lastIndexOf('_'),
            key = queryObj['sort'].slice(0,lastIndexOfUnderscore),
            value = queryObj['sort'].substr(lastIndexOfUnderscore+1);
        query.sort[0] = {};
        query.sort[0][key] = value;
        let sort = query.sort[0]; // assume that only one sort field is possible
        if (_.has(sort, '_score')) {
            sortfield="_score";
            sortdirection="asc";
        } else if (_.has(sort, 'title')) {
            sortfield= "title.nb";
        } else if (_.has(sort, 'modified')) {
            sortfield= "modified";
            sortdirection = "desc";
        } else if (_.has(sort,'publisher.name')) {
            sortfield= "publisher.name";
        } else {
          console.log('other! (should not happen)');
        }
    }
    */

    let querySortObj = query.sort[0]; // assume that only one sort field is possible
    if (querySortObj) { // there is a sort code
      if (_.has(querySortObj, '_score')) {
        sortfield = "_score";
        sortdirection = "asc";
      } else if (_.has(querySortObj, 'title')) {
        sortfield= "title.nb";
      } else if (_.has(querySortObj, 'modified')) {
        sortfield= "modified";
        sortdirection = "desc";
      } else if (_.has(querySortObj,'publisher.name')) {
        sortfield= "publisher.name";
      } else {
        console.log('other! (should not happen)');
      }
    }

    return this.axios.get(
      `${this.options.searchUrlPath}?q=` +
			(query.query ? encodeURIComponent(query.query.simple_query_string.query) : '') +
			'&from=' +
			((!query.from) ? '0' : query.from) +
			'&size=' +
      query.size +
      '&lang=nb' +
      publisherFilter +
      themeFilter +
      accessRightFilter +
      (sortfield !== "_score" ? '&sortfield='+sortfield+'&sortdirection='+ sortdirection : '')
		)
      .then(x => new Promise(resolve => setTimeout(() => resolve(x), 50)))
      .then(this.getData)
  }

  getData(response) {
		    // Check for the old property name to avoid a ReferenceError in strict mode.
		    if (response.data.aggregations && response.data.aggregations.hasOwnProperty('publisherCount')) {
		        response.data.aggregations['publisher.name.raw3'] = {'publisher.name.raw' : response.data.aggregations['publisherCount'], size: '5'};
						response.data.aggregations['publisher.name.raw3']['publisher.name.raw'].buckets = response.data.aggregations['publisher.name.raw3']['publisher.name.raw'].buckets.slice(0,100);
		        delete response.data.aggregations['publisherCount'];
		    }
		    // Check for the old property name to avoid a ReferenceError in strict mode.
		    if (response.data.aggregations && response.data.aggregations.hasOwnProperty('theme_count')) {
		        response.data.aggregations['theme.code.raw4'] = {'theme.code.raw' : response.data.aggregations['theme_count'], size: '5'};
						response.data.aggregations['theme.code.raw4']['theme.code.raw'].buckets = response.data.aggregations['theme.code.raw4']['theme.code.raw'].buckets.slice(0,100);
		        delete response.data.aggregations['theme_count'];
		    }
		    // Check for the old property name to avoid a ReferenceError in strict mode.
		    if (response.data.aggregations && response.data.aggregations.hasOwnProperty('accessRightCount')) {
		        response.data.aggregations['accessRights.authorityCode.raw5'] = {'accessRights.authorityCode.raw' : response.data.aggregations['accessRightCount'], size: '5'};
						response.data.aggregations['accessRights.authorityCode.raw5']['accessRights.authorityCode.raw'].buckets = response.data.aggregations['accessRights.authorityCode.raw5']['accessRights.authorityCode.raw'].buckets.slice(0,100);
		        delete response.data.aggregations['accessRightCount'];
		    }
    return response.data
  }

}
