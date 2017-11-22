import {AxiosESTransport} from "searchkit";
const defaults = require("lodash/defaults");
import * as axios from "axios";
const qs = require('qs');
const ReactGA = require('react-ga');

export class TermsQueryTransport extends AxiosESTransport {
  constructor(host, options) {
    super()
    this.options = defaults(options, {
      headers:{},
      searchUrlPath: "/terms"
    })
    this.axios = axios.create({
      baseURL:this.host,
      timeout:AxiosESTransport.timeout,
      headers:this.options.headers
    })
    this.filters = [
      {key: 'sort.selector'}
    ];
  }

  search(query) {
    this.filters.forEach((filter)=> {
      // http://localhost:8083/search?q=test&from=0&size=10&lang=nb&publisher=AKERSHUS%20FYLKESKOMMUNE
      filter.query = '';
      let multiple = false;
      if(query.post_filter) { // there is an aggregation post_filter
        if(query.post_filter.bool) { // array of post_filters
          query.post_filter.bool.must.forEach((post_filter) => {
            if(post_filter.term[filter.key]) {
              if(filter.query.length === 0) {
                filter.query += '&' + filter.paramName +'=';
              }
              if (multiple) {
                  filter.query += ',';
              }
              filter.query += encodeURIComponent(post_filter.term[filter.key]);
              multiple = true;
            }
          })
        } else if(query.post_filter.term) { // single post_filter
          filter.query = (query.post_filter.term[filter.key] ? '&' + filter.paramName +'=' + encodeURIComponent(query.post_filter.term[filter.key]) : '');
        }
      }
      filter.query = filter.query.replace(/,\s*$/, "");
    })

    let sortfield = "_score";
    let sortdirection = "asc";

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
      }
    }

    if (query.query) {
      ReactGA.event({
        category: 'Søk',
        action: 'Søk i begrep',
        label: query.query.simple_query_string.query
      });
    }

    let filtersUrlFragment = this.filters.map(filter=>filter.query).join(''); // build url fragment from list of filters
    return this.axios.get(
      `${this.options.searchUrlPath}?q=` +
			(query.query ? encodeURIComponent(query.query.simple_query_string.query) : '') +
			'&from=' +
			((!query.from) ? '0' : query.from) +
			'&size=' +
      query.size +
      '&lang=nb' +
      filtersUrlFragment +
      (sortfield !== "_score" ? '&sortfield='+sortfield+'&sortdirection='+ sortdirection : '')
		)
      .then(x => new Promise(resolve => setTimeout(() => resolve(x), 50)))
      .then((response)=>this.getData.call(this, response))
  }

  getData(response) {
    let aggregations = response.data.aggregations;
      this.filters.forEach((filter, index)=>{
        let rawName = filter.key + (index + 3); // why 3? seems the first 2-3 are internal searchkit stuff
        let name = filter.name;
        let rawNameShort = rawName.substr(0, rawName.length-1);
        if (aggregations && aggregations.hasOwnProperty(name)) {
            aggregations[rawName] = {};
            aggregations[rawName].size = '5';
            aggregations[rawName][rawNameShort] = aggregations[name];
            if(aggregations[rawName][rawNameShort].buckets.length > 5) {
              aggregations[rawName][rawNameShort].buckets.splice(5, 0, {key:'showmoreinput'});
              aggregations[rawName][rawNameShort].buckets.splice(6, 0, {key:'showmorelabel'});
              aggregations[rawName][rawNameShort].buckets.splice(100, 0, {key:'showfewerlabel'});
            }
            aggregations[rawName][rawNameShort].buckets = aggregations[rawName][rawNameShort].buckets.slice(0,101);
            aggregations[rawName][rawNameShort].doc_count_error_upper_bound = 1000;
            aggregations[rawName][rawNameShort].sum_other_doc_count = 1000;
            delete aggregations[name];
        }
      })
    return response.data
  }
}
