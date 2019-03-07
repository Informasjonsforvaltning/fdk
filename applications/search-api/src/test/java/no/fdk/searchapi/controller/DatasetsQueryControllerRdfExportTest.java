package no.fdk.searchapi.controller;

import com.google.gson.Gson;
import no.fdk.searchapi.service.ElasticsearchService;
import no.dcat.shared.Dataset;
import no.fdk.test.testcategories.UnitTest;
import org.hamcrest.Matchers;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.experimental.categories.Category;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.mockito.Mockito.mock;


@Category(UnitTest.class)
public class DatasetsQueryControllerRdfExportTest {
    private static Logger logger = LoggerFactory.getLogger(DatasetsQueryControllerRdfExportTest.class);

    String queryReply = " {\n" +
        "        \"id\" : \"http://brreg.no/catalogs/910244132/datasets/f5759687-d1e0-47fd-97eb-647759d0e8f4\",\n" +
        "        \"uri\" : \"http://brreg.no/catalogs/910244132/datasets/f5759687-d1e0-47fd-97eb-647759d0e8f4\",\n" +
        "        \"source\" : \"A\",\n" +
        "        \"title\" : {\n" +
        "          \"nb\" : \"Parfelttest\"\n" +
        "        },\n" +
        "        \"description\" : {\n" +
        "          \"nb\" : \"Test av parfelt uten tittel\"\n" +
        "        },\n" +
        "        \"objective\" : {\n" +
        "          \"nb\" : \"Sjekke at det virker\"\n" +
        "        },\n" +
        "        \"contactPoint\" : [ {\n" +
        "          \"uri\" : \"http://registration-api:8080/catalogs/5e1638e9-3a7a-4031-a554-b6c752fce1fb\",\n" +
        "          \"email\" : \"epost@epost.no\",\n" +
        "          \"organizationUnit\" : \"Parfelttestavdelingen\",\n" +
        "          \"hasURL\" : \"http://registration-api:8080/catalogs/hvorblirdenneav\",\n" +
        "          \"hasTelephone\" : \"11111111\"\n" +
        "        } ],\n" +
        "        \"keyword\" : [ {\n" +
        "          \"nb\" : \"en\"\n" +
        "        }, {\n" +
        "          \"nb\" : \"to\"\n" +
        "        }, {\n" +
        "          \"nb\" : \"fire\"\n" +
        "        }, {\n" +
        "          \"nb\" : \"tre\"\n" +
        "        } ],\n" +
        "        \"publisher\" : {\n" +
        "          \"id\" : \"http://data.brreg.no/enhetsregisteret/enhet/910244132.json\",\n" +
        "          \"name\" : \"RAMSUND OG ROGNAN REVISJON\"\n" +
        "        },\n" +
        "        \"issued\" : \"2017-10-31T01:00:00+01\",\n" +
        "        \"modified\" : \"2017-10-31T00:00:00+01\",\n" +
        "        \"language\" : [ {\n" +
        "          \"uri\" : \"http://publications.europa.eu/resource/authority/language/NOR\",\n" +
        "          \"code\" : \"NOR\",\n" +
        "          \"prefLabel\" : {\n" +
        "            \"nb\" : \"Norsk\",\n" +
        "            \"nn\" : \"Norsk\",\n" +
        "            \"no\" : \"Norsk\",\n" +
        "            \"en\" : \"Norwegian\"\n" +
        "          }\n" +
        "        } ],\n" +
        "        \"landingPage\" : [ \"http://www.merinfo.no\" ],\n" +
        "        \"theme\" : [ {\n" +
        "          \"id\" : \"http://publications.europa.eu/resource/authority/data-theme/HEAL\",\n" +
        "          \"code\" : \"HEAL\",\n" +
        "          \"startUse\" : \"2015-10-01\",\n" +
        "          \"title\" : {\n" +
        "            \"es\" : \"Salud\",\n" +
        "            \"cs\" : \"Zdraví\",\n" +
        "            \"fr\" : \"Santé\",\n" +
        "            \"et\" : \"Tervis\",\n" +
        "            \"de\" : \"Gesundheit\",\n" +
        "            \"da\" : \"Sundhed\",\n" +
        "            \"bg\" : \"Здраве\",\n" +
        "            \"hu\" : \"Egészségügy\",\n" +
        "            \"el\" : \"Υγεία\",\n" +
        "            \"sv\" : \"Hälsa\",\n" +
        "            \"pl\" : \"Zdrowie\",\n" +
        "            \"pt\" : \"Saúde\",\n" +
        "            \"sl\" : \"Zdravje\",\n" +
        "            \"ga\" : \"Sláinte\",\n" +
        "            \"nb\" : \"Helse\",\n" +
        "            \"sk\" : \"Zdravotníctvo\",\n" +
        "            \"fi\" : \"Terveys\",\n" +
        "            \"lt\" : \"Sveikata\",\n" +
        "            \"en\" : \"Health\",\n" +
        "            \"it\" : \"Salute\",\n" +
        "            \"hr\" : \"Zdravlje\",\n" +
        "            \"lv\" : \"Veselība\",\n" +
        "            \"mt\" : \"Saħħa\",\n" +
        "            \"nl\" : \"Gezondheid\",\n" +
        "            \"ro\" : \"Sănătate\"\n" +
        "          },\n" +
        "          \"conceptSchema\" : {\n" +
        "            \"id\" : \"http://publications.europa.eu/resource/authority/data-theme\",\n" +
        "            \"title\" : {\n" +
        "              \"en\" : \"Dataset types Named Authority List\"\n" +
        "            },\n" +
        "            \"versioninfo\" : \"20160921-0\",\n" +
        "            \"versionnumber\" : \"20160921-0\"\n" +
        "          }\n" +
        "        }, {\n" +
        "          \"id\" : \"http://publications.europa.eu/resource/authority/data-theme/INTR\",\n" +
        "          \"code\" : \"INTR\",\n" +
        "          \"startUse\" : \"2015-10-01\",\n" +
        "          \"title\" : {\n" +
        "            \"sv\" : \"Internationella frågor\",\n" +
        "            \"es\" : \"Asuntos internacionales\",\n" +
        "            \"sk\" : \"Medzinárodné otázky\",\n" +
        "            \"de\" : \"Internationale Themen\",\n" +
        "            \"en\" : \"International issues\",\n" +
        "            \"sl\" : \"Mednarodna vprašanja\",\n" +
        "            \"ga\" : \"Saincheisteanna idirnáisiúnta\",\n" +
        "            \"el\" : \"Διεθνή θέματα\",\n" +
        "            \"et\" : \"Rahvusvahelised küsimused\",\n" +
        "            \"nl\" : \"Internationale vraagstukken\",\n" +
        "            \"hu\" : \"Nemzetközi ügyek\",\n" +
        "            \"fi\" : \"Kansainväliset kysymykset\",\n" +
        "            \"pt\" : \"Questões internacionais\",\n" +
        "            \"fr\" : \"Questions internationales\",\n" +
        "            \"pl\" : \"Kwestie międzynarodowe\",\n" +
        "            \"lt\" : \"Tarptautiniai klausimai\",\n" +
        "            \"nb\" : \"Internasjonale temaer\",\n" +
        "            \"cs\" : \"Mezinárodní otázky\",\n" +
        "            \"lv\" : \"Starptautiski jautājumi\",\n" +
        "            \"it\" : \"Tematiche internazionali\",\n" +
        "            \"da\" : \"Internationale spørgsmål\",\n" +
        "            \"ro\" : \"Chestiuni internaționale\",\n" +
        "            \"mt\" : \"Kwistjonijiet internazzjonali\",\n" +
        "            \"hr\" : \"Međunarodni pitanja\",\n" +
        "            \"bg\" : \"Международни въпроси\"\n" +
        "          },\n" +
        "          \"conceptSchema\" : {\n" +
        "            \"id\" : \"http://publications.europa.eu/resource/authority/data-theme\",\n" +
        "            \"title\" : {\n" +
        "              \"en\" : \"Dataset types Named Authority List\"\n" +
        "            },\n" +
        "            \"versioninfo\" : \"20160921-0\",\n" +
        "            \"versionnumber\" : \"20160921-0\"\n" +
        "          }\n" +
        "        } ],\n" +
        "        \"distribution\" : [ {\n" +
        "          \"uri\" : \"http://registration-api:8080/catalogs/b145f267-a06b-46b5-aa77-a54e0aff861c\",\n" +
        "          \"accessURL\" : [ \"http://registration-api:8080/catalogs/tilgang\" ],\n" +
        "          \"conformsTo\" : [ {\n" +
        "            \"uri\" : \"lenke\",\n" +
        "            \"extraType\" : \"http://purl.org/dc/terms/Standard\"\n" +
        "          } ],\n" +
        "          \"format\" : [ \"format\" ],\n" +
        "          \"type\" : \"Nedlastbar fil\"\n" +
        "        } ],\n" +
        "        \"temporal\" : [ {\n" +
        "          \"startDate\" : \"2017-10-31T00:00:00+01\"\n" +
        "        } ],\n" +
        "        \"accessRights\" : {\n" +
        "          \"uri\" : \"http://publications.europa.eu/resource/authority/access-right/RESTRICTED\",\n" +
        "          \"code\" : \"RESTRICTED\",\n" +
        "          \"prefLabel\" : {\n" +
        "            \"nb\" : \"Begrenset\",\n" +
        "            \"nn\" : \"Begrenset\",\n" +
        "            \"en\" : \"Restricted\"\n" +
        "          }\n" +
        "        },\n" +
        "        \"legalBasisForRestriction\" : [ {\n" +
        "          \"uri\" : \"lenke\",\n" +
        "          \"prefLabel\" : {\n" +
        "            \"nb\" : \"Skjermes\"\n" +
        "          },\n" +
        "          \"extraType\" : \"http://purl.org/dc/terms/RightsStatement\"\n" +
        "        } ],\n" +
        "        \"legalBasisForProcessing\" : [ {\n" +
        "          \"uri\" : \"lenke\",\n" +
        "          \"extraType\" : \"http://purl.org/dc/terms/RightsStatement\"\n" +
        "        } ],\n" +
        "        \"hasAccuracyAnnotation\" : {\n" +
        "          \"inDimension\" : \"iso:Accuracy\",\n" +
        "          \"hasBody\" : {\n" +
        "            \"no\" : \"ikke nøyaktig\"\n" +
        "          }\n" +
        "        },\n" +
        "        \"hasCompletenessAnnotation\" : {\n" +
        "          \"inDimension\" : \"iso:Completeness\",\n" +
        "          \"hasBody\" : {\n" +
        "            \"no\" : \"ikke komplett\"\n" +
        "          }\n" +
        "        },\n" +
        "        \"hasCurrentnessAnnotation\" : {\n" +
        "          \"inDimension\" : \"iso:Currentness\",\n" +
        "          \"hasBody\" : {\n" +
        "            \"no\" : \"ikke aktuelt\"\n" +
        "          }\n" +
        "        },\n" +
        "        \"hasAvailabilityAnnotation\" : {\n" +
        "          \"inDimension\" : \"iso:Availability\",\n" +
        "          \"hasBody\" : {\n" +
        "            \"no\" : \"ikke tilgjengelig\"\n" +
        "          }\n" +
        "        },\n" +
        "        \"hasRelevanceAnnotation\" : {\n" +
        "          \"inDimension\" : \"iso:Relevance\",\n" +
        "          \"hasBody\" : {\n" +
        "            \"no\" : \"ikke relevant\"\n" +
        "          }\n" +
        "        },\n" +
        "        \"provenance\" : {\n" +
        "          \"uri\" : \"http://data.brreg.no/datakatalog/provinens/bruker\",\n" +
        "          \"code\" : \"BRUKER\",\n" +
        "          \"prefLabel\" : {\n" +
        "            \"nb\" : \"Brukerinnsamlede data\",\n" +
        "            \"nn\" : \"Brukerinnsamlede data\",\n" +
        "            \"en\" : \"User collection\"\n" +
        "          }\n" +
        "        },\n" +
        "        \"accrualPeriodicity\" : {\n" +
        "          \"uri\" : \"http://publications.europa.eu/resource/authority/frequency/ANNUAL_2\",\n" +
        "          \"code\" : \"ANNUAL_2\",\n" +
        "          \"prefLabel\" : {\n" +
        "            \"sk\" : \"polročný\",\n" +
        "            \"da\" : \"halvårligt\",\n" +
        "            \"fi\" : \"puolivuotinen\",\n" +
        "            \"fr\" : \"semestriel\",\n" +
        "            \"sv\" : \"halvårs\",\n" +
        "            \"cs\" : \"pololetní\",\n" +
        "            \"pl\" : \"półroczny\",\n" +
        "            \"sl\" : \"polletni\",\n" +
        "            \"hr\" : \"polugodišnje\",\n" +
        "            \"ga\" : \"leathbhliantúil\",\n" +
        "            \"el\" : \"εξαμηνιαίος\",\n" +
        "            \"hu\" : \"félévenkénti\",\n" +
        "            \"pt\" : \"semianual\",\n" +
        "            \"mt\" : \"kull sitt xhur\",\n" +
        "            \"it\" : \"semestrale\",\n" +
        "            \"no\" : \"halvårlig\",\n" +
        "            \"en\" : \"semiannual\",\n" +
        "            \"lv\" : \"reizi pusgadā\",\n" +
        "            \"et\" : \"pooleaastane\",\n" +
        "            \"ro\" : \"semestrial\",\n" +
        "            \"bg\" : \"два пъти на година\",\n" +
        "            \"es\" : \"semestral\",\n" +
        "            \"de\" : \"halbjährlich\",\n" +
        "            \"nl\" : \"halfjaarlĳks\",\n" +
        "            \"lt\" : \"kas pusę metų\"\n" +
        "          }\n" +
        "        },\n" +
        "        \"conformsTo\" : [ {\n" +
        "          \"uri\" : \"lenke\",\n" +
        "          \"prefLabel\" : {\n" +
        "            \"nb\" : \"Ikke en standard\"\n" +
        "          },\n" +
        "          \"extraType\" : \"http://purl.org/dc/terms/Standard\"\n" +
        "        } ],\n" +
        "        \"type\" : \"Taksonomi\",\n" +
        "        \"catalog\" : {\n" +
        "          \"id\" : \"http://brreg.no/catalogs/910244132\",\n" +
        "          \"title\" : {\n" +
        "            \"nb\" : \"Datakatalog for RAMSUND OG ROGNAN REVISJON\"\n" +
        "          },\n" +
        "          \"description\" : {\n" +
        "            \"nb\" : \"Dette er en helt ny datakatalog \"\n" +
        "          },\n" +
        "          \"publisher\" : {\n" +
        "            \"id\" : \"http://data.brreg.no/enhetsregisteret/enhet/910244132.json\",\n" +
        "            \"name\" : \"RAMSUND OG ROGNAN REVISJON\"\n" +
        "          }\n" +
        "        }\n" +
        "      }";

    private DatasetsQueryController queryService;

    @Before
    public void mockQuery() {

        ElasticsearchService elasticsearchServiceMock = mock(ElasticsearchService.class);
        queryService = new DatasetsQueryController(elasticsearchServiceMock);
    }

    @Test
    public void testRdfResponse4Turtle() throws Throwable {

        Dataset dataset = new Gson().fromJson(queryReply, Dataset.class);

        ResponseEntity<String> actual = queryService.transformResponse(dataset, "text/turtle");

        Assert.assertThat(actual.getStatusCode(), Matchers.is(HttpStatus.OK));

        Assert.assertThat(actual.getBody(), Matchers.is(Matchers.startsWith("@prefix")));

    }

    @Test
    public void testRdfResponse4RDFXML() throws Throwable {
        Dataset dataset = new Gson().fromJson(queryReply, Dataset.class);

        ResponseEntity<String> actual = queryService.transformResponse(dataset, "application/rdf+xml");

        Assert.assertThat(actual.getStatusCode(), Matchers.is(HttpStatus.OK));

        Assert.assertThat(actual.getBody(), Matchers.is(Matchers.startsWith("<rdf:RDF")));
    }


    @Test
    public void testRdfResponse4JSONLD() throws Throwable {
        Dataset dataset = new Gson().fromJson(queryReply, Dataset.class);

        ResponseEntity<String> actual = queryService.transformResponse(dataset, "application/ld+json");

        Assert.assertThat(actual.getStatusCode(), Matchers.is(HttpStatus.OK));

        //logger.info(actual.getBody());
        Assert.assertThat(actual.getBody(), Matchers.is(Matchers.startsWith("{")));
    }

}

