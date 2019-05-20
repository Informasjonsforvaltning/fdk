package no.ccat.controller;

import org.elasticsearch.index.query.BoolQueryBuilder;
import org.elasticsearch.index.query.QueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.lang.reflect.Method;
import java.util.Map;

import static org.apache.commons.lang3.StringUtils.isEmpty;

public class ConceptSearchESQueryBuilder {
    private static Logger logger = LoggerFactory.getLogger(ConceptSearchESQueryBuilder.class);

    private BoolQueryBuilder composedQuery;

    ConceptSearchESQueryBuilder() {
        // Default query is to match all. Additional .must clauses will narrow it down.
        composedQuery = QueryBuilders.boolQuery().must(QueryBuilders.matchAllQuery());
    }

    BoolQueryBuilder build() {
        return composedQuery;
    }

    ConceptSearchESQueryBuilder addParams(Map<String, String> params) {
        for (Map.Entry<String, String> entry : params.entrySet()) {
            String filterName = entry.getKey();
            String filterValue = entry.getValue();

            if (isEmpty(filterValue)) continue; //skip filters with empty values

            Method[] methods = ConceptSearchParamHandlers.class.getDeclaredMethods();
            for (Method method : methods) {
                if (method.getName().equalsIgnoreCase(filterName)) {
                    try {
                        QueryBuilder filter = (QueryBuilder) (method.invoke(null, new Object[]{filterValue, this}));
                        // Difference between .must() and .filter() is that must keeps scores, while filter does not.
                        // We use .must() because of "q"-filter assigns scores.
                        // For other parameters, scores are irrelevant and therefore can be included safely.
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

    ConceptSearchESQueryBuilder boostPrefLabel(String preflabel) {
        if (preflabel == null || preflabel.isEmpty()) {
            return this;
        }
        QueryBuilder nbQuery = QueryBuilders.matchPhrasePrefixQuery("prefLabel.nb", preflabel).analyzer("norwegian").maxExpansions(15);
        QueryBuilder noQuery = QueryBuilders.matchPhrasePrefixQuery("prefLabel.no", preflabel).analyzer("norwegian").maxExpansions(15);
        QueryBuilder nnQuery = QueryBuilders.matchPhrasePrefixQuery("prefLabel.nn", preflabel).analyzer("norwegian").maxExpansions(15);
        QueryBuilder enQuery = QueryBuilders.matchPhrasePrefixQuery("prefLabel.en", preflabel).analyzer("english").maxExpansions(15);

        composedQuery.should(nbQuery.boost(2));
        composedQuery.should(noQuery.boost(2));
        composedQuery.should(nnQuery.boost(2));
        composedQuery.should(enQuery.boost(2));
        return this;
    }
}
