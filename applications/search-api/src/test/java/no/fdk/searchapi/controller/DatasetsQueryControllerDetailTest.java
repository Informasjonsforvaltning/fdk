package no.fdk.searchapi.controller;

import no.fdk.searchapi.service.ElasticsearchService;
import no.fdk.searchapi.ServletRequest;
import no.dcat.shared.Dataset;
import no.fdk.test.testcategories.UnitTest;
import no.fdk.webutils.exceptions.NotFoundException;
import org.elasticsearch.action.ListenableActionFuture;
import org.elasticsearch.action.search.SearchRequestBuilder;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.client.Client;
import org.elasticsearch.search.SearchHit;
import org.elasticsearch.search.SearchHits;
import org.junit.Before;
import org.junit.Test;
import org.junit.experimental.categories.Category;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import javax.servlet.http.HttpServletRequestWrapper;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Class for testing getDatasetByIdHandler rest-API in DatasetsQueryService.
 */
@Category(UnitTest.class)
public class DatasetsQueryControllerDetailTest {
    DatasetsQueryController sqs;
    Client client;
    SearchResponse response;
    String dataset = "{\n" +
        "                    \"id\": \"59d42d56-9769-4de8-8f19-df6e97c68476\",\n" +
        "                    \"uri\": \"http://brreg.no/catalogs/974761076/datasets/12183f89-33e1-4036-ba61-f399eddfbe42\",\n" +
        "                    \"source\": \"A\",\n" +
        "                    \"title\": {\n" +
        "                        \"nb\": \"Innrapportert inntekt\"\n" +
        "                    },\n" +
        "                    \"description\": {\n" +
        "                        \"nb\": \"Informasjon om innrapportert inntekt\"\n" +
        "                    },\n" +
        "                    \"descriptionFormatted\": {\n" +
        "                        \"nb\": \"Informasjon om innrapportert inntekt\"\n" +
        "                    },\n" +
        "                    \"contactPoint\": [],\n" +
        "                    \"keyword\": [\n" +
        "                        {\n" +
        "                            \"nb\": \"inntekt\"\n" +
        "                        },\n" +
        "                        {\n" +
        "                            \"nb\": \"gjeld og fradrag\"\n" +
        "                        },\n" +
        "                        {\n" +
        "                            \"nb\": \"grunnlagsdata\"\n" +
        "                        },\n" +
        "                        {\n" +
        "                            \"nb\": \"formue\"\n" +
        "                        }\n" +
        "                    ],\n" +
        "                    \"publisher\": {\n" +
        "                        \"overordnetEnhet\": \"972417807\",\n" +
        "                        \"organisasjonsform\": \"ORGL\",\n" +
        "                        \"naeringskode\": {\n" +
        "                            \"uri\": \"http://www.ssb.no/nace/sn2007/84.110\",\n" +
        "                            \"code\": \"84.110\",\n" +
        "                            \"prefLabel\": {\n" +
        "                                \"no\": \"Generell offentlig administrasjon\"\n" +
        "                            }\n" +
        "                        },\n" +
        "                        \"sektorkode\": {\n" +
        "                            \"uri\": \"http://www.brreg.no/sektorkode/6100\",\n" +
        "                            \"code\": \"6100\",\n" +
        "                            \"prefLabel\": {\n" +
        "                                \"no\": \"Statsforvaltningen\"\n" +
        "                            }\n" +
        "                        },\n" +
        "                        \"valid\": true,\n" +
        "                        \"uri\": \"http://data.brreg.no/enhetsregisteret/enhet/974761076\",\n" +
        "                        \"id\": \"974761076\",\n" +
        "                        \"name\": \"SKATTEETATEN\",\n" +
        "                        \"orgPath\": \"/STAT/972417807/974761076\"\n" +
        "                    },\n" +
        "                    \"language\": [\n" +
        "                        {\n" +
        "                            \"uri\": \"http://publications.europa.eu/resource/authority/language/NOR\",\n" +
        "                            \"code\": \"NOR\",\n" +
        "                            \"prefLabel\": {\n" +
        "                                \"nb\": \"Norsk\",\n" +
        "                                \"nn\": \"Norsk\",\n" +
        "                                \"no\": \"Norsk\",\n" +
        "                                \"en\": \"Norwegian\"\n" +
        "                            }\n" +
        "                        }\n" +
        "                    ],\n" +
        "                    \"landingPage\": [\n" +
        "                        \"https://skatteetaten.github.io/datasamarbeid-api-dokumentasjon/index.html\"\n" +
        "                    ],\n" +
        "                    \"theme\": [\n" +
        "                        {\n" +
        "                            \"id\": \"http://publications.europa.eu/resource/authority/data-theme/GOVE\",\n" +
        "                            \"code\": \"GOVE\",\n" +
        "                            \"startUse\": \"2015-10-01\",\n" +
        "                            \"title\": {\n" +
        "                                \"it\": \"Governo e settore pubblico\",\n" +
        "                                \"nb\": \"Forvaltning og offentlig sektor\",\n" +
        "                                \"en\": \"Government and public sector\",\n" +
        "                                \"hr\": \"Vlada i javni sektor\",\n" +
        "                                \"es\": \"Gobierno y sector público\",\n" +
        "                                \"de\": \"Regierung und öffentlicher Sektor\",\n" +
        "                                \"sk\": \"Vláda a verejný sektor\",\n" +
        "                                \"ro\": \"Guvern şi sector public\",\n" +
        "                                \"bg\": \"Правителство и публичен сектор\",\n" +
        "                                \"et\": \"Valitsus ja avalik sektor\",\n" +
        "                                \"el\": \"Κυβέρνηση και δημόσιος τομέας\",\n" +
        "                                \"pl\": \"Rząd i sektor publiczny\",\n" +
        "                                \"cs\": \"Vláda a veřejný sektor\",\n" +
        "                                \"ga\": \"Rialtas agus earnáil phoiblí\",\n" +
        "                                \"pt\": \"Governo e setor público\",\n" +
        "                                \"lt\": \"Vyriausybė ir viešasis sektorius\",\n" +
        "                                \"lv\": \"Valdība un sabiedriskais sektors\",\n" +
        "                                \"mt\": \"Gvern u settur pubbliku\",\n" +
        "                                \"hu\": \"Kormányzat és közszféra\",\n" +
        "                                \"da\": \"Regeringen og den offentlige sektor\",\n" +
        "                                \"fi\": \"Valtioneuvosto ja julkinen sektori\",\n" +
        "                                \"fr\": \"Gouvernement et secteur public\",\n" +
        "                                \"sl\": \"Vlada in javni sektor\",\n" +
        "                                \"sv\": \"Regeringen och den offentliga sektorn\",\n" +
        "                                \"nl\": \"Overheid en publieke sector\"\n" +
        "                            },\n" +
        "                            \"conceptSchema\": {\n" +
        "                                \"id\": \"http://publications.europa.eu/resource/authority/data-theme\",\n" +
        "                                \"title\": {\n" +
        "                                    \"en\": \"Dataset types Named Authority List\"\n" +
        "                                },\n" +
        "                                \"versioninfo\": \"20160921-0\",\n" +
        "                                \"versionnumber\": \"20160921-0\"\n" +
        "                            }\n" +
        "                        }\n" +
        "                    ],\n" +
        "                    \"distribution\": [\n" +
        "                        {\n" +
        "                            \"uri\": \"http://data.brreg.no/datakatalog/distribusjon/26\",\n" +
        "                            \"description\": {\n" +
        "                                \"nb\": \"Innrapportert inntekt Skatteetaten\"\n" +
        "                            },\n" +
        "                            \"downloadURL\": [],\n" +
        "                            \"accessURL\": [\n" +
        "                                \"https://api.skatteetaten.no/api/innrapportert/inntektsmottaker/personidentifikator/oppgave/inntekt?fraOgMed=YYYY-MM&tilOgMed=YYYY-MM\"\n" +
        "                            ],\n" +
        "                            \"format\": [\n" +
        "                                \"application/xml, application/json\"\n" +
        "                            ],\n" +
        "                            \"type\": \"API\"\n" +
        "                        }\n" +
        "                    ],\n" +
        "                    \"accessRights\": {\n" +
        "                        \"uri\": \"http://publications.europa.eu/resource/authority/access-right/RESTRICTED\",\n" +
        "                        \"code\": \"RESTRICTED\",\n" +
        "                        \"prefLabel\": {\n" +
        "                            \"nb\": \"Begrenset\",\n" +
        "                            \"nn\": \"Begrenset\",\n" +
        "                            \"en\": \"Restricted\"\n" +
        "                        }\n" +
        "                    },\n" +
        "                    \"identifier\": [\n" +
        "                        \"63\"\n" +
        "                    ],\n" +
        "                    \"accrualPeriodicity\": {\n" +
        "                        \"uri\": \"http://publications.europa.eu/resource/authority/frequency/CONT\",\n" +
        "                        \"code\": \"CONT\",\n" +
        "                        \"prefLabel\": {\n" +
        "                            \"lt\": \"nenutrūkstamas\",\n" +
        "                            \"ga\": \"leanúnach\",\n" +
        "                            \"it\": \"continuo\",\n" +
        "                            \"es\": \"continuo\",\n" +
        "                            \"hu\": \"folyamatos\",\n" +
        "                            \"sk\": \"priebežný\",\n" +
        "                            \"bg\": \"постоянен\",\n" +
        "                            \"fi\": \"jatkuva\",\n" +
        "                            \"da\": \"kontinuerligt\",\n" +
        "                            \"de\": \"kontinuierlich\",\n" +
        "                            \"pl\": \"ciągły\",\n" +
        "                            \"lv\": \"pastāvīgi\",\n" +
        "                            \"cs\": \"průběžný\",\n" +
        "                            \"mt\": \"kontinwu\",\n" +
        "                            \"nl\": \"voortdurend\",\n" +
        "                            \"fr\": \"continuel\",\n" +
        "                            \"ro\": \"continuu\",\n" +
        "                            \"en\": \"continuous\",\n" +
        "                            \"hr\": \"stalan\",\n" +
        "                            \"sl\": \"nenehen\",\n" +
        "                            \"el\": \"συνεχής\",\n" +
        "                            \"no\": \"kontinuerlig\",\n" +
        "                            \"sv\": \"kontinuerlig\",\n" +
        "                            \"et\": \"pidev\",\n" +
        "                            \"pt\": \"contínuo\"\n" +
        "                        }\n" +
        "                    },\n" +
        "                    \"catalog\": {\n" +
        "                        \"id\": \"974761076\",\n" +
        "                        \"uri\": \"http://brreg.no/catalogs/974761076\",\n" +
        "                        \"title\": {\n" +
        "                            \"nb\": \"Datakatalog for SKATTEETATEN\"\n" +
        "                        },\n" +
        "                        \"publisher\": {\n" +
        "                            \"overordnetEnhet\": \"972417807\",\n" +
        "                            \"organisasjonsform\": \"ORGL\",\n" +
        "                            \"naeringskode\": {\n" +
        "                                \"uri\": \"http://www.ssb.no/nace/sn2007/84.110\",\n" +
        "                                \"code\": \"84.110\",\n" +
        "                                \"prefLabel\": {\n" +
        "                                    \"no\": \"Generell offentlig administrasjon\"\n" +
        "                                }\n" +
        "                            },\n" +
        "                            \"sektorkode\": {\n" +
        "                                \"uri\": \"http://www.brreg.no/sektorkode/6100\",\n" +
        "                                \"code\": \"6100\",\n" +
        "                                \"prefLabel\": {\n" +
        "                                    \"no\": \"Statsforvaltningen\"\n" +
        "                                }\n" +
        "                            },\n" +
        "                            \"valid\": true,\n" +
        "                            \"uri\": \"http://data.brreg.no/enhetsregisteret/enhet/974761076\",\n" +
        "                            \"id\": \"974761076\",\n" +
        "                            \"name\": \"SKATTEETATEN\",\n" +
        "                            \"orgPath\": \"/STAT/972417807/974761076\"\n" +
        "                        }\n" +
        "                    }\n" +
        "                }";

    ElasticsearchService elasticsearchServiceMock = mock(ElasticsearchService.class);

    @Before
    public void setUp() {
        client = mock(Client.class);
        populateMock();
        when(elasticsearchServiceMock.getClient()).thenReturn(client);
        sqs = new DatasetsQueryController(elasticsearchServiceMock);
    }

    /**
     * Tests when dataset is found.
     */
    @Test
    public void testWithHits() throws NotFoundException {
        DatasetsQueryController spyController = spy(new DatasetsQueryController(elasticsearchServiceMock));
        doReturn(new Dataset()).when(spyController).getDatasetById(anyString());

        ResponseEntity<String> actual = spyController.getDatasetByIdHandler(new ServletRequest("29"), "29");
        assertThat(actual.getStatusCodeValue()).isEqualTo(HttpStatus.OK.value());
    }

    /**
     * Tests when dataset is not found.
     */
    @Test(expected = NotFoundException.class)
    public void testWithNoHits() throws NotFoundException {
        DatasetsQueryController spyController = spy(new DatasetsQueryController(elasticsearchServiceMock));
        doReturn(null).when(spyController).getDatasetById(anyString());

        spyController.getDatasetByIdHandler(new ServletRequest("29"), "29");
    }

    @Test
    public void testGetNullRDFresponse() {
        sqs.transformResponse(null, "application/rdf+xml");
        sqs.transformResponse(null, "text/html");
    }

    @Test
    public void correctAcceptheader() throws NotFoundException {
        DatasetsQueryController spyController = spy(new DatasetsQueryController(elasticsearchServiceMock));
        doReturn(new Dataset()).when(spyController).getDatasetById(anyString());

        HttpServletRequestWrapper request = new HttpServletRequestWrapper(new ServletRequest("/details/path")) {
            @Override
            public String getHeader(String name) {
                if ("Accept".equals(name)) {
                    return "text/turtle";
                }
                return super.getHeader(name);
            }
        };

        ResponseEntity<String> actual = spyController.getDatasetByIdHandler(request, "id");
        assertThat(actual.getHeaders().getContentType().toString()).isEqualTo("text/turtle");
    }

    private void populateMock() {
        String id = "29";

        SearchHit[] hits = null;
        SearchHit hit = mock(SearchHit.class);
        SearchHit hit2 = mock(SearchHit.class);


        SearchHits searchHits = mock(SearchHits.class);
        when(searchHits.getHits()).thenReturn(hits);

        when(searchHits.getAt(0)).thenReturn(hit2);
        when(hit2.getSourceAsString()).thenReturn(dataset);

        response = mock(SearchResponse.class);
        when(response.getHits()).thenReturn(searchHits);
        when(response.getHits().getHits()).thenReturn(new SearchHit[]{hit});
        when(hit.getSourceAsString()).thenReturn("Id");

        when(response.getHits().getTotalHits()).thenReturn((long) 1);

        ListenableActionFuture<SearchResponse> action = mock(ListenableActionFuture.class);
        when(action.actionGet()).thenReturn(response);

        SearchRequestBuilder builder = mock(SearchRequestBuilder.class);
        when(builder.setQuery(any())).thenReturn(builder);
        when(builder.execute()).thenReturn(action);

        when(client.prepareSearch("dcat")).thenReturn(builder);
    }
}
