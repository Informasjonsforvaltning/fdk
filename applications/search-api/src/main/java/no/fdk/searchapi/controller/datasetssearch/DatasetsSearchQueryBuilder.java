package no.fdk.searchapi.controller.datasetssearch;

import org.elasticsearch.index.query.BoolQueryBuilder;
import org.elasticsearch.index.query.Operator;
import org.elasticsearch.index.query.QueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.lang.reflect.Method;
import java.util.Arrays;
import java.util.Map;

import static no.fdk.searchapi.controller.datasetssearch.Common.MISSING;
import static org.apache.commons.lang3.StringUtils.isEmpty;

public class DatasetsSearchQueryBuilder {
    private static Logger logger = LoggerFactory.getLogger(DatasetsSearchQueryBuilder.class);

    private BoolQueryBuilder composedQuery;
    private String lang = "nb";

    DatasetsSearchQueryBuilder() {
        // Default query is to match all. User defined filters will narrow it down.
        composedQuery = QueryBuilders.boolQuery().must(QueryBuilders.matchAllQuery());
    }

    BoolQueryBuilder build() {
        return composedQuery;
    }

    DatasetsSearchQueryBuilder lang(String lang) {
        this.lang = lang;
        return this;
    }

    DatasetsSearchQueryBuilder boostNationalComponents() {
        // Increase score of national components in all queries
        // in api-cat, we use modern notation nationalComponent=true, while in dataset is not as explicit
        composedQuery.should(QueryUtil.createTermQuery("provenance.code.raw", "NASJONAL").boost(2));
        return this;
    }

    DatasetsSearchQueryBuilder addFilters(Map<String, String> params) {
        for (Map.Entry<String, String> entry : params.entrySet()) {
            String filterName = entry.getKey();
            String filterValue = entry.getValue();

            if (isEmpty(filterValue)) continue; //skip filters with empty values

            try {
                Method filterMethod = FilterBuilders.class.getDeclaredMethod(filterName, String.class, DatasetsSearchQueryBuilder.class);
                QueryBuilder filter = (QueryBuilder) (filterMethod.invoke(null, new Object[]{filterValue, this}));
                // Difference between .must() and .filter() is that must keeps scores, while filter does not.
                // We use .must() because of "q"-filter assigns scores.
                // For other parameters, scores are irrelevant and therefore can be included safely.
                if (filter != null) {
                    composedQuery.must(filter);
                }
            } catch (Exception e) {
                // skip silently params that are not implemented as filters
                logger.debug("Filter method exception: {}, {}", filterName, e);
            }
        }
        return this;
    }

    static class FilterBuilders {
        static QueryBuilder q(String value, DatasetsSearchQueryBuilder queryBuilder) {
            String searchText = !value.contains(" ") ? value + " " + value + "*" : value;

            return QueryBuilders.simpleQueryStringQuery(searchText)
                .analyzer(("en".equals(queryBuilder.lang)) ? "english" : "norwegian")
                .field("title.*").boost(3f)
                .field("objective.*")
                .field("keyword.*").boost(2f)
                .field("theme.title.*")
                .field("description.*")
                .field("publisher.name").boost(3f)
                .field("publisher.prefLabel.*").boost(3f)
                .field("accessRights.prefLabel.*")
                .field("accessRights.code")
                .field("subject.prefLabel.*")
                .field("subject.altLabel.*")
                .field("subject.definition.*")
                .defaultOperator(Operator.OR);
        }

        static QueryBuilder title(String value, DatasetsSearchQueryBuilder queryBuilder) {
            QueryBuilder nbQuery = QueryBuilders.matchPhrasePrefixQuery("title.nb", value).analyzer("norwegian").maxExpansions(15);
            QueryBuilder noQuery = QueryBuilders.matchPhrasePrefixQuery("title.no", value).analyzer("norwegian").maxExpansions(15);
            QueryBuilder nnQuery = QueryBuilders.matchPhrasePrefixQuery("title.nn", value).analyzer("norwegian").maxExpansions(15);
            QueryBuilder enQuery = QueryBuilders.matchPhrasePrefixQuery("title.en", value).analyzer("english").maxExpansions(15);
            return QueryBuilders.boolQuery().should(nbQuery).should(noQuery).should(nnQuery).should(enQuery);
        }

        static QueryBuilder theme(String value, DatasetsSearchQueryBuilder queryBuilder) {
            // theme can contain multiple themes, example: AGRI,HEAL
            String[] themes = value.split(",");
            return QueryUtil.createTermsQuery("theme.code", themes);
        }

        static QueryBuilder catalog(String value, DatasetsSearchQueryBuilder queryBuilder) {
            return QueryUtil.createTermQuery("catalog.uri", value);
        }

        static QueryBuilder accessrights(String value, DatasetsSearchQueryBuilder queryBuilder) {
            return QueryUtil.createTermQuery("accessRights.code.raw", value);
        }

        static QueryBuilder opendata(String value, DatasetsSearchQueryBuilder queryBuilder) {
            if ("true".equals(value)) {
                return QueryBuilders.boolQuery()
                    .must(QueryBuilders.termQuery("distribution.openLicense", "true"))
                    .must(QueryBuilders.termQuery("accessRights.code.raw", "PUBLIC"));
            }
            if ("false".equals(value)) {
                // not open or not public
                return QueryBuilders.boolQuery()
                    .should(QueryBuilders.boolQuery().mustNot(QueryBuilders.termQuery("distribution.openLicense", "true")))
                    .should(QueryBuilders.boolQuery().mustNot(QueryBuilders.termQuery("accessRights.code.raw", "PUBLIC")));
            }
            return null;
        }

        static QueryBuilder orgPath(String value, DatasetsSearchQueryBuilder queryBuilder) {
            return QueryUtil.createTermQuery("publisher.orgPath", value);
        }

        static QueryBuilder firstHarvested(String value, DatasetsSearchQueryBuilder queryBuilder) {
            int firstHarvested = Integer.parseInt(value);
            return (QueryUtil.createRangeQueryFromXdaysToNow(firstHarvested, "harvest.firstHarvested"));
        }

        static QueryBuilder provenance(String value, DatasetsSearchQueryBuilder queryBuilder) {
            return QueryUtil.createTermQuery("provenance.code.raw", value);
        }


        static QueryBuilder spatial(String value, DatasetsSearchQueryBuilder queryBuilder) {
            BoolQueryBuilder spatialFilter = QueryBuilders.boolQuery();
            String[] spatials = value.split(",");

            Arrays.stream(spatials).forEach(spatialLabel -> {
                if (spatialLabel.equals(MISSING)) {
                    spatialFilter.mustNot(QueryBuilders.existsQuery("spatial"));
                } else if (spatialLabel.startsWith("http")) {
                    spatialFilter.must(QueryBuilders.termQuery("spatial.uri", spatialLabel));
                } else {
                    spatialFilter.must(QueryBuilders.termQuery("spatial.prefLabel.no.raw", spatialLabel));
                }
            });

            return spatialFilter;
        }
    }
}
