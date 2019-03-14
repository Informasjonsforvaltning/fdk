package no.fdk.searchapi.controller.datasetssearch;

import com.google.common.collect.ImmutableMap;
import org.elasticsearch.index.query.BoolQueryBuilder;
import org.elasticsearch.index.query.QueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.index.query.RangeQueryBuilder;
import org.elasticsearch.script.Script;
import org.elasticsearch.search.aggregations.AggregationBuilder;
import org.elasticsearch.search.aggregations.AggregationBuilders;
import org.elasticsearch.search.aggregations.bucket.filters.FiltersAggregator;
import org.elasticsearch.search.aggregations.bucket.terms.Terms;
import org.elasticsearch.search.aggregations.metrics.sum.SumAggregationBuilder;

import java.util.Date;

import static java.lang.Integer.MAX_VALUE;
import static no.fdk.searchapi.controller.datasetssearch.Common.MISSING;
import static org.elasticsearch.script.Script.DEFAULT_SCRIPT_LANG;
import static org.elasticsearch.script.ScriptType.INLINE;

class QueryUtil {
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
        final long DAY_IN_MS = 1000 * 3600 * 24;
        final long now = new Date().getTime();

        return QueryBuilders.rangeQuery(dateField).from(now - days * DAY_IN_MS).to(now).format("epoch_millis");
    }

    static AggregationBuilder createTermsAggregation(String aggregationName, String field) {
        return AggregationBuilders
            .terms(aggregationName)
            .missing(MISSING)
            .field(field)
            .size(MAX_VALUE) //be sure all theme counts are returned
            .order(Terms.Order.count(false));
    }

    static AggregationBuilder createTemporalAggregation(String name, String dateField) {

        return AggregationBuilders.filters(name,
            new FiltersAggregator.KeyedFilter("last7days", QueryUtil.createRangeQueryFromXdaysToNow(7, dateField)),
            new FiltersAggregator.KeyedFilter("last30days", QueryUtil.createRangeQueryFromXdaysToNow(30, dateField)),
            new FiltersAggregator.KeyedFilter("last365days", QueryUtil.createRangeQueryFromXdaysToNow(365, dateField)));
    }

    static SumAggregationBuilder createDistributionTypeCountAggregation(String name, String type) {
        return AggregationBuilders.sum(name).script(new Script(
            INLINE,
            DEFAULT_SCRIPT_LANG,
            "int count = 0; " +
                "if (params._source.distribution == null) return 0;" +
                "for (int i = 0; i < params._source.distribution.length; ++i) { " +
                "    if (params._source.distribution[i]['type'] == params.type) count++; " +
                "} " +
                "return count;",
            ImmutableMap.of("type", type)
        ));
    }

}
