package no.fdk.searchapi.controller.datasetssearch;

import org.elasticsearch.index.query.BoolQueryBuilder;
import org.elasticsearch.index.query.Operator;
import org.elasticsearch.index.query.QueryBuilders;

import java.util.Arrays;
import java.util.Map;

import static no.fdk.searchapi.controller.datasetssearch.Common.MISSING;
import static org.apache.commons.lang3.StringUtils.isNotEmpty;

public class DatasetsSearchQueryBuilder {
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

        String title = params.getOrDefault("title", "");
        if (isNotEmpty(title)) {
            org.elasticsearch.index.query.QueryBuilder nbQuery = QueryBuilders.matchPhrasePrefixQuery("title.nb", title).analyzer("norwegian").maxExpansions(15);
            org.elasticsearch.index.query.QueryBuilder noQuery = QueryBuilders.matchPhrasePrefixQuery("title.no", title).analyzer("norwegian").maxExpansions(15);
            org.elasticsearch.index.query.QueryBuilder nnQuery = QueryBuilders.matchPhrasePrefixQuery("title.nn", title).analyzer("norwegian").maxExpansions(15);
            org.elasticsearch.index.query.QueryBuilder enQuery = QueryBuilders.matchPhrasePrefixQuery("title.en", title).analyzer("english").maxExpansions(15);
            composedQuery.must(QueryBuilders.boolQuery().should(nbQuery).should(noQuery).should(nnQuery).should(enQuery));
        }

        String query = params.getOrDefault("q", "");
        if (isNotEmpty(query)) {
            // add * if query only contains one word
            if (!query.contains(" ")) {
                query = query + " " + query + "*";
            }
            composedQuery.must(QueryBuilders.simpleQueryStringQuery(query)
                .analyzer(("en".equals(lang)) ? "english" : "norwegian")
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
                .defaultOperator(Operator.OR));
        }

        String theme = params.getOrDefault("theme", "");
        // theme can contain multiple themes, example: AGRI,HEAL
        if (isNotEmpty(theme)) {
            String[] themes = theme.split(",");
            composedQuery.filter(QueryUtil.createTermsQuery("theme.code", themes));
        }

        String catalog = params.getOrDefault("catalog", "");
        if (isNotEmpty(catalog)) {
            composedQuery.filter(QueryUtil.createTermQuery("catalog.uri", catalog));
        }

        String accessRights = params.getOrDefault("accessrights", "");
        if (isNotEmpty(accessRights)) {
            composedQuery.filter(QueryUtil.createTermQuery("accessRights.code.raw", accessRights));
        }
        String opendata = params.getOrDefault("opendata", "");
        if (isNotEmpty(opendata)) {
            BoolQueryBuilder opendataFilter = QueryBuilders.boolQuery();
            if (opendata.equals("true")) {
                opendataFilter.must(QueryBuilders.termQuery("distribution.openLicense", "true"));
                opendataFilter.must(QueryBuilders.termQuery("accessRights.code.raw", "PUBLIC"));
            }
            //Handle the negative cases
            else if (opendata.equals("false")) {
                BoolQueryBuilder notOpenLicenseFilter = QueryBuilders.boolQuery();
                BoolQueryBuilder notOpenDistributionFilter = QueryBuilders.boolQuery();
                notOpenLicenseFilter.mustNot(QueryBuilders.termQuery("distribution.openLicense", "true"));
                notOpenDistributionFilter.mustNot(QueryBuilders.termQuery("accessRights.code.raw", "PUBLIC"));
                opendataFilter.should(notOpenLicenseFilter);
                opendataFilter.should(notOpenDistributionFilter);
            }
            composedQuery.filter(opendataFilter);
        }

        String orgPath = params.getOrDefault("orgPath", "");
        if (isNotEmpty(orgPath)) {
            composedQuery.filter(QueryUtil.createTermQuery("publisher.orgPath", orgPath));
        }

        int firstHarvested = Integer.parseInt(params.getOrDefault("firstHarvested", "0"));
        if (firstHarvested > 0) {
            composedQuery.filter(QueryUtil.createRangeQueryFromXdaysToNow(firstHarvested, "harvest.firstHarvested"));
        }

        String provenance = params.getOrDefault("provenance", "");
        if (isNotEmpty(provenance)) {
            composedQuery.filter(QueryUtil.createTermQuery("provenance.code.raw", accessRights));
        }

        String spatial = params.getOrDefault("spatial", "");
        if (isNotEmpty(spatial)) {
            BoolQueryBuilder spatialFilter = QueryBuilders.boolQuery();

            String[] spatials = spatial.split(",");
            Arrays.stream(spatials).forEach(spatialLabel -> {
                if (spatialLabel.equals(MISSING)) {
                    spatialFilter.mustNot(QueryBuilders.existsQuery("spatial"));
                } else if (spatialLabel.startsWith("http")) {
                    spatialFilter.must(QueryBuilders.termQuery("spatial.uri", spatialLabel));
                } else {
                    spatialFilter.must(QueryBuilders.termQuery("spatial.prefLabel.no.raw", spatialLabel));
                }
            });

            composedQuery.filter(spatialFilter);
        }
        return this;
    }
}
