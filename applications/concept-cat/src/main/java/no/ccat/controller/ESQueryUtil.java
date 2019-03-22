package no.ccat.controller;

import org.elasticsearch.index.query.QueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.index.query.RangeQueryBuilder;
import org.elasticsearch.search.aggregations.AbstractAggregationBuilder;
import org.elasticsearch.search.aggregations.AggregationBuilders;
import org.elasticsearch.search.aggregations.bucket.filters.FiltersAggregator;
import org.elasticsearch.search.aggregations.bucket.terms.Terms;

import java.util.Date;

import static no.ccat.controller.Common.MISSING;

class ESQueryUtil {
    static RangeQueryBuilder createRangeQueryFromXdaysToNow(int days, String dateField) {
        final long DAY_IN_MS = 1000 * 3600 * 24;
        long now = new Date().getTime();

        return QueryBuilders.rangeQuery(dateField).from(now - days * DAY_IN_MS).to(now).format("epoch_millis");
    }

    static QueryBuilder createTermQuery(String term, String value) {
        return value.equals(MISSING) ?
            QueryBuilders.boolQuery().mustNot(QueryBuilders.existsQuery(term)) :
            QueryBuilders.termQuery(term, value);
    }


    static AbstractAggregationBuilder createTemporalAggregation(String name, String dateField) {

        return AggregationBuilders.filters(name,
            new FiltersAggregator.KeyedFilter("last7days", ESQueryUtil.createRangeQueryFromXdaysToNow(7, dateField)),
            new FiltersAggregator.KeyedFilter("last30days", ESQueryUtil.createRangeQueryFromXdaysToNow(30, dateField)),
            new FiltersAggregator.KeyedFilter("last365days", ESQueryUtil.createRangeQueryFromXdaysToNow(365, dateField)));
    }

    static AbstractAggregationBuilder createTermsAggregation(String aggregationName, String field) {
        return AggregationBuilders
            .terms(aggregationName)
            .missing(MISSING)
            .field(field)
            .size(Integer.MAX_VALUE) //be sure all theme counts are returned
            .order(Terms.Order.count(false));
    }
}
