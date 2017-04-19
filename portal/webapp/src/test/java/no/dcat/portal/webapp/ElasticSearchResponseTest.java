package no.dcat.portal.webapp;

import no.dcat.portal.webapp.domain.Dataset;
import org.junit.Test;

import java.util.List;
import java.util.Map;

import static org.hamcrest.core.Is.is;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertThat;

/**
 * Class for testing ElasticSearchResponse
 * @Auther: Marcus Gustafson
 */
public class ElasticSearchResponseTest {

    public static final String _ID = "http://data.brreg.no/datakatalog/dataset/75";
    public static final String TITLE = "Barnehageområde";
    public static final String BESKRIVELSE = "Barnehageområde - informasjon .";

    public static final String PUBLISHER = "brønnøysund";
    public static final String NR_OF_DATASETS = "20";

    private static String JSON_STRING_DATASETS = "{\n" +
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

    private static String THEME_COUNT = "{\n" +
            "    \"took\": 5,\n" +
            "    \"timed_out\": false,\n" +
            "    \"_shards\": {\n" +
            "        \"total\": 5,\n" +
            "        \"successful\": 5,\n" +
            "        \"failed\": 0\n" +
            "    },\n" +
            "    \"hits\": {\n" +
            "        \"total\": 91,\n" +
            "        \"max_score\": 0,\n" +
            "        \"hits\": []\n" +
            "    },\n" +
            "    \"aggregations\": {\n" +
            "        \"theme_count\": {\n" +
            "            \"doc_count_error_upper_bound\": 0,\n" +
            "            \"sum_other_doc_count\": 0,\n" +
            "            \"buckets\": [\n" +
            "                {\n" +
            "                    \"key\": \"GOVE\",\n" +
            "                    \"doc_count\": 49\n" +
            "                },\n" +
            "                {\n" +
            "                    \"key\": \"TRAN\",\n" +
            "                    \"doc_count\": 9\n" +
            "                }\n" +
            "            ]\n" +
            "        }\n" +
            "    }\n" +
            "}";

    private static String JSON_STRING_PUBLISHER_AGG = "{\n" +
            "  \"took\" : 71,\n" +
            "  \"timed_out\" : false,\n" +
            "  \"_shards\" : {\n" +
            "    \"total\" : 5,\n" +
            "    \"successful\" : 5,\n" +
            "    \"failed\" : 0\n" +
            "  },\n" +
            "  \"hits\" : {\n" +
            "    \"total\" : 81,\n" +
            "    \"max_score\" : 0.0,\n" +
            "    \"hits\" : [ ]\n" +
            "  },\n" +
            "  \"aggregations\" : {\n" +
            "    \"publisherCount\" : {\n" +
            "      \"doc_count_error_upper_bound\" : 0,\n" +
            "      \"sum_other_doc_count\" : 0,\n" +
            "      \"buckets\" : [ {\n" +
            "        \"key\" : \"" + PUBLISHER + "\",\n" +
            "        \"doc_count\" : " + NR_OF_DATASETS + "\n" +
            "      }, {\n" +
            "        \"key\" : \"registeren\",\n" +
            "        \"doc_count\" : 20\n" +
            "      } ]\n" +
            "    }\n" +
            "  }\n" +
            "}";

    @Test
    public void testConverionToDataset() {
        ElasticSearchResponse esr = new ElasticSearchResponse();

        List<Dataset> l = esr.toListOfObjects(JSON_STRING_DATASETS, Dataset.class);

        Dataset ds = l.get(0);

        assertEquals(_ID, ds.getId());
        assertEquals(BESKRIVELSE, ds.getDescription().get("nb"));
        assertEquals(TITLE, ds.getTitle().get("nb"));
    }

    @Test
    public void toMapOfObects_themeCount_mapOfKeyAndDocCount() throws Exception {
        ElasticSearchResponse esr = new ElasticSearchResponse();

        Map<String, Integer> result = esr.toMapOfObjects(THEME_COUNT, "theme_count", "doc_count", Integer.class);

        assertThat(result.get("GOVE"), is(49));
        assertThat(result.get("TRAN"), is(9));
    }


    @Test
    public void testConverionAggPublisher() {
        ElasticSearchResponse esr = new ElasticSearchResponse();

        Map<String, String> l = esr.toMapOfStrings(JSON_STRING_PUBLISHER_AGG);

        String ads = l.get(PUBLISHER);

        assertEquals(NR_OF_DATASETS, ads);
    }
}