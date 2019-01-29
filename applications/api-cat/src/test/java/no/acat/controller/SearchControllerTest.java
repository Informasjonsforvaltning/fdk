package no.acat.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import no.acat.model.ApiDocument;
import no.acat.model.queryresponse.QueryResponse;
import no.acat.service.ElasticsearchService;
import no.acat.utils.Utils;
import no.dcat.shared.testcategories.UnitTest;
import org.elasticsearch.action.search.SearchRequestBuilder;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.search.SearchHit;
import org.elasticsearch.search.SearchHits;
import org.elasticsearch.search.sort.FieldSortBuilder;
import org.elasticsearch.search.sort.SortBuilders;
import org.elasticsearch.search.sort.SortOrder;
import org.junit.Test;
import org.junit.experimental.categories.Category;
import org.junit.runner.RunWith;
import org.springframework.data.domain.PageRequest;
import org.springframework.test.context.junit4.SpringRunner;

import java.io.IOException;

import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.notNullValue;
import static org.junit.Assert.assertThat;
import static org.mockito.Mockito.*;

@Category(UnitTest.class)
@RunWith(SpringRunner.class)
public class SearchControllerTest {

    private String apiSpecExample = "{\"openapi\": \"3.0.1\",\n" +
        "            \"info\": {\n" +
        "                \"description\": \"Tilbyr et utvalg av opplysninger om alle registrerte enheter i Enhetsregisteret\",\n" +
        "                \"version\": \"0.1\",\n" +
        "                \"title\": \"Åpne data - Enhetsregisteret\",\n" +
        "                \"termsOfService\": \"https://fellesdatakatalog.brreg.no/about\",\n" +
        "                \"contact\": {\n" +
        "                    \"name\": \"Brønnøysundregistrene\",\n" +
        "                    \"url\": \"http://www.brreg.no\",\n" +
        "                    \"email\": \"opendata@brreg.no\"\n" +
        "                },\n" +
        "                \"license\": {\n" +
        "                    \"name\": \"Norsk lisens for offentlige data (NLOD) 2.0\",\n" +
        "                    \"url\": \"http://data.norge.no/nlod/no/2.0\"\n" +
        "                }\n" +
        "            },\n" +
        "            \"servers\": [\n" +
        "                {\n" +
        "                    \"url\": \"https://data.brreg.no/enhetsregisteret/api\",\n" +
        "                    \"description\": \"Produksjonsserver\"\n" +
        "                }\n" +
        "            ],\n" +
        "            \"paths\": {\n" +
        "                \"pathItems\": {\n" +
        "                    \"/organisasjonsformer/underenheter\": {\n" +
        "                        \"get\": {\n" +
        "                            \"description\": \"Hent alle organisasjonsformer for underenheter\",\n" +
        "                            \"responses\": {\n" +
        "                                \"200\": {\n" +
        "                                    \"description\": \"En liste med organisasjonsformer\"\n" +
        "                                }\n" +
        "                            }\n" +
        "                        }\n" +
        "                    },\n" +
        "                    \"/organisasjonsformer/enheter\": {\n" +
        "                        \"get\": {\n" +
        "                            \"description\": \"Hent alle organisasjonsformer for enheter\",\n" +
        "                            \"responses\": {\n" +
        "                                \"200\": {\n" +
        "                                    \"description\": \"En liste med organisasjonsformer\"\n" +
        "                                }\n" +
        "                            }\n" +
        "                        }\n" +
        "                    },\n" +
        "                    \"/underenheter/{orgnr}\": {\n" +
        "                        \"get\": {\n" +
        "                            \"description\": \"Hent en spesifikk underenhet\",\n" +
        "                            \"responses\": {\n" +
        "                                \"200\": {\n" +
        "                                    \"description\": \"En underenhete\"\n" +
        "                                }\n" +
        "                            }\n" +
        "                        }\n" +
        "                    },\n" +
        "                    \"/enheter\": {\n" +
        "                        \"get\": {\n" +
        "                            \"description\": \"Søk etter enheter\",\n" +
        "                            \"responses\": {\n" +
        "                                \"200\": {\n" +
        "                                    \"description\": \"En liste med enheter\"\n" +
        "                                }\n" +
        "                            }\n" +
        "                        }\n" +
        "                    },\n" +
        "                    \"/enheter/lastned\": {\n" +
        "                        \"get\": {\n" +
        "                            \"description\": \"Last ned enheter\",\n" +
        "                            \"responses\": {\n" +
        "                                \"200\": {\n" +
        "                                    \"description\": \"Zip-fil lastes ned\"\n" +
        "                                }\n" +
        "                            }\n" +
        "                        }\n" +
        "                    },\n" +
        "                    \"/underenheter/lastned\": {\n" +
        "                        \"get\": {\n" +
        "                            \"description\": \"Last ned underenheter\",\n" +
        "                            \"responses\": {\n" +
        "                                \"200\": {\n" +
        "                                    \"description\": \"En liste med underenheter\"\n" +
        "                                }\n" +
        "                            }\n" +
        "                        }\n" +
        "                    },\n" +
        "                    \"/organisasjonsformer/{orgkode}\": {\n" +
        "                        \"get\": {\n" +
        "                            \"description\": \"Hent en gitt organisasjonsform\",\n" +
        "                            \"responses\": {\n" +
        "                                \"200\": {\n" +
        "                                    \"description\": \"Beskrivelse av organisasjonsform\"\n" +
        "                                }\n" +
        "                            }\n" +
        "                        }\n" +
        "                    },\n" +
        "                    \"/enheter/{orgnr}\": {\n" +
        "                        \"get\": {\n" +
        "                            \"description\": \"Hent en spesifikk enhet\",\n" +
        "                            \"responses\": {\n" +
        "                                \"200\": {\n" +
        "                                    \"description\": \"En enhet\"\n" +
        "                                }\n" +
        "                            }\n" +
        "                        }\n" +
        "                    },\n" +
        "                    \"/organisasjonsformer\": {\n" +
        "                        \"get\": {\n" +
        "                            \"description\": \"Hent alle organisasjonsformer\",\n" +
        "                            \"responses\": {\n" +
        "                                \"200\": {\n" +
        "                                    \"description\": \"En liste med organisasjonsformer\"\n" +
        "                                }\n" +
        "                            }\n" +
        "                        }\n" +
        "                    },\n" +
        "                    \"/\": {\n" +
        "                        \"get\": {\n" +
        "                            \"description\": \"Rot. lister lenker til øvrige objekter\",\n" +
        "                            \"responses\": {\n" +
        "                                \"200\": {\n" +
        "                                    \"description\": \"En liste med lenker til øvrige tjenester\"\n" +
        "                                }\n" +
        "                            }\n" +
        "                        }\n" +
        "                    },\n" +
        "                    \"/underenheter\": {\n" +
        "                        \"get\": {\n" +
        "                            \"description\": \"Søk etter underenheter\",\n" +
        "                            \"responses\": {\n" +
        "                                \"200\": {\n" +
        "                                    \"description\": \"En liste med underenheter\"\n" +
        "                                }\n" +
        "                            }\n" +
        "                        }\n" +
        "                    }\n" +
        "                },\n" +
        "                \"/organisasjonsformer/underenheter\": {\n" +
        "                    \"get\": {\n" +
        "                        \"description\": \"Hent alle organisasjonsformer for underenheter\",\n" +
        "                        \"responses\": {\n" +
        "                            \"200\": {\n" +
        "                                \"description\": \"En liste med organisasjonsformer\"\n" +
        "                            }\n" +
        "                        }\n" +
        "                    }\n" +
        "                },\n" +
        "                \"/organisasjonsformer/enheter\": {\n" +
        "                    \"get\": {\n" +
        "                        \"description\": \"Hent alle organisasjonsformer for enheter\",\n" +
        "                        \"responses\": {\n" +
        "                            \"200\": {\n" +
        "                                \"description\": \"En liste med organisasjonsformer\"\n" +
        "                            }\n" +
        "                        }\n" +
        "                    }\n" +
        "                },\n" +
        "                \"/underenheter/{orgnr}\": {\n" +
        "                    \"get\": {\n" +
        "                        \"description\": \"Hent en spesifikk underenhet\",\n" +
        "                        \"responses\": {\n" +
        "                            \"200\": {\n" +
        "                                \"description\": \"En underenhete\"\n" +
        "                            }\n" +
        "                        }\n" +
        "                    }\n" +
        "                },\n" +
        "                \"/enheter\": {\n" +
        "                    \"get\": {\n" +
        "                        \"description\": \"Søk etter enheter\",\n" +
        "                        \"responses\": {\n" +
        "                            \"200\": {\n" +
        "                                \"description\": \"En liste med enheter\"\n" +
        "                            }\n" +
        "                        }\n" +
        "                    }\n" +
        "                },\n" +
        "                \"/enheter/lastned\": {\n" +
        "                    \"get\": {\n" +
        "                        \"description\": \"Last ned enheter\",\n" +
        "                        \"responses\": {\n" +
        "                            \"200\": {\n" +
        "                                \"description\": \"Zip-fil lastes ned\"\n" +
        "                            }\n" +
        "                        }\n" +
        "                    }\n" +
        "                },\n" +
        "                \"/underenheter/lastned\": {\n" +
        "                    \"get\": {\n" +
        "                        \"description\": \"Last ned underenheter\",\n" +
        "                        \"responses\": {\n" +
        "                            \"200\": {\n" +
        "                                \"description\": \"En liste med underenheter\"\n" +
        "                            }\n" +
        "                        }\n" +
        "                    }\n" +
        "                },\n" +
        "                \"/organisasjonsformer/{orgkode}\": {\n" +
        "                    \"get\": {\n" +
        "                        \"description\": \"Hent en gitt organisasjonsform\",\n" +
        "                        \"responses\": {\n" +
        "                            \"200\": {\n" +
        "                                \"description\": \"Beskrivelse av organisasjonsform\"\n" +
        "                            }\n" +
        "                        }\n" +
        "                    }\n" +
        "                },\n" +
        "                \"/enheter/{orgnr}\": {\n" +
        "                    \"get\": {\n" +
        "                        \"description\": \"Hent en spesifikk enhet\",\n" +
        "                        \"responses\": {\n" +
        "                            \"200\": {\n" +
        "                                \"description\": \"En enhet\"\n" +
        "                            }\n" +
        "                        }\n" +
        "                    }\n" +
        "                },\n" +
        "                \"/organisasjonsformer\": {\n" +
        "                    \"get\": {\n" +
        "                        \"description\": \"Hent alle organisasjonsformer\",\n" +
        "                        \"responses\": {\n" +
        "                            \"200\": {\n" +
        "                                \"description\": \"En liste med organisasjonsformer\"\n" +
        "                            }\n" +
        "                        }\n" +
        "                    }\n" +
        "                },\n" +
        "                \"/\": {\n" +
        "                    \"get\": {\n" +
        "                        \"description\": \"Rot. lister lenker til øvrige objekter\",\n" +
        "                        \"responses\": {\n" +
        "                            \"200\": {\n" +
        "                                \"description\": \"En liste med lenker til øvrige tjenester\"\n" +
        "                            }\n" +
        "                        }\n" +
        "                    }\n" +
        "                },\n" +
        "                \"/underenheter\": {\n" +
        "                    \"get\": {\n" +
        "                        \"description\": \"Søk etter underenheter\",\n" +
        "                        \"responses\": {\n" +
        "                            \"200\": {\n" +
        "                                \"description\": \"En liste med underenheter\"\n" +
        "                            }\n" +
        "                        }\n" +
        "                    }\n" +
        "                }\n" +
        "            }\n" +
        "        }";

    @Test
    public void checkConvertFromElasticResponse() {

        ElasticsearchService elasticsearchService = mock(ElasticsearchService.class);
        ApiSearchController controller = new ApiSearchController(elasticsearchService, Utils.jsonMapper());
        ApiSearchController spyController = spy(controller);
        SearchResponse searchResponse = mock(SearchResponse.class);

        doNothing().when(spyController).convertHits(any(QueryResponse.class), any(SearchResponse.class));
        doNothing().when(spyController).convertAggregations(any(QueryResponse.class), any(SearchResponse.class));

        doCallRealMethod().when(spyController).convertFromElasticResponse(any(SearchResponse.class));

        QueryResponse convertResponse = spyController.convertFromElasticResponse(searchResponse);

        assertThat(convertResponse, is(notNullValue()));

    }


    @Test
    public void checkConvertHits_ifOK() throws IOException {

        ElasticsearchService elasticsearchService = mock(ElasticsearchService.class);
        ApiSearchController controller = new ApiSearchController(elasticsearchService, Utils.jsonMapper());
        ApiSearchController spyController = spy(controller);

        QueryResponse queryResponse = mock(QueryResponse.class);
        SearchResponse searchResponse = mock(SearchResponse.class);
        SearchHits searchHits = mock(SearchHits.class);
        SearchHit hit = mock(SearchHit.class);
        SearchHit[] hits = {hit};
        ObjectMapper objectMapper = mock(ObjectMapper.class);
        ApiDocument apiDocument = mock(ApiDocument.class);

        when(searchResponse.getHits()).thenReturn(searchHits);
        when(searchHits.getTotalHits()).thenReturn(100L);
        when(searchHits.getHits()).thenReturn(hits);
        when(hit.getSourceAsString()).thenReturn(apiSpecExample);
        when(objectMapper.readValue(hit.getSourceAsString(), ApiDocument.class)).thenReturn(apiDocument);

        doCallRealMethod().when(spyController).convertHits(queryResponse, searchResponse);
        spyController.convertHits(queryResponse, searchResponse);

        verify(spyController, times(1)).convertHits(any(QueryResponse.class), any(SearchResponse.class));

    }

}
