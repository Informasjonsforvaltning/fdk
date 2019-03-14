package no.fdk.searchapi.controller.datasetssearch;

import org.elasticsearch.index.query.BoolQueryBuilder;
import org.elasticsearch.index.query.QueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.index.query.RangeQueryBuilder;

import java.util.Date;

import static no.fdk.searchapi.controller.datasetssearch.Common.MISSING;

class QueryUtil {
    static QueryBuilder createTermQuery(String term, String value) {
        if (value.equals(MISSING)) {
            return QueryBuilders.boolQuery().mustNot(QueryBuilders.existsQuery(term));
        }
        return QueryBuilders.termQuery(term, value);
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

    static QueryBuilder isNationalComponentQuery() {
        return QueryBuilders.termQuery("provenance.code.raw", "NASJONAL");
    }

    static QueryBuilder isOpendataQuery() {
        return QueryBuilders.boolQuery()
            .must(QueryBuilders.termQuery("accessRights.code.raw", "PUBLIC"))
            .must(QueryBuilders.termQuery("distribution.openLicense", "true"));
    }

    static QueryBuilder hasSubjectQuery() {
        return QueryBuilders.existsQuery("subject.prefLabel");
    }

    static QueryBuilder hasDistributionQuery() {
        return QueryBuilders.existsQuery("distribution");
    }

    static QueryBuilder isPublicQuery() {
        return QueryBuilders.termQuery("accessRights.code.raw", "PUBLIC");
    }

}
