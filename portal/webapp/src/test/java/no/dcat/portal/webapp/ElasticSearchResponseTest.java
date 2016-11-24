package no.dcat.portal.webapp;

import no.difi.dcat.datastore.domain.dcat.Dataset;
import org.junit.Test;

import java.util.List;

import static org.junit.Assert.*;

/**
 * Class for testing ElasticSearchResponse
 * @Auther: Marcus Gustafson
 */
public class ElasticSearchResponseTest {

    public static final String _ID = "http://data.brreg.no/datakatalog/dataset/75";
    public static final String TITLE = "Barnehageområde";
    public static final String BESKRIVELSE = "Barnehageområde - informasjon .";

    private static String JSON_STRING = "{\n" +
            "  \"took\" : 14,\n" +
            "  \"timed_out\" : false,\n" +
            "  \"_shards\" : {\n" +
            "    \"total\" : 5,\n" +
            "    \"successful\" : 5,\n" +
            "    \"failed\" : 0\n" +
            "  },\n" +
            "  \"hits\" : {\n" +
            "    \"total\" : 1,\n" +
            "    \"max_score\" : 1.0,\n" +
            "    \"hits\" : [ {\n" +
            "      \"_index\" : \"dcat\",\n" +
            "      \"_type\" : \"dataset\",\n" +
            "      \"_id\" : " + "\"" + _ID + "\"" + ",\n" +
            "      \"_score\" : 1.0,\n" +
            "      \"_source\" : {\n" +
            "        \"id\" : " + "\"" + _ID + "\"" + ",\n" +
            "        \"title\" : {\n" +
            "          \"nb\" : " + "\"" + TITLE + "\"" + "\n" +
            "        },\n" +
            "        \"description\" : {\n" +
            "          \"nb\" : " + "\""+ BESKRIVELSE + "\"" + "\n" +
            "        },\n" +
            "        \"keyword\" : { },\n" +
            "        \"publisher\" : {\n" +
            "          \"id\" : \"http://data.brreg.no/enhetsregisteret/enhet/\"\n" +
            "        },\n" +
            "        \"theme\" : [ {\n" +
            "          \"id\" : \"http://publications.europa.eu/resource/authority/data-theme/SOCI\",\n" +
            "          \"code\" : \"SOCI\",\n" +
            "          \"startUse\" : \"2015-10-01\",\n" +
            "          \"title\" : {\n" +
            "            \"nb\" : \"Befolkning og samfunn\",\n" +
            "            \"en\" : \"Population and society\"\n" +
            "          },\n" +
            "          \"conceptSchema\" : {\n" +
            "            \"id\" : \"http://publications.europa.eu/resource/authority/data-theme\",\n" +
            "            \"title\" : \"Dataset types Named Authority List\",\n" +
            "            \"versioninfo\" : \"20160921-0\",\n" +
            "            \"versionnumber\" : \"20160921-0\"\n" +
            "          }\n" +
            "        } ],\n" +
            "        \"catalog\" : {\n" +
            "          \"id\" : \"http://data.brreg.no/datakatalog/katalog/6\",\n" +
            "          \"title\" : {\n" +
            "            \"nb\" : \"Test datakatalog\"\n" +
            "          },\n" +
            "          \"description\" : {\n" +
            "            \"nb\" : \"Katalog over testdata\"\n" +
            "          },\n" +
            "          \"publisher\" : {\n" +
            "            \"id\" : \"http://data.brreg.no/enhetsregisteret/enhet/985399077\",\n" +
            "            \"name\" : \"Mattilsynet\"\n" +
            "          },\n" +
            "          \"themeTaxonomy\" : [ ]\n" +
            "        },\n" +
            "        \"distribution\" : [ ],\n" +
            "        \"conformsTo\" : [ ],\n" +
            "        \"temporal\" : [ ],\n" +
            "        \"spatial\" : [ ],\n" +
            "        \"accessRightsComment\" : [ ],\n" +
            "        \"references\" : [ ]\n" +
            "      }\n" +
            "    } ]\n" +
            "  }\n" +
            "}";

    @Test
    public void testConverionToDataset() {
        ElasticSearchResponse esr = new ElasticSearchResponse();

        List<Dataset> l = esr.toListOfObjects(JSON_STRING, Dataset.class);

        Dataset ds = l.get(0);

        assertEquals(_ID, ds.getId());
        assertEquals(BESKRIVELSE, ds.getDescription().get("nb"));
        assertEquals(TITLE, ds.getTitle().get("nb"));
    }
}