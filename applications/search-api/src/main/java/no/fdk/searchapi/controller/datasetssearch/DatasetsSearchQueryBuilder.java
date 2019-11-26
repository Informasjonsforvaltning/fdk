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
import static no.fdk.searchapi.controller.datasetssearch.QueryUtil.*;
import static org.apache.commons.lang3.StringUtils.isEmpty;

class DatasetsSearchQueryBuilder {
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

    DatasetsSearchQueryBuilder boostTitle(String title) {
        if (title == null || title.isEmpty()) {
            return this;
        }
        QueryBuilder nbQuery = QueryBuilders.matchPhrasePrefixQuery("title.nb", title).analyzer("norwegian").maxExpansions(15);
        QueryBuilder noQuery = QueryBuilders.matchPhrasePrefixQuery("title.no", title).analyzer("norwegian").maxExpansions(15);
        QueryBuilder nnQuery = QueryBuilders.matchPhrasePrefixQuery("title.nn", title).analyzer("norwegian").maxExpansions(15);
        QueryBuilder enQuery = QueryBuilders.matchPhrasePrefixQuery("title.en", title).analyzer("english").maxExpansions(15);

        composedQuery.should(nbQuery.boost(2));
        composedQuery.should(noQuery.boost(2));
        composedQuery.should(nnQuery.boost(2));
        composedQuery.should(enQuery.boost(2));
        return this;
    }

    DatasetsSearchQueryBuilder addFilters(Map<String, String> params) {
        for (Map.Entry<String, String> entry : params.entrySet()) {
            String filterName = entry.getKey();
            String filterValue = entry.getValue();

            if (isEmpty(filterValue)) continue; //skip filters with empty values

            Method[] methods = FilterBuilders.class.getDeclaredMethods();
            for (Method method : methods) {
                if (method.getName().equalsIgnoreCase(filterName)) {
                    try {
                        QueryBuilder filter = (QueryBuilder) (method.invoke(null, new Object[]{filterValue, this}));
                        // Difference between .must() and .filter() is that must keeps scores, while filter does not.
                        // We use .must() because of "q"-filter assigns scores.
                        // For other parameters, score s are irrelevant and therefore can be included safely.
                        if (filter != null) {
                            composedQuery.must(filter);
                        }
                    } catch (ReflectiveOperationException e) {
                        throw new RuntimeException("Filter invocation error:" + filterName);
                    }
                }
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
                .field("expandedLosTema.*")
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
                return isOpendataQuery();
            }
            if ("false".equals(value)) {
                return QueryBuilders.boolQuery().mustNot(isOpendataQuery());
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

        static QueryBuilder withDistributions(String value, DatasetsSearchQueryBuilder queryBuilder) {
            if ("true".equals(value)) {
                return hasDistributionQuery();
            }
            if ("false".equals(value)) {
                return QueryBuilders.boolQuery()
                    .mustNot(hasDistributionQuery());
            }
            return null;
        }

        static QueryBuilder isPublic(String value, DatasetsSearchQueryBuilder queryBuilder) {
            if ("true".equals(value)) {
                return isPublicQuery();
            }
            if ("false".equals(value)) {
                return QueryBuilders.boolQuery().mustNot(isPublicQuery());
            }
            return null;
        }

        static QueryBuilder losTheme(String losMainOrSubThemes, DatasetsSearchQueryBuilder queryBuilder) {
            String[] themes = losMainOrSubThemes.split("\\|");

            BoolQueryBuilder builder = QueryBuilders.boolQuery();
            for (String expandedMainTheme : themes) {
                String[] themesAndSubthemes = expandedMainTheme.split(",");
                builder = builder.must(QueryBuilders.termsQuery("losTheme.losPaths", themesAndSubthemes));
            }
            return builder;
        }

        static QueryBuilder withSubject(String value, DatasetsSearchQueryBuilder queryBuilder) {
            if ("true".equals(value)) {
                return hasSubjectQuery();
            }
            return null;
        }

        static QueryBuilder isNationalComponent(String value, DatasetsSearchQueryBuilder queryBuilder) {
            if ("true".equals(value)) {
                return isNationalComponentQuery();
            }
            return null;
        }

        static QueryBuilder subject(String value, DatasetsSearchQueryBuilder queryBuilder) {
            String[] subjectUris = value.split(",");
            return QueryBuilders.termsQuery("subject.uri", subjectUris);
        }

        static QueryBuilder distributionType(String value, DatasetsSearchQueryBuilder queryBuilder) {
            return QueryBuilders.termQuery("distribution.type.keyword", value);
        }

        static QueryBuilder distributionAccessServiceEndpointDescriptionUri(String value, DatasetsSearchQueryBuilder queryBuilder) {
            //todo when both apis and datasets are migrated to dcat 2.0 standard, can we have more logical way how to refer api registration from dataset registration.
            return QueryBuilders.termQuery("distribution.accessService.endpointDescription.uri.keyword", value);
        }

        static QueryBuilder themeProfile(String value, DatasetsSearchQueryBuilder queryBuilder) {
            if (!"transport".equalsIgnoreCase(value)) {
                return null;
            }
            BoolQueryBuilder builder = QueryBuilders.boolQuery();
            builder.should(FilterBuilders.losTheme("trafikk-og-transport/mobilitetstilbud", queryBuilder));
            builder.should(FilterBuilders.losTheme("trafikk-og-transport/trafikkinformasjon", queryBuilder));
            builder.should(FilterBuilders.losTheme("trafikk-og-transport/veg-og-vegregulering", queryBuilder));
            builder.should(FilterBuilders.losTheme("trafikk-og-transport/yrkestransport", queryBuilder));
            return builder;
        }

    }
}
