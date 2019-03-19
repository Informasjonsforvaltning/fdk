package no.acat.controller;

import org.elasticsearch.index.query.BoolQueryBuilder;
import org.elasticsearch.index.query.QueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.index.query.RangeQueryBuilder;
import org.elasticsearch.search.aggregations.AggregationBuilder;
import org.elasticsearch.search.aggregations.AggregationBuilders;
import org.elasticsearch.search.aggregations.bucket.filters.FiltersAggregator;
import org.elasticsearch.search.aggregations.bucket.terms.Terms;

import java.util.Date;

import static no.acat.controller.Common.MISSING;

class ESQueryUtil {
    static QueryBuilder createTermQuery(String term, String value) {
        return value.equals(MISSING) ?
            QueryBuilders.boolQuery().mustNot(QueryBuilders.existsQuery(term)) :
            QueryBuilders.termQuery(term, value);
    }

    static QueryBuilder createTermsQuery(String term, String[] values) {
        BoolQueryBuilder composedQuery = QueryBuilders.boolQuery();
        for (String value : values) {
            if (value.equals(MISSING)) {
                composedQuery.filter(QueryBuilders.boolQuery().mustNot(QueryBuilders.existsQuery(term)));
            } else {
                composedQuery.filter(QueryBuilders.termQuery(term, value));
            }
        }
        return composedQuery;
    }

    static RangeQueryBuilder createRangeQueryFromXdaysToNow(int days, String dateField) {
        final long now = new Date().getTime();
        final int DAY_IN_MS = 1000 * 3600 * 24;

        return QueryBuilders.rangeQuery(dateField).from(now - days * DAY_IN_MS).to(now).format("epoch_millis");
    }

    static QueryBuilder isNationalComponentQuery() {
        return QueryBuilders.termQuery("nationalComponent", "true");
    }

    static QueryBuilder isActiveQuery() {
        // api is active if it is not removed and if it does not have deprecation date or the deprecation date is in future.
        return QueryBuilders.boolQuery()
            .mustNot(QueryBuilders.termQuery("statusCode","REMOVED"))
            .should(QueryBuilders.rangeQuery("deprecationInfoExpirationDate").from("now"))
            .should(QueryBuilders.boolQuery().mustNot(QueryBuilders.existsQuery("deprecationInfoExpirationDate")));
    }

    static AggregationBuilder createTermsAggregation(String aggregationName, String field) {
        return AggregationBuilders
            .terms(aggregationName)
            .missing(MISSING)
            .field(field)
            .size(Integer.MAX_VALUE)
            .order(Terms.Order.count(false));
    }

    static AggregationBuilder createCardinalityAggregation(String aggregationName, String field) {
         /*
            https://www.elastic.co/guide/en/elasticsearch/reference/5.5/search-aggregations-metrics-cardinality-aggregation.html#search-aggregations-metrics-cardinality-aggregation

            The precision_threshold option is specific to the current internal implementation of the cardinality agg, which may change in the future



The precision_threshold options allows to trade memory for accuracy, and defines a unique count below which counts are expected to be close to accurate. Above this value, counts might become a bit more fuzzy. The maximum supported value is 40000, thresholds above this number will have the same effect as a threshold of 40000. The default values is 3000.
             */

        final int MAX_PRECISION = 40000;
        return AggregationBuilders.cardinality(aggregationName)
            .field(field)
            .precisionThreshold(MAX_PRECISION);
    }

    static AggregationBuilder createTemporalAggregation(String name, String dateField) {

        return AggregationBuilders.filters(name,
            new FiltersAggregator.KeyedFilter("last7days", ESQueryUtil.createRangeQueryFromXdaysToNow(7, dateField)),
            new FiltersAggregator.KeyedFilter("last30days", ESQueryUtil.createRangeQueryFromXdaysToNow(30, dateField)),
            new FiltersAggregator.KeyedFilter("last365days", ESQueryUtil.createRangeQueryFromXdaysToNow(365, dateField)));
    }
}
