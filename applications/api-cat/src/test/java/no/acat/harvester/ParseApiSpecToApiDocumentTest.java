package no.acat.harvester;


import lombok.extern.slf4j.Slf4j;
import no.acat.model.ApiDocument;
import no.acat.model.ApiSource;
import no.acat.spec.converters.ParseApiSpecToApiDocument;
import no.dcat.shared.testcategories.UnitTest;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.experimental.categories.Category;
import org.junit.runner.RunWith;
import org.springframework.test.context.junit4.SpringRunner;


@RunWith(SpringRunner.class)
@Category(UnitTest.class)
@Slf4j
public class ParseApiSpecToApiDocumentTest {

    private ApiSource apiSource;

    private ParseApiSpecToApiDocument parseApiSpecToApiDocument;

    @Before
    public void setUp(){
        parseApiSpecToApiDocument = new ParseApiSpecToApiDocument();

    }

    @Test
    public void parseApiSpec_From_Url(){
        apiSource = new ApiSource("http://www.barnehagefakta.no/swagger/docs/v1","");
        ApiDocument apiDocument =parseApiSpecToApiDocument.parseApiSpecFromUrl(apiSource);
        Assert.assertNotNull(apiDocument);
        Assert.assertEquals(apiDocument.getTitle().get("no"),"Barnehagefakta");
    }

    @Test
    public  void parseAPIspecification_From_Data(){
        apiSource = new ApiSource("", getData());
        ApiDocument apiDocument =parseApiSpecToApiDocument.parseApiSpecFromUrl(apiSource);
        Assert.assertNotNull(apiDocument);
        Assert.assertEquals(apiDocument.getTitle().get("no"),"Nasjonalt barnehageregister API");
    }

    @Test(expected= NullPointerException.class)
    public void parseApiSpecificationw_with_nullInput(){
        ApiDocument apiDocument =parseApiSpecToApiDocument.parseApiSpecFromUrl(null);
    }


    private String getData( ){

        String testData="{\n" +
                "  \"swagger\": \"2.0\",\n" +
                "  \"info\": {\n" +
                "    \"version\": \"v1.0\",\n" +
                "    \"title\": \"Nasjonalt barnehageregister API\",\n" +
                "    \"contact\": {\n" +
                "      \"name\": \"Natiional barnhager\",\n" +
                "      \"email\": \"fdk.brrge@brreg.no\",\n" +
                "      \"url\": \"http://www.example.com/support\"\n" +
                "    }\n" +
                "  },\n" +
                "  \"host\": \"data-nbr.udir.no\",\n" +
                "  \"schemes\": [\n" +
                "    \"https\"\n" +
                "  ],\n" +
                "  \"paths\": {\n" +
                "    \"/barnehagetyper\": {\n" +
                "      \"get\": {\n" +
                "        \"tags\": [\n" +
                "          \"Barnehagetype\"\n" +
                "        ],\n" +
                "        \"summary\": \"Alle barnehagetyper\",\n" +
                "        \"operationId\": \"BarnehageTypeApi_GetEnheter\",\n" +
                "        \"consumes\": [],\n" +
                "        \"produces\": [\n" +
                "          \"application/json\",\n" +
                "          \"text/json\",\n" +
                "          \"application/xml\",\n" +
                "          \"text/xml\"\n" +
                "        ],\n" +
                "        \"responses\": {\n" +
                "          \"200\": {\n" +
                "            \"description\": \"OK\",\n" +
                "            \"schema\": {\n" +
                "              \"$ref\": \"#/definitions/SkoleType\"\n" +
                "            }\n" +
                "          }\n" +
                "        }\n" +
                "      }\n" +
                "    },\n" +
                "    \"/enhet/{id}\": {\n" +
                "      \"get\": {\n" +
                "        \"tags\": [\n" +
                "          \"Enhet\"\n" +
                "        ],\n" +
                "        \"summary\": \"Hent enhet\",\n" +
                "        \"description\": \"Returnerer en enhet basert på identifikator. Orgnr eller Nsrid for enheten kan benyttes.\",\n" +
                "        \"operationId\": \"EnhetApi_GetEnhet\",\n" +
                "        \"consumes\": [],\n" +
                "        \"produces\": [\n" +
                "          \"application/json\",\n" +
                "          \"text/json\",\n" +
                "          \"application/xml\",\n" +
                "          \"text/xml\"\n" +
                "        ],\n" +
                "        \"parameters\": [\n" +
                "          {\n" +
                "            \"name\": \"id\",\n" +
                "            \"in\": \"path\",\n" +
                "            \"required\": true,\n" +
                "            \"type\": \"string\"\n" +
                "          }\n" +
                "        ],\n" +
                "        \"responses\": {\n" +
                "          \"200\": {\n" +
                "            \"description\": \"OK\",\n" +
                "            \"schema\": {\n" +
                "              \"$ref\": \"#/definitions/EnhetNBRApiModel\"\n" +
                "            }\n" +
                "          }\n" +
                "        }\n" +
                "      }\n" +
                "    },\n" +
                "    \"/enheter\": {\n" +
                "      \"get\": {\n" +
                "        \"tags\": [\n" +
                "          \"Enhet\"\n" +
                "        ],\n" +
                "        \"summary\": \"Alle enheter\",\n" +
                "        \"description\": \"Returnerer alle enheter i registeret. \\r\\n            Anbefalt bruk mellom 15.00 - 08.00 for et fullverdig datagrunnlag utenom importtid til barnehageregisteret.\\r\\n            Cachetid er på 2 timer.\",\n" +
                "        \"operationId\": \"EnhetApi_GetEnheter\",\n" +
                "        \"consumes\": [],\n" +
                "        \"produces\": [\n" +
                "          \"application/json\",\n" +
                "          \"text/json\",\n" +
                "          \"application/xml\",\n" +
                "          \"text/xml\"\n" +
                "        ],\n" +
                "        \"responses\": {\n" +
                "          \"200\": {\n" +
                "            \"description\": \"OK\",\n" +
                "            \"schema\": {\n" +
                "              \"type\": \"array\",\n" +
                "              \"items\": {\n" +
                "                \"$ref\": \"#/definitions/EnhetNBRTinyApiModel\"\n" +
                "              }\n" +
                "            }\n" +
                "          }\n" +
                "        }\n" +
                "      }\n" +
                "    },\n" +
                "    \"/enheter/{date}\": {\n" +
                "      \"get\": {\n" +
                "        \"tags\": [\n" +
                "          \"Enhet\"\n" +
                "        ],\n" +
                "        \"summary\": \"Enheter endret\",\n" +
                "        \"description\": \"Returnerer alle enheter i registeret det er registrert endringer på fra gitt dato.\",\n" +
                "        \"operationId\": \"EnhetApi_GetEnheterFromDate\",\n" +
                "        \"consumes\": [],\n" +
                "        \"produces\": [\n" +
                "          \"application/json\",\n" +
                "          \"text/json\",\n" +
                "          \"application/xml\",\n" +
                "          \"text/xml\"\n" +
                "        ],\n" +
                "        \"parameters\": [\n" +
                "          {\n" +
                "            \"name\": \"date\",\n" +
                "            \"in\": \"path\",\n" +
                "            \"required\": true,\n" +
                "            \"type\": \"string\",\n" +
                "            \"format\": \"date-time\"\n" +
                "          }\n" +
                "        ],\n" +
                "        \"responses\": {\n" +
                "          \"200\": {\n" +
                "            \"description\": \"OK\",\n" +
                "            \"schema\": {\n" +
                "              \"type\": \"array\",\n" +
                "              \"items\": {\n" +
                "                \"$ref\": \"#/definitions/EnhetNBRTinyApiModel\"\n" +
                "              }\n" +
                "            }\n" +
                "          }\n" +
                "        }\n" +
                "      }\n" +
                "    },\n" +
                "    \"/enheter/kommune/{kommuneNr}\": {\n" +
                "      \"get\": {\n" +
                "        \"tags\": [\n" +
                "          \"Enhet\"\n" +
                "        ],\n" +
                "        \"summary\": \"Alle enheter i kommune\",\n" +
                "        \"description\": \"Returnerer alle enheter i kommune.\",\n" +
                "        \"operationId\": \"EnhetApi_GetEnheterInKommune\",\n" +
                "        \"consumes\": [],\n" +
                "        \"produces\": [\n" +
                "          \"application/json\",\n" +
                "          \"text/json\",\n" +
                "          \"application/xml\",\n" +
                "          \"text/xml\"\n" +
                "        ],\n" +
                "        \"parameters\": [\n" +
                "          {\n" +
                "            \"name\": \"kommuneNr\",\n" +
                "            \"in\": \"path\",\n" +
                "            \"required\": true,\n" +
                "            \"type\": \"string\"\n" +
                "          }\n" +
                "        ],\n" +
                "        \"responses\": {\n" +
                "          \"200\": {\n" +
                "            \"description\": \"OK\",\n" +
                "            \"schema\": {\n" +
                "              \"type\": \"array\",\n" +
                "              \"items\": {\n" +
                "                \"$ref\": \"#/definitions/EnhetSmallApiModel\"\n" +
                "              }\n" +
                "            }\n" +
                "          }\n" +
                "        }\n" +
                "      }\n" +
                "    },\n" +
                "    \"/enheter/fylke/{fylkeNr}\": {\n" +
                "      \"get\": {\n" +
                "        \"tags\": [\n" +
                "          \"Enhet\"\n" +
                "        ],\n" +
                "        \"summary\": \"Alle enheter i fylke\",\n" +
                "        \"description\": \"Returnerer alle enheter i fylke.\",\n" +
                "        \"operationId\": \"EnhetApi_GetEnheterTinyInFylke\",\n" +
                "        \"consumes\": [],\n" +
                "        \"produces\": [\n" +
                "          \"application/json\",\n" +
                "          \"text/json\",\n" +
                "          \"application/xml\",\n" +
                "          \"text/xml\"\n" +
                "        ],\n" +
                "        \"parameters\": [\n" +
                "          {\n" +
                "            \"name\": \"fylkeNr\",\n" +
                "            \"in\": \"path\",\n" +
                "            \"required\": true,\n" +
                "            \"type\": \"string\"\n" +
                "          }\n" +
                "        ],\n" +
                "        \"responses\": {\n" +
                "          \"200\": {\n" +
                "            \"description\": \"OK\",\n" +
                "            \"schema\": {\n" +
                "              \"type\": \"array\",\n" +
                "              \"items\": {\n" +
                "                \"$ref\": \"#/definitions/EnhetSmallApiModel\"\n" +
                "              }\n" +
                "            }\n" +
                "          }\n" +
                "        }\n" +
                "      }\n" +
                "    },\n" +
                "    \"/enheter/barnehageType/{barnehageType}\": {\n" +
                "      \"get\": {\n" +
                "        \"tags\": [\n" +
                "          \"Enhet\"\n" +
                "        ],\n" +
                "        \"summary\": \"Alle enheter med barnehagetype\",\n" +
                "        \"description\": \"Returnerer alle enheter som inneholder gitt barnehagetype.\",\n" +
                "        \"operationId\": \"EnhetApi_GetEnheterWithBarnehageType\",\n" +
                "        \"consumes\": [],\n" +
                "        \"produces\": [\n" +
                "          \"application/json\",\n" +
                "          \"text/json\",\n" +
                "          \"application/xml\",\n" +
                "          \"text/xml\"\n" +
                "        ],\n" +
                "        \"parameters\": [\n" +
                "          {\n" +
                "            \"name\": \"barnehageType\",\n" +
                "            \"in\": \"path\",\n" +
                "            \"required\": true,\n" +
                "            \"type\": \"string\"\n" +
                "          }\n" +
                "        ],\n" +
                "        \"responses\": {\n" +
                "          \"200\": {\n" +
                "            \"description\": \"OK\",\n" +
                "            \"schema\": {\n" +
                "              \"type\": \"array\",\n" +
                "              \"items\": {\n" +
                "                \"$ref\": \"#/definitions/EnhetSmallApiModel\"\n" +
                "              }\n" +
                "            }\n" +
                "          }\n" +
                "        }\n" +
                "      }\n" +
                "    },\n" +
                "    \"/enheter/nacekode/{nacekode}\": {\n" +
                "      \"get\": {\n" +
                "        \"tags\": [\n" +
                "          \"Enhet\"\n" +
                "        ],\n" +
                "        \"summary\": \"Alle enheter med nacekode\",\n" +
                "        \"description\": \"Returnerer alle enheter som inneholder gitt nacekode.\",\n" +
                "        \"operationId\": \"EnhetApi_GetEnheterWithNacekode\",\n" +
                "        \"consumes\": [],\n" +
                "        \"produces\": [\n" +
                "          \"application/json\",\n" +
                "          \"text/json\",\n" +
                "          \"application/xml\",\n" +
                "          \"text/xml\"\n" +
                "        ],\n" +
                "        \"parameters\": [\n" +
                "          {\n" +
                "            \"name\": \"nacekode\",\n" +
                "            \"in\": \"path\",\n" +
                "            \"required\": true,\n" +
                "            \"type\": \"string\"\n" +
                "          }\n" +
                "        ],\n" +
                "        \"responses\": {\n" +
                "          \"200\": {\n" +
                "            \"description\": \"OK\",\n" +
                "            \"schema\": {\n" +
                "              \"type\": \"array\",\n" +
                "              \"items\": {\n" +
                "                \"$ref\": \"#/definitions/EnhetSmallApiModel\"\n" +
                "              }\n" +
                "            }\n" +
                "          }\n" +
                "        }\n" +
                "      }\n" +
                "    },\n" +
                "    \"/enheter/sok\": {\n" +
                "      \"post\": {\n" +
                "        \"tags\": [\n" +
                "          \"Enhet\"\n" +
                "        ],\n" +
                "        \"summary\": \"Søk i enheter\",\n" +
                "        \"description\": \"Returnerer enheter basert på søkekriterier. Requesten må inneholde et objekt som vist under. \\r\\n            Her kan du kombinere søkekriterier som søkestreng, nacekode, barnehagetype, fylke og kommune samt filtrering på om du vil ha kun barnehager, \\r\\n            barnehageeiere eller andre enheter som f.eks organisasjonsledd.  Du kan også filtrere på om du vil\\r\\n            ha aktive eller nedlagte enheter.\\r\\n            Ved behov om å ytterligere filtrering og funksjonalitet kan hele datagrunnlag for registere hentes i metoden /enheter.\\r\\n            \\r\\n            EGENSKAPER:\\r\\n            SokeString - Begrens til enheter med navn, orgnr eller nsrid\\r\\n            NaceKode - Begrens til enheter med nacekode\\r\\n            BarnehageType - Begrens til enheter med barnehagetype\\r\\n            Fylke - Begrens til enheter i fylke\\r\\n            Kommune - Begrens til enheter i kommune\\r\\n            \\r\\n            Aktive - Enheter som er aktive\\r\\n            Nedlagte - Enheter som ikke er aktive\\r\\n            AndreEnheter - Enheter som har enhetstype STAT eller ORGL\\r\\n            Eiere - Enheter som eier en barnehage\\r\\n            Barnehager - Enheter som er barnehage \\r\\n            \\r\\n            MERK:\\r\\n            En av egenskapene sokestring, fylke, kommune, nacekode eller barnehagetype må med for å få tilbake enheter. \\r\\n            Disse kan kombineres med de boolske egenskapene.\\r\\n            Boolske properties skal kun benyttes med value true.\\r\\n            Eksempler:\\r\\n            Hvis du ønsker å ikke ha med utgåtte enheter legger du med \\\"Aktive\\\": true\\r\\n            Hvis du ønsker kun nedlagte barnehager i Oppland sender du med \\\"Fylke\\\": \\\"5\\\", \\\"Nedlagte\\\": true, \\\"Barnehager\\\": true\\r\\n            Hvis ingen boolske properties er angitt så er det, det samme som at alle står til true.\",\n" +
                "        \"operationId\": \"EnhetApi_Sok\",\n" +
                "        \"consumes\": [\n" +
                "          \"application/json\",\n" +
                "          \"text/json\",\n" +
                "          \"application/xml\",\n" +
                "          \"text/xml\",\n" +
                "          \"application/x-www-form-urlencoded\"\n" +
                "        ],\n" +
                "        \"produces\": [\n" +
                "          \"application/json\",\n" +
                "          \"text/json\",\n" +
                "          \"application/xml\",\n" +
                "          \"text/xml\"\n" +
                "        ],\n" +
                "        \"parameters\": [\n" +
                "          {\n" +
                "            \"name\": \"model\",\n" +
                "            \"in\": \"body\",\n" +
                "            \"required\": true,\n" +
                "            \"schema\": {\n" +
                "              \"$ref\": \"#/definitions/SokNBRApiModel\"\n" +
                "            }\n" +
                "          }\n" +
                "        ],\n" +
                "        \"responses\": {\n" +
                "          \"200\": {\n" +
                "            \"description\": \"OK\",\n" +
                "            \"schema\": {\n" +
                "              \"type\": \"array\",\n" +
                "              \"items\": {\n" +
                "                \"$ref\": \"#/definitions/EnhetSmallApiModel\"\n" +
                "              }\n" +
                "            }\n" +
                "          }\n" +
                "        }\n" +
                "      }\n" +
                "    },\n" +
                "    \"/fylker\": {\n" +
                "      \"get\": {\n" +
                "        \"tags\": [\n" +
                "          \"Fylke\"\n" +
                "        ],\n" +
                "        \"summary\": \"Alle fylker\",\n" +
                "        \"description\": \"Returnerer alle fylker.\",\n" +
                "        \"operationId\": \"FylkeApi_GetFylker\",\n" +
                "        \"consumes\": [],\n" +
                "        \"produces\": [\n" +
                "          \"application/json\",\n" +
                "          \"text/json\",\n" +
                "          \"application/xml\",\n" +
                "          \"text/xml\"\n" +
                "        ],\n" +
                "        \"responses\": {\n" +
                "          \"200\": {\n" +
                "            \"description\": \"OK\",\n" +
                "            \"schema\": {\n" +
                "              \"type\": \"array\",\n" +
                "              \"items\": {\n" +
                "                \"$ref\": \"#/definitions/Fylke\"\n" +
                "              }\n" +
                "            }\n" +
                "          }\n" +
                "        }\n" +
                "      }\n" +
                "    },\n" +
                "    \"/kommuner\": {\n" +
                "      \"get\": {\n" +
                "        \"tags\": [\n" +
                "          \"Kommune\"\n" +
                "        ],\n" +
                "        \"summary\": \"Alle kommuner\",\n" +
                "        \"description\": \"Returnerer alle kommuner.\",\n" +
                "        \"operationId\": \"KommuneApi_GetKommuner\",\n" +
                "        \"consumes\": [],\n" +
                "        \"produces\": [\n" +
                "          \"application/json\",\n" +
                "          \"text/json\",\n" +
                "          \"application/xml\",\n" +
                "          \"text/xml\"\n" +
                "        ],\n" +
                "        \"responses\": {\n" +
                "          \"200\": {\n" +
                "            \"description\": \"OK\",\n" +
                "            \"schema\": {\n" +
                "              \"type\": \"array\",\n" +
                "              \"items\": {\n" +
                "                \"$ref\": \"#/definitions/Kommune\"\n" +
                "              }\n" +
                "            }\n" +
                "          }\n" +
                "        }\n" +
                "      }\n" +
                "    },\n" +
                "    \"/kommuner/{fylkeNr}\": {\n" +
                "      \"get\": {\n" +
                "        \"tags\": [\n" +
                "          \"Kommune\"\n" +
                "        ],\n" +
                "        \"summary\": \"Alle kommuner i fylke\",\n" +
                "        \"description\": \"Returnerer alle kommuner i gitt fylke.\",\n" +
                "        \"operationId\": \"KommuneApi_GetKommunerInFylke\",\n" +
                "        \"consumes\": [],\n" +
                "        \"produces\": [\n" +
                "          \"application/json\",\n" +
                "          \"text/json\",\n" +
                "          \"application/xml\",\n" +
                "          \"text/xml\"\n" +
                "        ],\n" +
                "        \"parameters\": [\n" +
                "          {\n" +
                "            \"name\": \"fylkeNr\",\n" +
                "            \"in\": \"path\",\n" +
                "            \"required\": true,\n" +
                "            \"type\": \"string\"\n" +
                "          }\n" +
                "        ],\n" +
                "        \"responses\": {\n" +
                "          \"200\": {\n" +
                "            \"description\": \"OK\",\n" +
                "            \"schema\": {\n" +
                "              \"type\": \"array\",\n" +
                "              \"items\": {\n" +
                "                \"$ref\": \"#/definitions/Kommune\"\n" +
                "              }\n" +
                "            }\n" +
                "          }\n" +
                "        }\n" +
                "      }\n" +
                "    },\n" +
                "    \"/nacekoder\": {\n" +
                "      \"get\": {\n" +
                "        \"tags\": [\n" +
                "          \"Nacekode\"\n" +
                "        ],\n" +
                "        \"summary\": \"Alle nacekoder\",\n" +
                "        \"description\": \"Returnerer alle nacekoder for registeret.\",\n" +
                "        \"operationId\": \"NaceKodeApi_GetNacekoder\",\n" +
                "        \"consumes\": [],\n" +
                "        \"produces\": [\n" +
                "          \"application/json\",\n" +
                "          \"text/json\",\n" +
                "          \"application/xml\",\n" +
                "          \"text/xml\"\n" +
                "        ],\n" +
                "        \"responses\": {\n" +
                "          \"200\": {\n" +
                "            \"description\": \"OK\",\n" +
                "            \"schema\": {\n" +
                "              \"$ref\": \"#/definitions/Nacekode\"\n" +
                "            }\n" +
                "          }\n" +
                "        }\n" +
                "      }\n" +
                "    },\n" +
                "    \"/relasjonstyper\": {\n" +
                "      \"get\": {\n" +
                "        \"tags\": [\n" +
                "          \"Relasjon\"\n" +
                "        ],\n" +
                "        \"summary\": \"Alle relasjonstyper\",\n" +
                "        \"description\": \"Returnerer alle relasjonstyper.\",\n" +
                "        \"operationId\": \"RelasjonApi_GetRelasjonsTyper\",\n" +
                "        \"consumes\": [],\n" +
                "        \"produces\": [\n" +
                "          \"application/json\",\n" +
                "          \"text/json\",\n" +
                "          \"application/xml\",\n" +
                "          \"text/xml\"\n" +
                "        ],\n" +
                "        \"responses\": {\n" +
                "          \"200\": {\n" +
                "            \"description\": \"OK\",\n" +
                "            \"schema\": {\n" +
                "              \"$ref\": \"#/definitions/RelasjonsType\"\n" +
                "            }\n" +
                "          }\n" +
                "        }\n" +
                "      }\n" +
                "    },\n" +
                "    \"/trestruktur/{orgNr}/{relasjonsType}\": {\n" +
                "      \"get\": {\n" +
                "        \"tags\": [\n" +
                "          \"Relasjon\"\n" +
                "        ],\n" +
                "        \"summary\": \"Trestruktur for enhet med relasjonstype\",\n" +
                "        \"description\": \"Returnerer en trestruktur med underenheter av en gitt enhet basert på orgnr og relasjonstype.\",\n" +
                "        \"operationId\": \"RelasjonApi_GetEnheterWithNacekode\",\n" +
                "        \"consumes\": [],\n" +
                "        \"produces\": [\n" +
                "          \"application/json\",\n" +
                "          \"text/json\",\n" +
                "          \"application/xml\",\n" +
                "          \"text/xml\"\n" +
                "        ],\n" +
                "        \"parameters\": [\n" +
                "          {\n" +
                "            \"name\": \"orgNr\",\n" +
                "            \"in\": \"path\",\n" +
                "            \"required\": true,\n" +
                "            \"type\": \"string\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"name\": \"relasjonsType\",\n" +
                "            \"in\": \"path\",\n" +
                "            \"required\": true,\n" +
                "            \"type\": \"integer\",\n" +
                "            \"format\": \"int32\"\n" +
                "          }\n" +
                "        ],\n" +
                "        \"responses\": {\n" +
                "          \"200\": {\n" +
                "            \"description\": \"OK\",\n" +
                "            \"schema\": {\n" +
                "              \"$ref\": \"#/definitions/EnhetTrestrukturApiModel\"\n" +
                "            }\n" +
                "          }\n" +
                "        }\n" +
                "      }\n" +
                "    }\n" +
                "  },\n" +
                "  \"definitions\": {\n" +
                "    \"SkoleType\": {\n" +
                "      \"type\": \"object\",\n" +
                "      \"properties\": {\n" +
                "        \"Navn\": {\n" +
                "          \"type\": \"string\"\n" +
                "        },\n" +
                "        \"NavnTekst\": {\n" +
                "          \"type\": \"string\"\n" +
                "        },\n" +
                "        \"Id\": {\n" +
                "          \"type\": \"string\"\n" +
                "        },\n" +
                "        \"ErSystemType\": {\n" +
                "          \"type\": \"boolean\"\n" +
                "        }\n" +
                "      }\n" +
                "    },\n" +
                "    \"EnhetNBRApiModel\": {\n" +
                "      \"type\": \"object\",\n" +
                "      \"properties\": {\n" +
                "        \"NSRId\": {\n" +
                "          \"format\": \"int32\",\n" +
                "          \"type\": \"integer\"\n" +
                "        },\n" +
                "        \"OrgNr\": {\n" +
                "          \"type\": \"string\"\n" +
                "        },\n" +
                "        \"Navn\": {\n" +
                "          \"type\": \"string\"\n" +
                "        },\n" +
                "        \"Karakteristikk\": {\n" +
                "          \"type\": \"string\"\n" +
                "        },\n" +
                "        \"FulltNavn\": {\n" +
                "          \"type\": \"string\",\n" +
                "          \"readOnly\": true\n" +
                "        },\n" +
                "        \"Kallenavn\": {\n" +
                "          \"type\": \"string\"\n" +
                "        },\n" +
                "        \"KommuneNavn\": {\n" +
                "          \"type\": \"string\"\n" +
                "        },\n" +
                "        \"Epost\": {\n" +
                "          \"type\": \"string\"\n" +
                "        },\n" +
                "        \"Url\": {\n" +
                "          \"type\": \"string\"\n" +
                "        },\n" +
                "        \"Maalform\": {\n" +
                "          \"type\": \"string\"\n" +
                "        },\n" +
                "        \"BarnehageStyrer\": {\n" +
                "          \"type\": \"string\"\n" +
                "        },\n" +
                "        \"BarnehageStyrerFornavn\": {\n" +
                "          \"type\": \"string\"\n" +
                "        },\n" +
                "        \"BarnehageStyrerEtternavn\": {\n" +
                "          \"type\": \"string\"\n" +
                "        },\n" +
                "        \"GsiId\": {\n" +
                "          \"type\": \"string\"\n" +
                "        },\n" +
                "        \"Telefon\": {\n" +
                "          \"type\": \"string\"\n" +
                "        },\n" +
                "        \"Mobil\": {\n" +
                "          \"type\": \"string\"\n" +
                "        },\n" +
                "        \"Fax\": {\n" +
                "          \"type\": \"string\"\n" +
                "        },\n" +
                "        \"ErBarnehage\": {\n" +
                "          \"type\": \"boolean\"\n" +
                "        },\n" +
                "        \"ErBarnehageEier\": {\n" +
                "          \"type\": \"boolean\"\n" +
                "        },\n" +
                "        \"ErOffentligBarnehage\": {\n" +
                "          \"type\": \"boolean\"\n" +
                "        },\n" +
                "        \"ErPrivatBarnehage\": {\n" +
                "          \"type\": \"boolean\"\n" +
                "        },\n" +
                "        \"VisesPaaWeb\": {\n" +
                "          \"type\": \"boolean\"\n" +
                "        },\n" +
                "        \"ErAktiv\": {\n" +
                "          \"type\": \"boolean\"\n" +
                "        },\n" +
                "        \"AntallBarn\": {\n" +
                "          \"format\": \"int32\",\n" +
                "          \"type\": \"integer\"\n" +
                "        },\n" +
                "        \"AnsatteFra\": {\n" +
                "          \"format\": \"int32\",\n" +
                "          \"type\": \"integer\"\n" +
                "        },\n" +
                "        \"AnsatteTil\": {\n" +
                "          \"format\": \"int32\",\n" +
                "          \"type\": \"integer\"\n" +
                "        },\n" +
                "        \"AldersTrinnFra\": {\n" +
                "          \"format\": \"int32\",\n" +
                "          \"type\": \"integer\"\n" +
                "        },\n" +
                "        \"AldersTrinnTil\": {\n" +
                "          \"format\": \"int32\",\n" +
                "          \"type\": \"integer\"\n" +
                "        },\n" +
                "        \"SistEndretDato\": {\n" +
                "          \"format\": \"date-time\",\n" +
                "          \"type\": \"string\"\n" +
                "        },\n" +
                "        \"OpprettetDato\": {\n" +
                "          \"format\": \"date-time\",\n" +
                "          \"type\": \"string\"\n" +
                "        },\n" +
                "        \"Besoksadresse\": {\n" +
                "          \"$ref\": \"#/definitions/Adresse\"\n" +
                "        },\n" +
                "        \"Nacekoder\": {\n" +
                "          \"type\": \"array\",\n" +
                "          \"items\": {\n" +
                "            \"$ref\": \"#/definitions/Nacekode\"\n" +
                "          }\n" +
                "        },\n" +
                "        \"Postadresse\": {\n" +
                "          \"$ref\": \"#/definitions/Adresse\"\n" +
                "        },\n" +
                "        \"Fylke\": {\n" +
                "          \"$ref\": \"#/definitions/Fylke\"\n" +
                "        },\n" +
                "        \"EnhetsType\": {\n" +
                "          \"$ref\": \"#/definitions/EnhetsType\"\n" +
                "        },\n" +
                "        \"SektorType\": {\n" +
                "          \"$ref\": \"#/definitions/SektorType\"\n" +
                "        },\n" +
                "        \"BarnehageTyper\": {\n" +
                "          \"type\": \"array\",\n" +
                "          \"items\": {\n" +
                "            \"$ref\": \"#/definitions/SkoleType\"\n" +
                "          }\n" +
                "        },\n" +
                "        \"Kommune\": {\n" +
                "          \"$ref\": \"#/definitions/Kommune\"\n" +
                "        },\n" +
                "        \"Koordinater\": {\n" +
                "          \"$ref\": \"#/definitions/Koordinater\"\n" +
                "        },\n" +
                "        \"Utgaattype\": {\n" +
                "          \"$ref\": \"#/definitions/Utgaattype\"\n" +
                "        },\n" +
                "        \"ParentRelasjoner\": {\n" +
                "          \"type\": \"array\",\n" +
                "          \"items\": {\n" +
                "            \"$ref\": \"#/definitions/Relasjon\"\n" +
                "          }\n" +
                "        },\n" +
                "        \"ChildRelasjoner\": {\n" +
                "          \"type\": \"array\",\n" +
                "          \"items\": {\n" +
                "            \"$ref\": \"#/definitions/Relasjon\"\n" +
                "          }\n" +
                "        },\n" +
                "        \"PersonEpost\": {\n" +
                "          \"type\": \"string\"\n" +
                "        },\n" +
                "        \"PersonTelefon\": {\n" +
                "          \"type\": \"string\"\n" +
                "        }\n" +
                "      }\n" +
                "    },\n" +
                "    \"Adresse\": {\n" +
                "      \"type\": \"object\",\n" +
                "      \"properties\": {\n" +
                "        \"Adress\": {\n" +
                "          \"type\": \"string\"\n" +
                "        },\n" +
                "        \"Postnr\": {\n" +
                "          \"type\": \"string\"\n" +
                "        },\n" +
                "        \"Poststed\": {\n" +
                "          \"type\": \"string\"\n" +
                "        },\n" +
                "        \"Land\": {\n" +
                "          \"type\": \"string\"\n" +
                "        }\n" +
                "      }\n" +
                "    },\n" +
                "    \"Nacekode\": {\n" +
                "      \"type\": \"object\",\n" +
                "      \"properties\": {\n" +
                "        \"Kode\": {\n" +
                "          \"type\": \"string\"\n" +
                "        },\n" +
                "        \"Navn\": {\n" +
                "          \"type\": \"string\"\n" +
                "        },\n" +
                "        \"Versjon\": {\n" +
                "          \"type\": \"string\"\n" +
                "        }\n" +
                "      }\n" +
                "    },\n" +
                "    \"Fylke\": {\n" +
                "      \"type\": \"object\",\n" +
                "      \"properties\": {\n" +
                "        \"Fylkesnr\": {\n" +
                "          \"type\": \"string\"\n" +
                "        },\n" +
                "        \"Navn\": {\n" +
                "          \"type\": \"string\"\n" +
                "        },\n" +
                "        \"OrgNr\": {\n" +
                "          \"type\": \"string\"\n" +
                "        },\n" +
                "        \"OrgNrFylkesmann\": {\n" +
                "          \"type\": \"string\"\n" +
                "        }\n" +
                "      }\n" +
                "    },\n" +
                "    \"EnhetsType\": {\n" +
                "      \"type\": \"object\",\n" +
                "      \"properties\": {\n" +
                "        \"Type\": {\n" +
                "          \"type\": \"string\"\n" +
                "        },\n" +
                "        \"Navn\": {\n" +
                "          \"type\": \"string\"\n" +
                "        },\n" +
                "        \"Offentlig\": {\n" +
                "          \"type\": \"boolean\"\n" +
                "        }\n" +
                "      }\n" +
                "    },\n" +
                "    \"SektorType\": {\n" +
                "      \"type\": \"object\",\n" +
                "      \"properties\": {\n" +
                "        \"Navn\": {\n" +
                "          \"type\": \"string\"\n" +
                "        },\n" +
                "        \"Id\": {\n" +
                "          \"type\": \"string\"\n" +
                "        }\n" +
                "      }\n" +
                "    },\n" +
                "    \"Kommune\": {\n" +
                "      \"type\": \"object\",\n" +
                "      \"properties\": {\n" +
                "        \"ErNedlagt\": {\n" +
                "          \"type\": \"boolean\"\n" +
                "        },\n" +
                "        \"KommuneGruppe\": {\n" +
                "          \"$ref\": \"#/definitions/KommuneGruppe\"\n" +
                "        },\n" +
                "        \"Kommunenr\": {\n" +
                "          \"type\": \"string\"\n" +
                "        },\n" +
                "        \"Navn\": {\n" +
                "          \"type\": \"string\"\n" +
                "        },\n" +
                "        \"OrgNr\": {\n" +
                "          \"type\": \"string\"\n" +
                "        },\n" +
                "        \"Fylkesnr\": {\n" +
                "          \"type\": \"string\"\n" +
                "        }\n" +
                "      }\n" +
                "    },\n" +
                "    \"Koordinater\": {\n" +
                "      \"type\": \"object\",\n" +
                "      \"properties\": {\n" +
                "        \"Zoom\": {\n" +
                "          \"format\": \"int32\",\n" +
                "          \"type\": \"integer\"\n" +
                "        },\n" +
                "        \"Lengdegrad\": {\n" +
                "          \"format\": \"double\",\n" +
                "          \"type\": \"number\"\n" +
                "        },\n" +
                "        \"Breddegrad\": {\n" +
                "          \"format\": \"double\",\n" +
                "          \"type\": \"number\"\n" +
                "        },\n" +
                "        \"GeoKvalitet\": {\n" +
                "          \"type\": \"string\"\n" +
                "        }\n" +
                "      }\n" +
                "    },\n" +
                "    \"Utgaattype\": {\n" +
                "      \"type\": \"object\",\n" +
                "      \"properties\": {\n" +
                "        \"EnumId\": {\n" +
                "          \"type\": \"string\"\n" +
                "        },\n" +
                "        \"Name\": {\n" +
                "          \"type\": \"string\"\n" +
                "        }\n" +
                "      }\n" +
                "    },\n" +
                "    \"Relasjon\": {\n" +
                "      \"type\": \"object\",\n" +
                "      \"properties\": {\n" +
                "        \"Enhet\": {\n" +
                "          \"$ref\": \"#/definitions/EnhetSmallApiModel\"\n" +
                "        },\n" +
                "        \"RelasjonsType\": {\n" +
                "          \"$ref\": \"#/definitions/RelasjonsType\"\n" +
                "        }\n" +
                "      }\n" +
                "    },\n" +
                "    \"KommuneGruppe\": {\n" +
                "      \"type\": \"object\",\n" +
                "      \"properties\": {\n" +
                "        \"Gruppe\": {\n" +
                "          \"type\": \"string\"\n" +
                "        },\n" +
                "        \"Navn\": {\n" +
                "          \"type\": \"string\"\n" +
                "        }\n" +
                "      }\n" +
                "    },\n" +
                "    \"EnhetSmallApiModel\": {\n" +
                "      \"type\": \"object\",\n" +
                "      \"properties\": {\n" +
                "        \"NSRId\": {\n" +
                "          \"format\": \"int32\",\n" +
                "          \"type\": \"integer\"\n" +
                "        },\n" +
                "        \"Navn\": {\n" +
                "          \"type\": \"string\"\n" +
                "        },\n" +
                "        \"Karakteristikk\": {\n" +
                "          \"type\": \"string\"\n" +
                "        },\n" +
                "        \"FulltNavn\": {\n" +
                "          \"type\": \"string\",\n" +
                "          \"readOnly\": true\n" +
                "        },\n" +
                "        \"Kallenavn\": {\n" +
                "          \"type\": \"string\"\n" +
                "        },\n" +
                "        \"OrgNr\": {\n" +
                "          \"type\": \"string\"\n" +
                "        },\n" +
                "        \"Epost\": {\n" +
                "          \"type\": \"string\"\n" +
                "        },\n" +
                "        \"Poststed\": {\n" +
                "          \"type\": \"string\"\n" +
                "        },\n" +
                "        \"Kommune\": {\n" +
                "          \"type\": \"string\"\n" +
                "        },\n" +
                "        \"Kommunenr\": {\n" +
                "          \"type\": \"string\"\n" +
                "        },\n" +
                "        \"BesoksAdresse\": {\n" +
                "          \"type\": \"string\"\n" +
                "        },\n" +
                "        \"Telefon\": {\n" +
                "          \"type\": \"string\"\n" +
                "        },\n" +
                "        \"NaceKode1\": {\n" +
                "          \"type\": \"string\"\n" +
                "        },\n" +
                "        \"NaceKode2\": {\n" +
                "          \"type\": \"string\"\n" +
                "        },\n" +
                "        \"NaceKode3\": {\n" +
                "          \"type\": \"string\"\n" +
                "        },\n" +
                "        \"Zoom\": {\n" +
                "          \"format\": \"int32\",\n" +
                "          \"type\": \"integer\"\n" +
                "        },\n" +
                "        \"Lengdegrad\": {\n" +
                "          \"format\": \"double\",\n" +
                "          \"type\": \"number\"\n" +
                "        },\n" +
                "        \"Breddegrad\": {\n" +
                "          \"format\": \"double\",\n" +
                "          \"type\": \"number\"\n" +
                "        },\n" +
                "        \"GeoKvalitet\": {\n" +
                "          \"type\": \"string\"\n" +
                "        }\n" +
                "      }\n" +
                "    },\n" +
                "    \"RelasjonsType\": {\n" +
                "      \"type\": \"object\",\n" +
                "      \"properties\": {\n" +
                "        \"Beskrivelse\": {\n" +
                "          \"type\": \"string\"\n" +
                "        },\n" +
                "        \"Navn\": {\n" +
                "          \"type\": \"string\"\n" +
                "        },\n" +
                "        \"Id\": {\n" +
                "          \"type\": \"string\"\n" +
                "        },\n" +
                "        \"ErSystemRelasjon\": {\n" +
                "          \"type\": \"boolean\"\n" +
                "        }\n" +
                "      }\n" +
                "    },\n" +
                "    \"EnhetNBRTinyApiModel\": {\n" +
                "      \"type\": \"object\",\n" +
                "      \"properties\": {\n" +
                "        \"NSRId\": {\n" +
                "          \"format\": \"int32\",\n" +
                "          \"type\": \"integer\"\n" +
                "        },\n" +
                "        \"OrgNr\": {\n" +
                "          \"type\": \"string\"\n" +
                "        },\n" +
                "        \"Navn\": {\n" +
                "          \"type\": \"string\"\n" +
                "        },\n" +
                "        \"Karakteristikk\": {\n" +
                "          \"type\": \"string\"\n" +
                "        },\n" +
                "        \"FulltNavn\": {\n" +
                "          \"type\": \"string\",\n" +
                "          \"readOnly\": true\n" +
                "        },\n" +
                "        \"KommuneNavn\": {\n" +
                "          \"type\": \"string\"\n" +
                "        },\n" +
                "        \"Epost\": {\n" +
                "          \"type\": \"string\"\n" +
                "        },\n" +
                "        \"ErAktiv\": {\n" +
                "          \"type\": \"boolean\"\n" +
                "        },\n" +
                "        \"ErInaktivIBasil\": {\n" +
                "          \"type\": \"boolean\"\n" +
                "        },\n" +
                "        \"ErBarnehage\": {\n" +
                "          \"type\": \"boolean\"\n" +
                "        },\n" +
                "        \"ErBarnehageEier\": {\n" +
                "          \"type\": \"boolean\"\n" +
                "        },\n" +
                "        \"ErOffentligBarnehage\": {\n" +
                "          \"type\": \"boolean\"\n" +
                "        },\n" +
                "        \"ErPrivatBarnehage\": {\n" +
                "          \"type\": \"boolean\"\n" +
                "        },\n" +
                "        \"VisesPaaWeb\": {\n" +
                "          \"type\": \"boolean\"\n" +
                "        },\n" +
                "        \"KommuneNr\": {\n" +
                "          \"type\": \"string\"\n" +
                "        },\n" +
                "        \"FylkeNr\": {\n" +
                "          \"type\": \"string\"\n" +
                "        }\n" +
                "      }\n" +
                "    },\n" +
                "    \"SokNBRApiModel\": {\n" +
                "      \"type\": \"object\",\n" +
                "      \"properties\": {\n" +
                "        \"SokeString\": {\n" +
                "          \"type\": \"string\"\n" +
                "        },\n" +
                "        \"NaceKode\": {\n" +
                "          \"type\": \"string\"\n" +
                "        },\n" +
                "        \"BarnehageType\": {\n" +
                "          \"type\": \"string\"\n" +
                "        },\n" +
                "        \"Fylke\": {\n" +
                "          \"type\": \"string\"\n" +
                "        },\n" +
                "        \"Kommune\": {\n" +
                "          \"type\": \"string\"\n" +
                "        },\n" +
                "        \"Nedlagte\": {\n" +
                "          \"type\": \"boolean\"\n" +
                "        },\n" +
                "        \"Aktive\": {\n" +
                "          \"type\": \"boolean\"\n" +
                "        },\n" +
                "        \"Barnehager\": {\n" +
                "          \"type\": \"boolean\"\n" +
                "        },\n" +
                "        \"Eiere\": {\n" +
                "          \"type\": \"boolean\"\n" +
                "        },\n" +
                "        \"AndreEnheter\": {\n" +
                "          \"type\": \"boolean\"\n" +
                "        }\n" +
                "      }\n" +
                "    },\n" +
                "    \"EnhetTrestrukturApiModel\": {\n" +
                "      \"type\": \"object\",\n" +
                "      \"properties\": {\n" +
                "        \"NSRId\": {\n" +
                "          \"format\": \"int32\",\n" +
                "          \"type\": \"integer\"\n" +
                "        },\n" +
                "        \"OrgNr\": {\n" +
                "          \"type\": \"string\"\n" +
                "        },\n" +
                "        \"Navn\": {\n" +
                "          \"type\": \"string\"\n" +
                "        },\n" +
                "        \"Karakteristikk\": {\n" +
                "          \"type\": \"string\"\n" +
                "        },\n" +
                "        \"RelasjonsType\": {\n" +
                "          \"format\": \"int32\",\n" +
                "          \"type\": \"integer\"\n" +
                "        },\n" +
                "        \"Children\": {\n" +
                "          \"type\": \"array\",\n" +
                "          \"items\": {\n" +
                "            \"$ref\": \"#/definitions/EnhetTrestrukturApiModel\"\n" +
                "          }\n" +
                "        }\n" +
                "      }\n" +
                "    }\n" +
                "  }\n" +
                "}";
        return testData;
    }

}
