import {AxiosESTransport} from "searchkit";
const defaults = require("lodash/defaults");
import * as axios from "axios";
const qs = require('qs');
const ReactGA = require('react-ga');

export class DatasetsQueryTransport extends AxiosESTransport {
  constructor(host, options) {
    super()
    this.options = defaults(options, {
      headers:{},
      searchUrlPath: "/datasets"
    })
    this.axios = axios.create({
      baseURL:this.host,
      timeout:AxiosESTransport.timeout,
      headers:this.options.headers
    })
    this.filters = [
      {key: 'sort.selector'},
      {
        key: 'theme.code.raw',
        paramName: 'theme',
        name: 'theme_count'
      },
      {
        key: 'accessRights.authorityCode.raw',
        paramName: 'accessrights',
        name: 'accessRightsCount'
      },
      {
        key: 'publisher.name.raw',
        paramName: 'publisher',
        name: 'publisherCount',
      },
      {
        key: 'publisher.orgPath.raw',
        paramName: 'orgpath',
        name: 'orgPath',
      }
    ];
  }

  search(query) {
    this.filters.forEach((filter)=> {
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
    let hasSingleWord = false;
    if(query.query) {
      let q = query.query.simple_query_string.query;
      hasSingleWord = !q.includes(' ') && !q.includes('*'); // no spaces and no asterix search
    }

    if (query.query) {
      ReactGA.event({
        category: 'Søk',
        action: 'Søk i datasett',
        label: query.query.simple_query_string.query
      });
    }

    let filtersUrlFragment = this.filters.map(filter=>filter.query).join(''); // build url fragment from list of filters
    return this.axios.get(
      `${this.options.searchUrlPath}?q=` +
			(query.query ? encodeURIComponent(query.query.simple_query_string.query) : '') +
      (hasSingleWord ? ' ' + query.query.simple_query_string.query + '*' : '') + // if there is a single word, we add keyword with a trailing assterix
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

  getData(response) { // this response is not the raw response from the ajax request. It's been modified.
    console.log('response is ', response);
    let aggregations = response.data.aggregations;
      this.filters.forEach((filter, index)=>{
        let name = filter.name;
        let key = filter.key;
        let numberedKey = filter.key + (index + 3); // why 3? seems the first 2-3 are internal searchkit stuff
        if (aggregations && aggregations.hasOwnProperty(name)) {
          aggregations[numberedKey] = {};
          let aggregation = aggregations[numberedKey];
            aggregation.size = '5';
            aggregation[key] = aggregations[name];
            if(aggregation[key].buckets.length > 5 && name !== 'orgPath') {
              aggregation[key].buckets.splice(5, 0, {key:'showmoreinput'});
              aggregation[key].buckets.splice(6, 0, {key:'showmorelabel'});
              aggregation[key].buckets.splice(100, 0, {key:'showfewerlabel'});
            }
            aggregation[key].buckets.sort(function(a, b) {
              var keyA = a.key.toUpperCase(); // ignore upper and lowercase
              var keyB = b.key.toUpperCase(); // ignore upper and lowercase
              if (keyA < keyB) {
                return -1;
              }
              if (keyA > keyB) {
                return 1;
              }

              // keys must be equal
              return 0;
            });
            aggregation[key].buckets = aggregations[numberedKey][key].buckets.slice(0,101);
            aggregation[key].doc_count_error_upper_bound = 1000;
            aggregation[key].sum_other_doc_count = 1000;
            delete aggregations[name];
        }
      })
    return response.data
  }
}
