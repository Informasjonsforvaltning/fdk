
import {AxiosESTransport} from "searchkit";
const defaults = require("lodash/defaults");
import * as axios from "axios";

export class QueryTransport extends AxiosESTransport {
  constructor(host, options){
    super()
    this.options = defaults(options, {
      headers:{},
      searchUrlPath:"http://localhost:8083/search"
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
    if(query.filter) { // there is an aggregation filter
      if(query.filter.bool) { // array of filters
        query.filter.bool.must.forEach((filter) => {
          if(filter.term[publisherKey]) {
            if(publisherFilter.length === 0) {
              publisherFilter += '&publisher=';
            }
            publisherFilter += filter.term[publisherKey];
            publisherFilter += ',';
          } else if(filter.term[themeKey]) {
            console.log('filter is ', filter, filter.term, filter.term[themeKey]);

            if(themeFilter.length === 0) {
              themeFilter += '&theme=';
            }
            themeFilter += filter.term[themeKey];
            themeFilter += ',';
          }
        })
      } else if(query.filter.term) { // single filter
        publisherFilter = (query.filter.term[publisherKey] ? '&publisher=' + query.filter.term[publisherKey] : '');
  			themeFilter = ((query.filter.term[themeKey]) ? '&theme=' + query.filter.term[themeKey] : '');
      }
      console.log('publisherFilter is ', publisherFilter);
      console.log('themeFilter is ', themeFilter);
    }


    return this.axios.get(
			'http://localhost:8083/search?q=' +
			(query.query ? query.query.simple_query_string.query : '') +
			'&from=' +
			((!query.from) ? '0' : query.from) +
			'&size=10&lang=nb' +
      publisherFilter +
      themeFilter
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
