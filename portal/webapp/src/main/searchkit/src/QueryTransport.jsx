
import {AxiosESTransport} from "searchkit";
const defaults = require("lodash/defaults");
import * as axios from "axios";

export class QueryTransport extends AxiosESTransport {
  constructor(host, options){
    super()
    this.options = defaults(options, {
      headers:{},
      searchUrlPath:"http://10.29.3.108:8083/search"
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
    let publisherFilter = '';
    let themeFilter = '';
    let multiplePublishers = false;
    let multipleThemes = false;
    if(query.filter) { // there is an aggregation filter
      if(query.filter.bool) { // array of filters
        query.filter.bool.must.forEach((filter) => {
          if(filter.term[publisherKey]) {
            if(publisherFilter.length === 0) {
              publisherFilter += '&publisher=';
            }
            if (multiplePublishers) {
                publisherFilter += ',';
            }
            publisherFilter += encodeURIComponent(filter.term[publisherKey]);
            multiplePublishers = true;
          } else if(filter.term[themeKey]) {
            console.log('filter is ', filter, filter.term, filter.term[themeKey]);
            if(themeFilter.length === 0) {
              themeFilter += '&theme=';
            }
            if (multipleThemes) {
                themeFilter += ",";
            }
            themeFilter += filter.term[themeKey];
            multipleThemes = true;
          }
        })
      } else if(query.filter.term) { // single filter
        publisherFilter = (query.filter.term[publisherKey] ? '&publisher=' + encodeURIComponent(query.filter.term[publisherKey]) : '');
  			themeFilter = ((query.filter.term[themeKey]) ? '&theme=' + query.filter.term[themeKey] : '');
      }
      console.log('publisherFilter is ', publisherFilter);
      console.log('themeFilter is ', themeFilter);
    }

    let sortfield = "_score";
    let sortdirection = "asc";
    if (query.sort) { // there is a sort code
        if (query.sort.length > 0) {
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
            }
        }
    }

    return this.axios.get(
			'http://10.29.3.108:8083/search?q=' +
			(query.query ? query.query.simple_query_string.query : '') +
			'&from=' +
			((!query.from) ? '0' : query.from) +
			'&size=' + query.size +
            '&lang=nb' +
      publisherFilter +
      themeFilter + (sortfield !== "_score" ? '&sortfield='+sortfield+'&sortdirection='+ sortdirection : '')
		)
      .then(this.getData)
  }

  getData(response){

		    // Check for the old property name to avoid a ReferenceError in strict mode.
		    if (response.data.aggregations && response.data.aggregations.hasOwnProperty('publisherCount')) {
		        response.data.aggregations['publisher.name.raw3'] = {'publisher.name.raw' : response.data.aggregations['publisherCount'], size: '10'};
						response.data.aggregations['publisher.name.raw3']['publisher.name.raw'].buckets = response.data.aggregations['publisher.name.raw3']['publisher.name.raw'].buckets.slice(0,10);
		        delete response.data.aggregations['publisherCount'];
		    }
		    // Check for the old property name to avoid a ReferenceError in strict mode.
		    if (response.data.aggregations && response.data.aggregations.hasOwnProperty('theme_count')) {
		        response.data.aggregations['theme.code.raw4'] = {'theme.code.raw' : response.data.aggregations['theme_count'], size: '10'};
		        delete response.data.aggregations['theme_count'];
		    }
    return response.data
  }

}
