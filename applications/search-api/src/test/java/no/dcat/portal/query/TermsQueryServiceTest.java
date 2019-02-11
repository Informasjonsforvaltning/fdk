package no.dcat.portal.query;

import no.dcat.shared.testcategories.UnitTest;
import org.elasticsearch.action.ListenableActionFuture;
import org.elasticsearch.action.search.SearchRequestBuilder;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.client.Client;
import org.elasticsearch.index.query.QueryBuilder;
import org.elasticsearch.search.aggregations.AggregationBuilder;
import org.junit.Before;
import org.junit.Test;
import org.junit.experimental.categories.Category;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@Category(UnitTest.class)
public class TermsQueryServiceTest {

    TermsQueryService service;
    SearchResponse searchResponse;
    Client client;
    String dataset = "{\n" +
        "  \"took\" : 32,\n" +
        "  \"timed_out\" : false,\n" +
        "  \"_shards\" : {\n" +
        "    \"total\" : 5,\n" +
        "    \"successful\" : 5,\n" +
        "    \"failed\" : 0\n" +
        "  },\n" +
        "  \"hits\" : {\n" +
        "    \"total\" : 2,\n" +
        "    \"max_score\" : 1.0,\n" +
        "    \"hits\" : [ {\n" +
        "      \"_index\" : \"dcat\",\n" +
        "      \"_type\" : \"subject\",\n" +
        "      \"_id\" : \"https://data-david.github.io/Begrep/begrep/Enhet\",\n" +
        "      \"_score\" : 1.0,\n" +
        "      \"_source\" : {\n" +
        "        \"uri\" : \"https://data-david.github.io/Begrep/begrep/Enhet\",\n" +
        "        \"identifier\" : \"https://data-david.github.io/Begrep/begrep/Enhet\",\n" +
        "        \"prefLabel\" : {\n" +
        "          \"no\" : \"enhet\"\n" +
        "        },\n" +
        "        \"definition\" : {\n" +
        "          \"no\" : \"alt som er registrert med et organisasjonsnummer \"\n" +
        "        },\n" +
        "        \"note\" : {\n" +
        "          \"no\" : \"Alle hovedenheter, underenheter og organisasjonsledd som er identifisert med et organisasjonsnummer.\"\n" +
        "        },\n" +
        "        \"source\" : \"https://jira.brreg.no/browse/BEGREP-208\",\n" +
        "        \"creator\" : {\n" +
        "          \"type\" : \"no.dcat.datastore.domain.dcat.Publisher\",\n" +
        "          \"overordnetEnhet\" : \"912660680\",\n" +
        "          \"organisasjonsform\" : \"ORGL\",\n" +
        "          \"naeringskode\" : {\n" +
        "            \"uri\" : \"http://www.ssb.no/nace/sn2007/84.110\",\n" +
        "            \"code\" : \"84.110\",\n" +
        "            \"prefLabel\" : {\n" +
        "              \"no\" : \"Generell offentlig administrasjon\"\n" +
        "            }\n" +
        "          },\n" +
        "          \"sektorkode\" : {\n" +
        "            \"uri\" : \"http://www.brreg.no/sektorkode/6100\",\n" +
        "            \"code\" : \"6100\",\n" +
        "            \"prefLabel\" : {\n" +
        "              \"no\" : \"Statsforvaltningen\"\n" +
        "            }\n" +
        "          },\n" +
        "          \"valid\" : true,\n" +
        "          \"uri\" : \"http://data.brreg.no/enhetsregisteret/enhet/974760673\",\n" +
        "          \"id\" : \"974760673\",\n" +
        "          \"name\" : \"Brønnøysundregistrene\",\n" +
        "          \"orgPath\" : \"/STAT/912660680/974760673\"\n" +
        "        },\n" +
        "        \"inScheme\" : [ \"http://data-david.github.io/vokabular/Befolkning\" ]\n" +
        "      }\n" +
        "    }, {\n" +
        "      \"_index\" : \"dcat\",\n" +
        "      \"_type\" : \"subject\",\n" +
        "      \"_id\" : \"https://data-david.github.io/Begrep/begrep/Organisasjonsnummer\",\n" +
        "      \"_score\" : 1.0,\n" +
        "      \"_source\" : {\n" +
        "        \"uri\" : \"https://data-david.github.io/Begrep/begrep/Organisasjonsnummer\",\n" +
        "        \"identifier\" : \"https://data-david.github.io/Begrep/begrep/Organisasjonsnummer\",\n" +
        "        \"prefLabel\" : {\n" +
        "          \"no\" : \"organisasjonsnummer\"\n" +
        "        },\n" +
        "        \"altLabel\" : [ {\n" +
        "          \"no\" : \"Orgid\"\n" +
        "        }, {\n" +
        "          \"no\" : \"Orgnr\"\n" +
        "        } ],\n" +
        "        \"definition\" : {\n" +
        "          \"no\" : \"Et nisifret nummer som tildeles av Enhetsregisteret for en organisasjon som skal operere som en offentlig aktør\"\n" +
        "        },\n" +
        "        \"note\" : {\n" +
        "          \"no\" : \"Organisasjonsnummeret brukes av Enhetsregisteret og samhandlende registre\"\n" +
        "        },\n" +
        "        \"source\" : \"https://jira.brreg.no/browse/BEGREP-4\"\n" +
        "      }\n" +
        "    } ]\n" +
        "  },\n" +
        "  \"aggregations\" : {\n" +
        "    \"creator\" : {\n" +
        "      \"doc_count_error_upper_bound\" : 0,\n" +
        "      \"sum_other_doc_count\" : 0,\n" +
        "      \"buckets\" : [ {\n" +
        "        \"key\" : \"Brønnøysundregistrene\",\n" +
        "        \"doc_count\" : 1\n" +
        "      }, {\n" +
        "        \"key\" : \"ukjent\",\n" +
        "        \"doc_count\" : 1\n" +
        "      } ]\n" +
        "    },\n" +
        "    \"orgPath\" : {\n" +
        "      \"doc_count_error_upper_bound\" : 0,\n" +
        "      \"sum_other_doc_count\" : 0,\n" +
        "      \"buckets\" : [ {\n" +
        "        \"key\" : \"/STAT\",\n" +
        "        \"doc_count\" : 1\n" +
        "      }, {\n" +
        "        \"key\" : \"/STAT/912660680\",\n" +
        "        \"doc_count\" : 1\n" +
        "      }, {\n" +
        "        \"key\" : \"/STAT/912660680/974760673\",\n" +
        "        \"doc_count\" : 1\n" +
        "      }, {\n" +
        "        \"key\" : \"ukjent\",\n" +
        "        \"doc_count\" : 1\n" +
        "      } ]\n" +
        "    }\n" +
        "  }\n" +
        "}";

    @Before
    public void setUp() {
        service = spy(new TermsQueryService());

        client = mock(Client.class);

        service.setClient(client);

        searchResponse = mock(SearchResponse.class);
        when(searchResponse.toString()).thenReturn(dataset);
    }

    @Test
    public void callSearch() {
        doReturn(searchResponse).when(service).doSearch(any(), anyInt(), anyInt());

        service.search("", "", "", 0, 20, "nb");
        service.search("", "", "", 0, 20, "en");
        service.search("enhet", "", "", 0, 20, "nb");
        service.search("", "brreg", "/STAT", 0, 20, "nb");
        service.search("", "Ukjent", "/STAT", 0, 20, "nb");
    }

    @Test
    public void doSearch() {
        QueryBuilder queryBuilder = mock(QueryBuilder.class);
        SearchRequestBuilder searchRequestBuilder = mock(SearchRequestBuilder.class);

        when(client.prepareSearch("scat")).thenReturn(searchRequestBuilder);
        when(searchRequestBuilder.setTypes(anyString())).thenReturn(searchRequestBuilder);
        when(searchRequestBuilder.setQuery(queryBuilder)).thenReturn(searchRequestBuilder);
        when(searchRequestBuilder.setFrom(0)).thenReturn(searchRequestBuilder);
        when(searchRequestBuilder.setSize(20)).thenReturn(searchRequestBuilder);
        when(searchRequestBuilder.addAggregation(any(AggregationBuilder.class))).thenReturn(searchRequestBuilder);

        ListenableActionFuture listenableActionFuture = mock(ListenableActionFuture.class);
        when(searchRequestBuilder.execute()).thenReturn(listenableActionFuture);
        when(listenableActionFuture.actionGet()).thenReturn(searchResponse);


        service.doSearch(queryBuilder, 0, 20);
    }
}
