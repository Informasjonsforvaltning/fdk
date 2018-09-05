package no.acat.restapi;

import no.acat.model.queryresponse.QueryResponse;
import no.acat.service.ElasticsearchService;
import no.dcat.shared.testcategories.UnitTest;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.search.SearchHit;
import org.elasticsearch.search.SearchHits;
import org.junit.Test;
import org.junit.experimental.categories.Category;
import org.junit.runner.RunWith;
import org.springframework.test.context.junit4.SpringRunner;

import static org.hamcrest.Matchers.notNullValue;
import static org.junit.Assert.assertThat;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.anyInt;
import static org.mockito.Mockito.anyString;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.spy;
import static org.mockito.Mockito.when;

@Category(UnitTest.class)
@RunWith(SpringRunner.class)
public class SearchControllerTest {

@Test
    public void checkOne() {
        // todo meaningful test would be to allow elastic client to build a query and process sample response,
        // instead of mocking entire elastic client here
        ElasticsearchService elasticsearchService = mock(ElasticsearchService.class);
        SearchController controller = new SearchController(elasticsearchService);
        SearchController spyController = spy(controller);

        SearchHit hit = mock(SearchHit.class);
        SearchHit[] hits = { hit };

        SearchHits searchHits = mock(SearchHits.class);
        when(searchHits.getTotalHits()).thenReturn(1L);
        when(searchHits.getHits()).thenReturn(hits);

        SearchResponse searchResponse = mock(SearchResponse.class);
        when(searchResponse.getHits()).thenReturn(searchHits);

        doReturn(null).when(spyController).buildSearchRequest(anyString(),anyString(),anyInt(),anyInt());
        doReturn(searchResponse).when(spyController).doQuery(any());

        // todo this is nonsense, we do not test anything
        doReturn(new QueryResponse()).when(spyController).convertFromElasticResponse(any());

        when(hit.getSourceAsString()).thenReturn(apiSpecExample);
        when(hit.getId()).thenReturn("http://testtesttset");

        QueryResponse response = spyController.search("","","","",0,0);

        assertThat(response, notNullValue());

    }

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

}
