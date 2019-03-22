package no.acat.controller;

import org.elasticsearch.index.query.QueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;

import static no.acat.controller.ESQueryUtil.isActiveQuery;

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

    static QueryBuilder active(String value, ApiSearchESQueryBuilder queryBuilder) {
        if ("true".equals(value)) {
            return isActiveQuery();
        }
        return null;
    }

    static QueryBuilder serviceType(String value, ApiSearchESQueryBuilder queryBuilder) {
        return QueryBuilders.termQuery("serviceType", value);
    }

    static QueryBuilder orgNos(String value, ApiSearchESQueryBuilder queryBuilder) {
        String[] orgNos = value.split(",");
        return QueryBuilders.termsQuery("publisher.id", orgNos);
    }

    static QueryBuilder isOpenAccess(String value, ApiSearchESQueryBuilder queryBuilder) {
        return QueryBuilders.termQuery("isOpenAccess", value);
    }

    static QueryBuilder isOpenLicense(String value, ApiSearchESQueryBuilder queryBuilder) {
        return QueryBuilders.termQuery("isOpenLicense", value);
    }

    static QueryBuilder isFree(String value, ApiSearchESQueryBuilder queryBuilder) {
        return QueryBuilders.termQuery("isFree", value);
    }
}
