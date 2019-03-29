package no.ccat.controller;

import org.elasticsearch.index.query.QueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;

class ConceptSearchParamHandlers {
    static QueryBuilder q(String value, ConceptSearchESQueryBuilder queryBuilder) {
        String searchText = !value.contains(" ") ? value + " " + value + "*" : value;

        return QueryBuilders.simpleQueryStringQuery(searchText);
    }

    static QueryBuilder orgPath(String value, ConceptSearchESQueryBuilder queryBuilder) {
        return ESQueryUtil.createTermQuery("publisher.orgPath", value);
    }

    static QueryBuilder prefLabel(String value, ConceptSearchESQueryBuilder queryBuilder) {

        QueryBuilder nbQuery = QueryBuilders.matchPhrasePrefixQuery("prefLabel.nb", value).analyzer("norwegian").maxExpansions(15);
        QueryBuilder noQuery = QueryBuilders.matchPhrasePrefixQuery("prefLabel.no", value).analyzer("norwegian").maxExpansions(15);
        QueryBuilder nnQuery = QueryBuilders.matchPhrasePrefixQuery("prefLabel.nn", value).analyzer("norwegian").maxExpansions(15);
        QueryBuilder enQuery = QueryBuilders.matchPhrasePrefixQuery("prefLabel.en", value).analyzer("english").maxExpansions(15);
        return QueryBuilders.boolQuery().should(nbQuery).should(noQuery).should(nnQuery).should(enQuery);
    }

    static QueryBuilder firstHarvested(String value, ConceptSearchESQueryBuilder queryBuilder) {
        int firstHarvested = Integer.parseInt(value);
        return (ESQueryUtil.createRangeQueryFromXdaysToNow(firstHarvested, "harvest.firstHarvested"));
    }

    static QueryBuilder uris(String value, ConceptSearchESQueryBuilder queryBuilder) {
            String[] uris = value.split(",");
            return QueryBuilders.termsQuery("uri", uris);
        }

}
