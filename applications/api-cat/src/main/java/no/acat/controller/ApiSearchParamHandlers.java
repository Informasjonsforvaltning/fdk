package no.acat.controller;

import org.elasticsearch.index.query.QueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;

class ApiSearchParamHandlers {
    static QueryBuilder q(String value, ApiSearchESQueryBuilder queryBuilder) {
        String searchText = !value.contains(" ") ? value + " " + value + "*" : value;

        return QueryBuilders.simpleQueryStringQuery(searchText);
    }

    static QueryBuilder title(String value, ApiSearchESQueryBuilder queryBuilder) {
        return QueryBuilders.matchPhrasePrefixQuery("title", value).analyzer("norwegian").maxExpansions(15);

    }

    static QueryBuilder orgPath(String value, ApiSearchESQueryBuilder queryBuilder) {
        return ESQueryUtil.createTermQuery("publisher.orgPath", value);
    }

    static QueryBuilder harvestSourceUri(String value, ApiSearchESQueryBuilder queryBuilder) {
        return ESQueryUtil.createTermQuery("harvestSourceUri", value);
    }

    static QueryBuilder format(String value, ApiSearchESQueryBuilder queryBuilder) {
        String[] formats = value.split(",");
        return ESQueryUtil.createTermsQuery("formats", formats);
    }

    static QueryBuilder datasetid(String value, ApiSearchESQueryBuilder queryBuilder) {
        return QueryBuilders.termQuery("datasetReferences.id", value);
    }
}
