package no.fdk.searchapi.controller.datasetssearch;

import com.google.common.collect.ImmutableMap;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.script.Script;
import org.elasticsearch.search.aggregations.AggregationBuilder;
import org.elasticsearch.search.aggregations.AggregationBuilders;
import org.elasticsearch.search.aggregations.bucket.filters.FiltersAggregator;
import org.elasticsearch.search.aggregations.bucket.terms.Terms;
import org.elasticsearch.search.aggregations.metrics.sum.SumAggregationBuilder;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import static java.lang.Integer.MAX_VALUE;
import static no.fdk.searchapi.controller.datasetssearch.Common.MISSING;
import static no.fdk.searchapi.controller.datasetssearch.QueryUtil.*;
import static org.elasticsearch.script.Script.DEFAULT_SCRIPT_LANG;
import static org.elasticsearch.script.ScriptType.INLINE;

public class DatasetsAggregations {

    static List<AggregationBuilder> buildAggregations(Set<String> aggregationFields) {
        List<AggregationBuilder> aggregations = new ArrayList<>();

        if (aggregationFields.contains("accessRights")) {
            aggregations.add(createTermsAggregation("accessRights", "accessRights.code.raw"));
        }
        if (aggregationFields.contains("theme")) {
            aggregations.add(createTermsAggregation("theme", "theme.code"));
        }
        if (aggregationFields.contains("los")) {
            aggregations.add(createTermsAggregation("los", "losTheme.losPaths"));
        }
        if (aggregationFields.contains("orgPath")) {
            aggregations.add(createTermsAggregation("orgPath", "publisher.orgPath"));
        }
        if (aggregationFields.contains("catalog")) {
            aggregations.add(createTermsAggregation("catalog", "catalog.uri"));
        }
        if (aggregationFields.contains("provenance")) {
            aggregations.add(createTermsAggregation("provenance", "provenance.code.raw"));
        }
        if (aggregationFields.contains("firstHarvested")) {
            aggregations.add(createTemporalAggregation("firstHarvested", "harvest.firstHarvested"));
        }
        if (aggregationFields.contains("spatial")) {
            aggregations.add(createTermsAggregation("spatial", "spatial.prefLabel.no.raw"));
        }
        if (aggregationFields.contains("opendata")) {
            aggregations.add(AggregationBuilders.filter("opendata", isOpendataQuery()));
        }
        if (aggregationFields.contains("withDistribution")) {
            aggregations.add(AggregationBuilders.filter("withDistribution", hasDistributionQuery()));
        }
        if (aggregationFields.contains("publicWithDistribution")) {
            aggregations.add(AggregationBuilders.filter("publicWithDistribution",
                QueryBuilders.boolQuery()
                    .must(hasDistributionQuery())
                    .must(isPublicQuery())
            ));
        }
        if (aggregationFields.contains("nonpublicWithDistribution")) {
            aggregations.add(AggregationBuilders.filter("nonpublicWithDistribution",
                QueryBuilders.boolQuery()
                    .must(hasDistributionQuery())
                    .mustNot(isPublicQuery())
            ));
        }
        if (aggregationFields.contains("publicWithoutDistribution")) {
            aggregations.add(AggregationBuilders.filter("publicWithoutDistribution",
                QueryBuilders.boolQuery()
                    .mustNot(hasDistributionQuery())
                    .must(isPublicQuery())
            ));
        }
        if (aggregationFields.contains("nonpublicWithoutDistribution")) {
            aggregations.add(AggregationBuilders.filter("nonpublicWithoutDistribution",
                QueryBuilders.boolQuery()
                    .mustNot(hasDistributionQuery())
                    .mustNot(isPublicQuery())
            ));
        }
        if (aggregationFields.contains("withSubject")) {
            aggregations.add(AggregationBuilders.filter("withSubject", hasSubjectQuery()));
        }
        if (aggregationFields.contains("nationalComponent")) {
            aggregations.add(AggregationBuilders.filter("nationalComponent", isNationalComponentQuery()));
        }
        if (aggregationFields.contains("subjects")) {
            aggregations.add(AggregationBuilders
                .terms("subjects")
                .field("subject.uri")
                .size(5)
                .order(Terms.Order.count(false)));
        }
        if (aggregationFields.contains("distributionCountForTypeApi")) {
            aggregations.add(createDistributionTypeCountAggregation("distributionCountForTypeApi", "http://publications.europa.eu/resource/authority/distribution-type/WEB_SERVICE"));
        }
        if (aggregationFields.contains("distributionCountForTypeFeed")) {
            aggregations.add(createDistributionTypeCountAggregation("distributionCountForTypeFeed", "http://publications.europa.eu/resource/authority/distribution-type/FEED_INFO"));
        }
        if (aggregationFields.contains("distributionCountForTypeFile")) {
            aggregations.add(createDistributionTypeCountAggregation("distributionCountForTypeFile", "http://publications.europa.eu/resource/authority/distribution-type/DOWNLOADABLE_FILE"));
        }
        return aggregations;
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
