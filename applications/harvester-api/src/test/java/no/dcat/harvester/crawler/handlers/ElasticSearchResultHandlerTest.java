package no.dcat.harvester.crawler.handlers;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import no.dcat.datastore.domain.harvest.DatasetHarvestRecord;
import no.dcat.datastore.domain.harvest.DatasetLookup;
import no.dcat.shared.Dataset;
import no.dcat.shared.Distribution;
import no.dcat.shared.Publisher;
import org.apache.jena.rdf.model.Model;
import org.apache.jena.util.FileManager;
import org.elasticsearch.action.get.GetRequestBuilder;
import org.elasticsearch.action.get.GetResponse;
import org.elasticsearch.client.Client;
import org.junit.Before;
import org.junit.Test;
import org.mockito.Mockito;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import static org.junit.Assert.*;
import static org.hamcrest.Matchers.*;
import static org.mockito.Mockito.*;

public class ElasticSearchResultHandlerTest {
    private static Logger logger = LoggerFactory.getLogger(ElasticSearchResultHandlerTest.class);

    @Test
    public void delete() throws Throwable {

        Set<String> valid = new HashSet<>();
        valid.add("http://data.brreg.no/datakatalog/dataset/971040823/28");
        valid.add("http://data.brreg.no/datakatalog/dataset/971040823/27");

        assertThat(valid.contains("http://data.brreg.no/datakatalog/dataset/971040823/28"), is(true));

        valid.remove("http://data.brreg.no/datakatalog/dataset/971040823/27");

        assertThat(valid.size(), is(1));
    }

    String msgs = "[\n" +
            "\"[validation_summary] 0 errors, 32 warnings and 0 other messages \",\n" +
            "\"[validation_warning] ValidationError{className\\u003d\\u0027License Document\\u0027, ruleId\\u003d166, ruleSeverity\\u003dwarning, ruleDescription\\u003d\\u0027dct:LicenseDocument does not exist.\\u0027, message\\u003d\\u0027The recommended class dct:LicenseDocument does not exist.\\u0027, subject\\u003dnull, predicate\\u003dnull, object\\u003dnull}, crawler_id\\u003dhttp://dcat.difi.no/dcatSource_1815c610-e5b1-4fd5-8fb6-eb3dcd7c1e9a, crawler_name\\u003ddatanorge, crawler_url\\u003dhttp://data.norge.no/api/dcat2/991825827/data.jsonld, crawler_user\\u003dtest_admin\",\n" +
            "\"[validation_warning] ValidationError{className\\u003d\\u0027Agent\\u0027, ruleId\\u003d2, ruleSeverity\\u003dwarning, ruleDescription\\u003d\\u0027dct:type is a recommended property for Agent.\\u0027, message\\u003d\\u0027The foaf:Agent http://data.brreg.no/enhetsregisteret/enhet/972417858 does not have a dct:type property.\\u0027, subject\\u003dhttp://data.brreg.no/enhetsregisteret/enhet/972417858, predicate\\u003dhttp://www.w3.org/1999/02/22-rdf-syntax-ns#type, object\\u003dhttp://xmlns.com/foaf/0.1/Agent}, crawler_id\\u003dhttp://dcat.difi.no/dcatSource_1815c610-e5b1-4fd5-8fb6-eb3dcd7c1e9a, crawler_name\\u003ddatanorge, crawler_url\\u003dhttp://data.norge.no/api/dcat2/991825827/data.jsonld, crawler_user\\u003dtest_admin\",\n" +
            "\"[validation_warning] ValidationError{className\\u003d\\u0027Catalog\\u0027, ruleId\\u003d21, ruleSeverity\\u003dwarning, ruleDescription\\u003d\\u0027dct:license is a recommended property for Catalog.\\u0027, message\\u003d\\u0027The dcat:Catalog http://www.w3.org/ns/dcat#Catalog does not have dct:license.\\u0027, subject\\u003dhttp://data.norge.no/api/dcat2/991825827/data.jsonld, predicate\\u003dhttp://www.w3.org/1999/02/22-rdf-syntax-ns#type, object\\u003dhttp://www.w3.org/ns/dcat#Catalog}, crawler_id\\u003dhttp://dcat.difi.no/dcatSource_1815c610-e5b1-4fd5-8fb6-eb3dcd7c1e9a, crawler_name\\u003ddatanorge, crawler_url\\u003dhttp://data.norge.no/api/dcat2/991825827/data.jsonld, crawler_user\\u003dtest_admin\",\n" +
            "\"[validation_warning] ValidationError{className\\u003d\\u0027Catalog\\u0027, ruleId\\u003d24, ruleSeverity\\u003dwarning, ruleDescription\\u003d\\u0027dct:issued is a recommended property for Catalog.\\u0027, message\\u003d\\u0027The dcat:Catalog http://www.w3.org/ns/dcat#Catalog does not have a dct:issued property.\\u0027, subject\\u003dhttp://data.norge.no/api/dcat2/991825827/data.jsonld, predicate\\u003dhttp://www.w3.org/1999/02/22-rdf-syntax-ns#type, object\\u003dhttp://www.w3.org/ns/dcat#Catalog}, crawler_id\\u003dhttp://dcat.difi.no/dcatSource_1815c610-e5b1-4fd5-8fb6-eb3dcd7c1e9a, crawler_name\\u003ddatanorge, crawler_url\\u003dhttp://data.norge.no/api/dcat2/991825827/data.jsonld, crawler_user\\u003dtest_admin\",\n" +
            "\"[validation_warning] ValidationError{className\\u003d\\u0027Dataset\\u0027, ruleId\\u003d44, ruleSeverity\\u003dwarning, ruleDescription\\u003d\\u0027dcat:distribution is a recommended property for Dataset.\\u0027, message\\u003d\\u0027The dcat:Dataset http://www.w3.org/ns/dcat#Dataset does not have a dcat:distribution property.\\u0027, subject\\u003dhttp://data.norge.no/node/215, predicate\\u003dhttp://www.w3.org/1999/02/22-rdf-syntax-ns#type, object\\u003dhttp://www.w3.org/ns/dcat#Dataset}, crawler_id\\u003dhttp://dcat.difi.no/dcatSource_1815c610-e5b1-4fd5-8fb6-eb3dcd7c1e9a, crawler_name\\u003ddatanorge, crawler_url\\u003dhttp://data.norge.no/api/dcat2/991825827/data.jsonld, crawler_user\\u003dtest_admin\",\n" +
            "\"[validation_warning] ValidationError{className\\u003d\\u0027Dataset\\u0027, ruleId\\u003d47, ruleSeverity\\u003dwarning, ruleDescription\\u003d\\u0027dcat:keyword is a recommended property for Dataset.\\u0027, message\\u003d\\u0027The dcat:Dataset http://www.w3.org/ns/dcat#Dataset does not have a dcat:keyword property.\\u0027, subject\\u003dhttp://data.norge.no/node/2121, predicate\\u003dhttp://www.w3.org/1999/02/22-rdf-syntax-ns#type, object\\u003dhttp://www.w3.org/ns/dcat#Dataset}, crawler_id\\u003dhttp://dcat.difi.no/dcatSource_1815c610-e5b1-4fd5-8fb6-eb3dcd7c1e9a, crawler_name\\u003ddatanorge, crawler_url\\u003dhttp://data.norge.no/api/dcat2/991825827/data.jsonld, crawler_user\\u003dtest_admin\",\n" +
            "\"[validation_warning] ValidationError{className\\u003d\\u0027Distribution\\u0027, ruleId\\u003d85, ruleSeverity\\u003dwarning, ruleDescription\\u003d\\u0027dct:format has maximum cardinality of 1 for Distribution.\\u0027, message\\u003d\\u0027The dcat:Distribution http://data.norge.no/node/2012 has more than 1 dct:format.\\u0027, subject\\u003dhttp://data.norge.no/node/2012, predicate\\u003dhttp://www.w3.org/1999/02/22-rdf-syntax-ns#type, object\\u003dhttp://www.w3.org/ns/dcat#Distribution}, crawler_id\\u003dhttp://dcat.difi.no/dcatSource_1815c610-e5b1-4fd5-8fb6-eb3dcd7c1e9a, crawler_name\\u003ddatanorge, crawler_url\\u003dhttp://data.norge.no/api/dcat2/991825827/data.jsonld, crawler_user\\u003dtest_admin\",\n" +
            "\"[validation_warning] ValidationError{className\\u003d\\u0027Distribution\\u0027, ruleId\\u003d85, ruleSeverity\\u003dwarning, ruleDescription\\u003d\\u0027dct:format has maximum cardinality of 1 for Distribution.\\u0027, message\\u003d\\u0027The dcat:Distribution http://data.norge.no/node/765 has more than 1 dct:format.\\u0027, subject\\u003dhttp://data.norge.no/node/765, predicate\\u003dhttp://www.w3.org/1999/02/22-rdf-syntax-ns#type, object\\u003dhttp://www.w3.org/ns/dcat#Distribution}, crawler_id\\u003dhttp://dcat.difi.no/dcatSource_1815c610-e5b1-4fd5-8fb6-eb3dcd7c1e9a, crawler_name\\u003ddatanorge, crawler_url\\u003dhttp://data.norge.no/api/dcat2/991825827/data.jsonld, crawler_user\\u003dtest_admin\",\n" +
            "\"[validation_warning] ValidationError{className\\u003d\\u0027Distribution\\u0027, ruleId\\u003d85, ruleSeverity\\u003dwarning, ruleDescription\\u003d\\u0027dct:format has maximum cardinality of 1 for Distribution.\\u0027, message\\u003d\\u0027The dcat:Distribution http://data.norge.no/node/711 has more than 1 dct:format.\\u0027, subject\\u003dhttp://data.norge.no/node/711, predicate\\u003dhttp://www.w3.org/1999/02/22-rdf-syntax-ns#type, object\\u003dhttp://www.w3.org/ns/dcat#Distribution}, crawler_id\\u003dhttp://dcat.difi.no/dcatSource_1815c610-e5b1-4fd5-8fb6-eb3dcd7c1e9a, crawler_name\\u003ddatanorge, crawler_url\\u003dhttp://data.norge.no/api/dcat2/991825827/data.jsonld, crawler_user\\u003dtest_admin\",\n" +
            "\"[validation_warning] ValidationError{className\\u003d\\u0027Distribution\\u0027, ruleId\\u003d85, ruleSeverity\\u003dwarning, ruleDescription\\u003d\\u0027dct:format has maximum cardinality of 1 for Distribution.\\u0027, message\\u003d\\u0027The dcat:Distribution http://data.norge.no/node/965 has more than 1 dct:format.\\u0027, subject\\u003dhttp://data.norge.no/node/965, predicate\\u003dhttp://www.w3.org/1999/02/22-rdf-syntax-ns#type, object\\u003dhttp://www.w3.org/ns/dcat#Distribution}, crawler_id\\u003dhttp://dcat.difi.no/dcatSource_1815c610-e5b1-4fd5-8fb6-eb3dcd7c1e9a, crawler_name\\u003ddatanorge, crawler_url\\u003dhttp://data.norge.no/api/dcat2/991825827/data.jsonld, crawler_user\\u003dtest_admin\",\n" +
            "\"[validation_warning] ValidationError{className\\u003d\\u0027Distribution\\u0027, ruleId\\u003d85, ruleSeverity\\u003dwarning, ruleDescription\\u003d\\u0027dct:format has maximum cardinality of 1 for Distribution.\\u0027, message\\u003d\\u0027The dcat:Distribution http://data.norge.no/node/967 has more than 1 dct:format.\\u0027, subject\\u003dhttp://data.norge.no/node/967, predicate\\u003dhttp://www.w3.org/1999/02/22-rdf-syntax-ns#type, object\\u003dhttp://www.w3.org/ns/dcat#Distribution}, crawler_id\\u003dhttp://dcat.difi.no/dcatSource_1815c610-e5b1-4fd5-8fb6-eb3dcd7c1e9a, crawler_name\\u003ddatanorge, crawler_url\\u003dhttp://data.norge.no/api/dcat2/991825827/data.jsonld, crawler_user\\u003dtest_admin\",\n" +
            "\"[validation_warning] ValidationError{className\\u003d\\u0027Distribution\\u0027, ruleId\\u003d85, ruleSeverity\\u003dwarning, ruleDescription\\u003d\\u0027dct:format has maximum cardinality of 1 for Distribution.\\u0027, message\\u003d\\u0027The dcat:Distribution http://data.norge.no/node/757 has more than 1 dct:format.\\u0027, subject\\u003dhttp://data.norge.no/node/757, predicate\\u003dhttp://www.w3.org/1999/02/22-rdf-syntax-ns#type, object\\u003dhttp://www.w3.org/ns/dcat#Distribution}, crawler_id\\u003dhttp://dcat.difi.no/dcatSource_1815c610-e5b1-4fd5-8fb6-eb3dcd7c1e9a, crawler_name\\u003ddatanorge, crawler_url\\u003dhttp://data.norge.no/api/dcat2/991825827/data.jsonld, crawler_user\\u003dtest_admin\",\n" +
            "\"[validation_warning] ValidationError{className\\u003d\\u0027Distribution\\u0027, ruleId\\u003d85, ruleSeverity\\u003dwarning, ruleDescription\\u003d\\u0027dct:format has maximum cardinality of 1 for Distribution.\\u0027, message\\u003d\\u0027The dcat:Distribution http://data.norge.no/node/933 has more than 1 dct:format.\\u0027, subject\\u003dhttp://data.norge.no/node/933, predicate\\u003dhttp://www.w3.org/1999/02/22-rdf-syntax-ns#type, object\\u003dhttp://www.w3.org/ns/dcat#Distribution}, crawler_id\\u003dhttp://dcat.difi.no/dcatSource_1815c610-e5b1-4fd5-8fb6-eb3dcd7c1e9a, crawler_name\\u003ddatanorge, crawler_url\\u003dhttp://data.norge.no/api/dcat2/991825827/data.jsonld, crawler_user\\u003dtest_admin\",\n" +
            "\"[validation_warning] ValidationError{className\\u003d\\u0027Distribution\\u0027, ruleId\\u003d85, ruleSeverity\\u003dwarning, ruleDescription\\u003d\\u0027dct:format has maximum cardinality of 1 for Distribution.\\u0027, message\\u003d\\u0027The dcat:Distribution http://data.norge.no/node/1652 has more than 1 dct:format.\\u0027, subject\\u003dhttp://data.norge.no/node/1652, predicate\\u003dhttp://www.w3.org/1999/02/22-rdf-syntax-ns#type, object\\u003dhttp://www.w3.org/ns/dcat#Distribution}, crawler_id\\u003dhttp://dcat.difi.no/dcatSource_1815c610-e5b1-4fd5-8fb6-eb3dcd7c1e9a, crawler_name\\u003ddatanorge, crawler_url\\u003dhttp://data.norge.no/api/dcat2/991825827/data.jsonld, crawler_user\\u003dtest_admin\",\n" +
            "\"[validation_warning] ValidationError{className\\u003d\\u0027Distribution\\u0027, ruleId\\u003d85, ruleSeverity\\u003dwarning, ruleDescription\\u003d\\u0027dct:format has maximum cardinality of 1 for Distribution.\\u0027, message\\u003d\\u0027The dcat:Distribution http://data.norge.no/node/1234 has more than 1 dct:format.\\u0027, subject\\u003dhttp://data.norge.no/node/1234, predicate\\u003dhttp://www.w3.org/1999/02/22-rdf-syntax-ns#type, object\\u003dhttp://www.w3.org/ns/dcat#Distribution}, crawler_id\\u003dhttp://dcat.difi.no/dcatSource_1815c610-e5b1-4fd5-8fb6-eb3dcd7c1e9a, crawler_name\\u003ddatanorge, crawler_url\\u003dhttp://data.norge.no/api/dcat2/991825827/data.jsonld, crawler_user\\u003dtest_admin\",\n" +
            "\"[validation_warning] ValidationError{className\\u003d\\u0027Distribution\\u0027, ruleId\\u003d85, ruleSeverity\\u003dwarning, ruleDescription\\u003d\\u0027dct:format has maximum cardinality of 1 for Distribution.\\u0027, message\\u003d\\u0027The dcat:Distribution http://data.norge.no/node/1355 has more than 1 dct:format.\\u0027, subject\\u003dhttp://data.norge.no/node/1355, predicate\\u003dhttp://www.w3.org/1999/02/22-rdf-syntax-ns#type, object\\u003dhttp://www.w3.org/ns/dcat#Distribution}, crawler_id\\u003dhttp://dcat.difi.no/dcatSource_1815c610-e5b1-4fd5-8fb6-eb3dcd7c1e9a, crawler_name\\u003ddatanorge, crawler_url\\u003dhttp://data.norge.no/api/dcat2/991825827/data.jsonld, crawler_user\\u003dtest_admin\",\n" +
            "\"[validation_warning] ValidationError{className\\u003d\\u0027Distribution\\u0027, ruleId\\u003d85, ruleSeverity\\u003dwarning, ruleDescription\\u003d\\u0027dct:format has maximum cardinality of 1 for Distribution.\\u0027, message\\u003d\\u0027The dcat:Distribution http://data.norge.no/node/1151 has more than 1 dct:format.\\u0027, subject\\u003dhttp://data.norge.no/node/1151, predicate\\u003dhttp://www.w3.org/1999/02/22-rdf-syntax-ns#type, object\\u003dhttp://www.w3.org/ns/dcat#Distribution}, crawler_id\\u003dhttp://dcat.difi.no/dcatSource_1815c610-e5b1-4fd5-8fb6-eb3dcd7c1e9a, crawler_name\\u003ddatanorge, crawler_url\\u003dhttp://data.norge.no/api/dcat2/991825827/data.jsonld, crawler_user\\u003dtest_admin\",\n" +
            "\"[validation_warning] ValidationError{className\\u003d\\u0027Distribution\\u0027, ruleId\\u003d85, ruleSeverity\\u003dwarning, ruleDescription\\u003d\\u0027dct:format has maximum cardinality of 1 for Distribution.\\u0027, message\\u003d\\u0027The dcat:Distribution http://data.norge.no/node/960 has more than 1 dct:format.\\u0027, subject\\u003dhttp://data.norge.no/node/960, predicate\\u003dhttp://www.w3.org/1999/02/22-rdf-syntax-ns#type, object\\u003dhttp://www.w3.org/ns/dcat#Distribution}, crawler_id\\u003dhttp://dcat.difi.no/dcatSource_1815c610-e5b1-4fd5-8fb6-eb3dcd7c1e9a, crawler_name\\u003ddatanorge, crawler_url\\u003dhttp://data.norge.no/api/dcat2/991825827/data.jsonld, crawler_user\\u003dtest_admin\",\n" +
            "\"[validation_warning] ValidationError{className\\u003d\\u0027Distribution\\u0027, ruleId\\u003d85, ruleSeverity\\u003dwarning, ruleDescription\\u003d\\u0027dct:format has maximum cardinality of 1 for Distribution.\\u0027, message\\u003d\\u0027The dcat:Distribution http://data.norge.no/node/962 has more than 1 dct:format.\\u0027, subject\\u003dhttp://data.norge.no/node/962, predicate\\u003dhttp://www.w3.org/1999/02/22-rdf-syntax-ns#type, object\\u003dhttp://www.w3.org/ns/dcat#Distribution}, crawler_id\\u003dhttp://dcat.difi.no/dcatSource_1815c610-e5b1-4fd5-8fb6-eb3dcd7c1e9a, crawler_name\\u003ddatanorge, crawler_url\\u003dhttp://data.norge.no/api/dcat2/991825827/data.jsonld, crawler_user\\u003dtest_admin\",\n" +
            "\"[validation_warning] ValidationError{className\\u003d\\u0027Distribution\\u0027, ruleId\\u003d85, ruleSeverity\\u003dwarning, ruleDescription\\u003d\\u0027dct:format has maximum cardinality of 1 for Distribution.\\u0027, message\\u003d\\u0027The dcat:Distribution http://data.norge.no/node/1235 has more than 1 dct:format.\\u0027, subject\\u003dhttp://data.norge.no/node/1235, predicate\\u003dhttp://www.w3.org/1999/02/22-rdf-syntax-ns#type, object\\u003dhttp://www.w3.org/ns/dcat#Distribution}, crawler_id\\u003dhttp://dcat.difi.no/dcatSource_1815c610-e5b1-4fd5-8fb6-eb3dcd7c1e9a, crawler_name\\u003ddatanorge, crawler_url\\u003dhttp://data.norge.no/api/dcat2/991825827/data.jsonld, crawler_user\\u003dtest_admin\",\n" +
            "\"[validation_warning] ValidationError{className\\u003d\\u0027Distribution\\u0027, ruleId\\u003d85, ruleSeverity\\u003dwarning, ruleDescription\\u003d\\u0027dct:format has maximum cardinality of 1 for Distribution.\\u0027, message\\u003d\\u0027The dcat:Distribution http://data.norge.no/node/1653 has more than 1 dct:format.\\u0027, subject\\u003dhttp://data.norge.no/node/1653, predicate\\u003dhttp://www.w3.org/1999/02/22-rdf-syntax-ns#type, object\\u003dhttp://www.w3.org/ns/dcat#Distribution}, crawler_id\\u003dhttp://dcat.difi.no/dcatSource_1815c610-e5b1-4fd5-8fb6-eb3dcd7c1e9a, crawler_name\\u003ddatanorge, crawler_url\\u003dhttp://data.norge.no/api/dcat2/991825827/data.jsonld, crawler_user\\u003dtest_admin\",\n" +
            "\"[validation_warning] ValidationError{className\\u003d\\u0027Distribution\\u0027, ruleId\\u003d85, ruleSeverity\\u003dwarning, ruleDescription\\u003d\\u0027dct:format has maximum cardinality of 1 for Distribution.\\u0027, message\\u003d\\u0027The dcat:Distribution http://data.norge.no/node/827 has more than 1 dct:format.\\u0027, subject\\u003dhttp://data.norge.no/node/827, predicate\\u003dhttp://www.w3.org/1999/02/22-rdf-syntax-ns#type, object\\u003dhttp://www.w3.org/ns/dcat#Distribution}, crawler_id\\u003dhttp://dcat.difi.no/dcatSource_1815c610-e5b1-4fd5-8fb6-eb3dcd7c1e9a, crawler_name\\u003ddatanorge, crawler_url\\u003dhttp://data.norge.no/api/dcat2/991825827/data.jsonld, crawler_user\\u003dtest_admin\",\n" +
            "\"[validation_warning] ValidationError{className\\u003d\\u0027Distribution\\u0027, ruleId\\u003d85, ruleSeverity\\u003dwarning, ruleDescription\\u003d\\u0027dct:format has maximum cardinality of 1 for Distribution.\\u0027, message\\u003d\\u0027The dcat:Distribution http://data.norge.no/node/1269 has more than 1 dct:format.\\u0027, subject\\u003dhttp://data.norge.no/node/1269, predicate\\u003dhttp://www.w3.org/1999/02/22-rdf-syntax-ns#type, object\\u003dhttp://www.w3.org/ns/dcat#Distribution}, crawler_id\\u003dhttp://dcat.difi.no/dcatSource_1815c610-e5b1-4fd5-8fb6-eb3dcd7c1e9a, crawler_name\\u003ddatanorge, crawler_url\\u003dhttp://data.norge.no/api/dcat2/991825827/data.jsonld, crawler_user\\u003dtest_admin\",\n" +
            "\"[validation_warning] ValidationError{className\\u003d\\u0027Distribution\\u0027, ruleId\\u003d85, ruleSeverity\\u003dwarning, ruleDescription\\u003d\\u0027dct:format has maximum cardinality of 1 for Distribution.\\u0027, message\\u003d\\u0027The dcat:Distribution http://data.norge.no/node/1277 has more than 1 dct:format.\\u0027, subject\\u003dhttp://data.norge.no/node/1277, predicate\\u003dhttp://www.w3.org/1999/02/22-rdf-syntax-ns#type, object\\u003dhttp://www.w3.org/ns/dcat#Distribution}, crawler_id\\u003dhttp://dcat.difi.no/dcatSource_1815c610-e5b1-4fd5-8fb6-eb3dcd7c1e9a, crawler_name\\u003ddatanorge, crawler_url\\u003dhttp://data.norge.no/api/dcat2/991825827/data.jsonld, crawler_user\\u003dtest_admin\",\n" +
            "\"[validation_warning] ValidationError{className\\u003d\\u0027Distribution\\u0027, ruleId\\u003d85, ruleSeverity\\u003dwarning, ruleDescription\\u003d\\u0027dct:format has maximum cardinality of 1 for Distribution.\\u0027, message\\u003d\\u0027The dcat:Distribution http://data.norge.no/node/1267 has more than 1 dct:format.\\u0027, subject\\u003dhttp://data.norge.no/node/1267, predicate\\u003dhttp://www.w3.org/1999/02/22-rdf-syntax-ns#type, object\\u003dhttp://www.w3.org/ns/dcat#Distribution}, crawler_id\\u003dhttp://dcat.difi.no/dcatSource_1815c610-e5b1-4fd5-8fb6-eb3dcd7c1e9a, crawler_name\\u003ddatanorge, crawler_url\\u003dhttp://data.norge.no/api/dcat2/991825827/data.jsonld, crawler_user\\u003dtest_admin\",\n" +
            "\"[validation_warning] ValidationError{className\\u003d\\u0027Distribution\\u0027, ruleId\\u003d85, ruleSeverity\\u003dwarning, ruleDescription\\u003d\\u0027dct:format has maximum cardinality of 1 for Distribution.\\u0027, message\\u003d\\u0027The dcat:Distribution http://data.norge.no/node/1275 has more than 1 dct:format.\\u0027, subject\\u003dhttp://data.norge.no/node/1275, predicate\\u003dhttp://www.w3.org/1999/02/22-rdf-syntax-ns#type, object\\u003dhttp://www.w3.org/ns/dcat#Distribution}, crawler_id\\u003dhttp://dcat.difi.no/dcatSource_1815c610-e5b1-4fd5-8fb6-eb3dcd7c1e9a, crawler_name\\u003ddatanorge, crawler_url\\u003dhttp://data.norge.no/api/dcat2/991825827/data.jsonld, crawler_user\\u003dtest_admin\",\n" +
            "\"[validation_warning] ValidationError{className\\u003d\\u0027Distribution\\u0027, ruleId\\u003d85, ruleSeverity\\u003dwarning, ruleDescription\\u003d\\u0027dct:format has maximum cardinality of 1 for Distribution.\\u0027, message\\u003d\\u0027The dcat:Distribution http://data.norge.no/node/1265 has more than 1 dct:format.\\u0027, subject\\u003dhttp://data.norge.no/node/1265, predicate\\u003dhttp://www.w3.org/1999/02/22-rdf-syntax-ns#type, object\\u003dhttp://www.w3.org/ns/dcat#Distribution}, crawler_id\\u003dhttp://dcat.difi.no/dcatSource_1815c610-e5b1-4fd5-8fb6-eb3dcd7c1e9a, crawler_name\\u003ddatanorge, crawler_url\\u003dhttp://data.norge.no/api/dcat2/991825827/data.jsonld, crawler_user\\u003dtest_admin\",\n" +
            "\"[validation_warning] ValidationError{className\\u003d\\u0027Distribution\\u0027, ruleId\\u003d85, ruleSeverity\\u003dwarning, ruleDescription\\u003d\\u0027dct:format has maximum cardinality of 1 for Distribution.\\u0027, message\\u003d\\u0027The dcat:Distribution http://data.norge.no/node/1273 has more than 1 dct:format.\\u0027, subject\\u003dhttp://data.norge.no/node/1273, predicate\\u003dhttp://www.w3.org/1999/02/22-rdf-syntax-ns#type, object\\u003dhttp://www.w3.org/ns/dcat#Distribution}, crawler_id\\u003dhttp://dcat.difi.no/dcatSource_1815c610-e5b1-4fd5-8fb6-eb3dcd7c1e9a, crawler_name\\u003ddatanorge, crawler_url\\u003dhttp://data.norge.no/api/dcat2/991825827/data.jsonld, crawler_user\\u003dtest_admin\",\n" +
            "\"[validation_warning] ValidationError{className\\u003d\\u0027Distribution\\u0027, ruleId\\u003d85, ruleSeverity\\u003dwarning, ruleDescription\\u003d\\u0027dct:format has maximum cardinality of 1 for Distribution.\\u0027, message\\u003d\\u0027The dcat:Distribution http://data.norge.no/node/1263 has more than 1 dct:format.\\u0027, subject\\u003dhttp://data.norge.no/node/1263, predicate\\u003dhttp://www.w3.org/1999/02/22-rdf-syntax-ns#type, object\\u003dhttp://www.w3.org/ns/dcat#Distribution}, crawler_id\\u003dhttp://dcat.difi.no/dcatSource_1815c610-e5b1-4fd5-8fb6-eb3dcd7c1e9a, crawler_name\\u003ddatanorge, crawler_url\\u003dhttp://data.norge.no/api/dcat2/991825827/data.jsonld, crawler_user\\u003dtest_admin\",\n" +
            "\"[validation_warning] ValidationError{className\\u003d\\u0027Distribution\\u0027, ruleId\\u003d85, ruleSeverity\\u003dwarning, ruleDescription\\u003d\\u0027dct:format has maximum cardinality of 1 for Distribution.\\u0027, message\\u003d\\u0027The dcat:Distribution http://data.norge.no/node/1271 has more than 1 dct:format.\\u0027, subject\\u003dhttp://data.norge.no/node/1271, predicate\\u003dhttp://www.w3.org/1999/02/22-rdf-syntax-ns#type, object\\u003dhttp://www.w3.org/ns/dcat#Distribution}, crawler_id\\u003dhttp://dcat.difi.no/dcatSource_1815c610-e5b1-4fd5-8fb6-eb3dcd7c1e9a, crawler_name\\u003ddatanorge, crawler_url\\u003dhttp://data.norge.no/api/dcat2/991825827/data.jsonld, crawler_user\\u003dtest_admin\",\n" +
            "\"[validation_warning] ValidationError{className\\u003d\\u0027Distribution\\u0027, ruleId\\u003d85, ruleSeverity\\u003dwarning, ruleDescription\\u003d\\u0027dct:format has maximum cardinality of 1 for Distribution.\\u0027, message\\u003d\\u0027The dcat:Distribution http://data.norge.no/node/1174 has more than 1 dct:format.\\u0027, subject\\u003dhttp://data.norge.no/node/1174, predicate\\u003dhttp://www.w3.org/1999/02/22-rdf-syntax-ns#type, object\\u003dhttp://www.w3.org/ns/dcat#Distribution}, crawler_id\\u003dhttp://dcat.difi.no/dcatSource_1815c610-e5b1-4fd5-8fb6-eb3dcd7c1e9a, crawler_name\\u003ddatanorge, crawler_url\\u003dhttp://data.norge.no/api/dcat2/991825827/data.jsonld, crawler_user\\u003dtest_admin\",\n" +
            "\"[validation_warning] ValidationError{className\\u003d\\u0027Distribution\\u0027, ruleId\\u003d85, ruleSeverity\\u003dwarning, ruleDescription\\u003d\\u0027dct:format has maximum cardinality of 1 for Distribution.\\u0027, message\\u003d\\u0027The dcat:Distribution http://data.norge.no/node/2148 has more than 1 dct:format.\\u0027, subject\\u003dhttp://data.norge.no/node/2148, predicate\\u003dhttp://www.w3.org/1999/02/22-rdf-syntax-ns#type, object\\u003dhttp://www.w3.org/ns/dcat#Distribution}, crawler_id\\u003dhttp://dcat.difi.no/dcatSource_1815c610-e5b1-4fd5-8fb6-eb3dcd7c1e9a, crawler_name\\u003ddatanorge, crawler_url\\u003dhttp://data.norge.no/api/dcat2/991825827/data.jsonld, crawler_user\\u003dtest_admin\"\n" +
            "]";

    private ElasticSearchResultHandler resultHandler;
    private List<String> validationMessages;

    @Before
    public void setup() {
        resultHandler = new ElasticSearchResultHandler(null, 0, null, null, null, null);
        validationMessages = new Gson().fromJson(msgs, new TypeToken<List<String>>(){}.getType());
    }

    @Test
    public void validationMessageExtractionDataset1() {
        Dataset dataset = new Dataset();
        dataset.setUri("http://data.norge.no/node/215/xxx");
        Distribution distribution = new Distribution();
        distribution.setUri("http://data.norge.no/node/960");
        dataset.setDistribution(Arrays.asList(distribution));

        List<String> actual = resultHandler.filterValidationMessagesForDataset(validationMessages, dataset);
        logger.info(actual.toString());
        assertThat("can extract validation message for distribution in dataset", actual.size(), is(1));

        dataset.setUri("http://data.norge.no/node/2121");
        dataset.setDistribution(null);
        actual = resultHandler.filterValidationMessagesForDataset(validationMessages, dataset);
        logger.info(actual.toString());

        assertThat( "Can extract validation message for dataset", actual.size(), is(1));
    }

    @Test
    public void validDistribution() throws Throwable {
        Dataset dataset = new Dataset();

        dataset.setUri("http://2");
        Distribution dist = new Distribution();
        dist.setUri("http://data.norge.no/node/960");
        dataset.setDistribution(Arrays.asList(dist));

        List<String> actual = resultHandler.filterValidationMessagesForDataset(validationMessages, dataset);

        logger.info(actual.toString());

        assertThat("Should return 1 validation messages", actual.size(), is(1));

    }

    private String datasetLookupJson = "{\"harvestUri\":\"https://kartkatalog.geonorge.no/Metadata/uuid/c23c14c6-63c4-40f4-bae4-2d40198a2f40\",\"datasetId\":\"06ae95f8-d712-4f52-9e2f-d8a6f3250bfa\"}";

    @Test
    public void findLookupDAtaset() {
        Gson gson = new Gson();
        Client client = mock(Client.class);
        GetRequestBuilder builder = mock(GetRequestBuilder.class);
        GetResponse response = mock(GetResponse.class);

        when(client.prepareGet(anyString(), anyString(), anyString())).thenReturn(builder);
        when(builder.get()).thenReturn(response);

        when(response.isExists()).thenReturn(true);
        when(response.getSourceAsString()).thenReturn(datasetLookupJson);


        DatasetLookup actual = resultHandler.findLookupDataset(client, "http://someuri", gson);

        assertThat(actual.getDatasetId(), is("06ae95f8-d712-4f52-9e2f-d8a6f3250bfa"));

    }

    @Test
    public void getDatasetUris() throws Throwable {
        Model model = FileManager.get().loadModel("ramsund.ttl");

        Set<String> actual = resultHandler.getDatasetsUris(model, "http://brreg.no/catalogs/910244132");

        assertThat("Should return 4 dataset uris", actual.size(), is(4));
    }


    @Test
    public void checkStringCompare() throws Throwable {
        assertThat(resultHandler.stringCompare(null, null), is(true));
        assertThat(resultHandler.stringCompare("hallo", null), is(false));
        assertThat(resultHandler.stringCompare(null, "hallo"), is (false));
        assertThat(resultHandler.stringCompare("hallo", "hallo"), is(true));
        assertThat(resultHandler.stringCompare("hallo", "hello"), is(false));
    }
    @Test
    public void checkCorrectOrgpath() {

        Dataset dataset = new Dataset();
        dataset.setPublisher(new Publisher());
        dataset.getPublisher().setOrgPath("/ANNET/http:...");
        dataset.getPublisher().setName("COSMO");

        assertThat(resultHandler.hasWrongOrgpath(dataset), is(true));

        resultHandler.correctOrgpath(dataset);
        assertThat(dataset.getPublisher().getOrgPath(), is("/ANNET/COSMO"));

        dataset.getPublisher().setOrgPath("/STAT/123456789/123456799");
        assertThat(resultHandler.hasWrongOrgpath(dataset), is (false));
        resultHandler.correctOrgpath(dataset);

    }

    @Test
    public void checkisJsonEqual() {

        Gson gson = new Gson();
        Dataset dataset1 = gson.fromJson(dataset1json, Dataset.class);
        Dataset dataset2 = gson.fromJson(dataset2json, Dataset.class);

        assertThat(resultHandler.isJsonEqual(dataset1, dataset2, gson), is(false));

        dataset1.setContactPoint(null);
        dataset2.setContactPoint(null);

        assertThat(resultHandler.isJsonEqual(dataset1, dataset2, gson), is(true));
    }

    @Test
    public void checkIsChanged() {
        Gson gson = new Gson();
        Dataset dataset1 = gson.fromJson(dataset1json, Dataset.class);
        Dataset dataset2 = gson.fromJson(dataset2json, Dataset.class);
        DatasetHarvestRecord record = new DatasetHarvestRecord();
        record.setDataset(dataset1);

        assertThat(resultHandler.isChanged(record, dataset2, gson), is(false));

        resultHandler.isChanged(null, dataset2, gson);
        resultHandler.isChanged(record, null, gson);

        dataset1.getPublisher().setOrgPath("/ANNET/http://fileisAll");

        resultHandler.isChanged(record, dataset2, gson);

        dataset1.setContactPoint(null);

        resultHandler.isChanged(record, dataset2, gson);

    }

    String dataset1json = "{\n" +
            "                        \"id\": \"2da6a86c-c69b-46d4-a838-12ed6922d74a\",\n" +
            "                        \"uri\": \"http://brreg.no/catalogs/910888447/datasets/b997c2b4-e6a1-4405-a2ec-62c6f98e3beb\",\n" +
            "                        \"source\": \"A\",\n" +
            "                        \"title\": {\n" +
            "                            \"nb\": \"Juledata\"\n" +
            "                        },\n" +
            "                        \"description\": {\n" +
            "                            \"nb\": \"Viktige opplysninger om julehøytiden\"\n" +
            "                        },\n" +
            "                        \"objective\": {\n" +
            "                            \"nb\": \"Test\"\n" +
            "                        },\n" +
            "                        \"contactPoint\": [\n" +
            "                            {\n" +
            "                                \"uri\": \"http://datakatalog.no/contact/export/fea7b1d1-4550-4362-a028-cfcdbc527e30\",\n" +
            "                                \"email\": \"nissen@nord.pol\",\n" +
            "                                \"organizationUnit\": \"Julenissen\",\n" +
            "                                \"hasURL\": \"http://registration-api:8080/catalogs/www.nisse.no\",\n" +
            "                                \"hasTelephone\": \"12345678\"\n" +
            "                            }\n" +
            "                        ],\n" +
            "                        \"publisher\": {\n" +
            "                            \"valid\": false,\n" +
            "                            \"uri\": \"http://data.brreg.no/enhetsregisteret/enhet/910888447\",\n" +
            "                            \"id\": \"910888447\",\n" +
            "                            \"name\": \"REINLI OG BERLEVÅG REGNSKAP\",\n" +
            "                            \"orgPath\": \"/ANNET/910888447\"\n" +
            "                        },\n" +
            "                        \"modified\": \"2017-12-01T00:00:00+0100\",\n" +
            "                        \"landingPage\": [],\n" +
            "                        \"theme\": [\n" +
            "                            {\n" +
            "                                \"id\": \"http://publications.europa.eu/resource/authority/data-theme/SOCI\",\n" +
            "                                \"code\": \"SOCI\",\n" +
            "                                \"startUse\": \"2015-10-01\",\n" +
            "                                \"title\": {\n" +
            "                                    \"bg\": \"Население и общество\",\n" +
            "                                    \"sk\": \"Obyvateľstvo a spoločnosť\",\n" +
            "                                    \"de\": \"Bevölkerung und Gesellschaft\",\n" +
            "                                    \"fr\": \"Population et société\",\n" +
            "                                    \"ro\": \"Populaţie şi societate\",\n" +
            "                                    \"lt\": \"Gyventojų skaičius ir visuomenė\",\n" +
            "                                    \"sv\": \"Befolkning och samhälle\",\n" +
            "                                    \"hr\": \"Stanovništvo i društvo\",\n" +
            "                                    \"lv\": \"Iedzīvotāji un sabiedrība\",\n" +
            "                                    \"sl\": \"Prebivalstvo in družba\",\n" +
            "                                    \"pt\": \"População e sociedade\",\n" +
            "                                    \"pl\": \"Ludność i społeczeństwo\",\n" +
            "                                    \"da\": \"Befolkning og samfund\",\n" +
            "                                    \"hu\": \"Népesség és társadalom\",\n" +
            "                                    \"es\": \"Población y sociedad\",\n" +
            "                                    \"fi\": \"Väestö ja yhteiskunta\",\n" +
            "                                    \"en\": \"Population and society\",\n" +
            "                                    \"nb\": \"Befolkning og samfunn\",\n" +
            "                                    \"it\": \"Popolazione e società\",\n" +
            "                                    \"el\": \"Πληθυσμός και κοινωνία\",\n" +
            "                                    \"et\": \"Elanikkond ja ühiskond\",\n" +
            "                                    \"nl\": \"Bevolking en samenleving\",\n" +
            "                                    \"mt\": \"Popolazzjoni u soċjetà\",\n" +
            "                                    \"cs\": \"Populace a společnost\",\n" +
            "                                    \"ga\": \"Daonra agus sochaí\"\n" +
            "                                },\n" +
            "                                \"conceptSchema\": {\n" +
            "                                    \"id\": \"http://publications.europa.eu/resource/authority/data-theme\",\n" +
            "                                    \"title\": {\n" +
            "                                        \"en\": \"Dataset types Named Authority List\"\n" +
            "                                    },\n" +
            "                                    \"versioninfo\": \"20160921-0\",\n" +
            "                                    \"versionnumber\": \"20160921-0\"\n" +
            "                                }\n" +
            "                            }\n" +
            "                        ],\n" +
            "                        \"accessRights\": {\n" +
            "                            \"uri\": \"http://publications.europa.eu/resource/authority/access-right/PUBLIC\",\n" +
            "                            \"code\": \"PUBLIC\",\n" +
            "                            \"prefLabel\": {\n" +
            "                                \"en\": \"Public\",\n" +
            "                                \"nb\": \"Offentlig\",\n" +
            "                                \"nn\": \"Offentlig\"\n" +
            "                            }\n" +
            "                        },\n" +
            "                        \"hasAccuracyAnnotation\": {\n" +
            "                            \"inDimension\": \"http://iso.org/25012/2008/dataquality/Accuracy\",\n" +
            "                            \"hasBody\": {\n" +
            "                                \"no\": \"Kun om julen. Varer ikke helt til påske.\"\n" +
            "                            }\n" +
            "                        },\n" +
            "                        \"hasCompletenessAnnotation\": {\n" +
            "                            \"inDimension\": \"http://iso.org/25012/2008/dataquality/Completeness\",\n" +
            "                            \"hasBody\": {\n" +
            "                                \"no\": \"Alt om julen\"\n" +
            "                            }\n" +
            "                        },\n" +
            "                        \"hasAvailabilityAnnotation\": {\n" +
            "                            \"inDimension\": \"http://iso.org/25012/2008/dataquality/Availability\",\n" +
            "                            \"hasBody\": {\n" +
            "                                \"no\": \"Tilgjengelig kun i desember.\"\n" +
            "                            }\n" +
            "                        },\n" +
            "                        \"hasRelevanceAnnotation\": {\n" +
            "                            \"inDimension\": \"http://iso.org/25012/2008/dataquality/Relevance\",\n" +
            "                            \"hasBody\": {\n" +
            "                                \"no\": \"Relevant i adventstiden\"\n" +
            "                            }\n" +
            "                        },\n" +
            "                        \"provenance\": {\n" +
            "                            \"uri\": \"http://data.brreg.no/datakatalog/provinens/vedtak\",\n" +
            "                            \"code\": \"VEDTAK\",\n" +
            "                            \"prefLabel\": {\n" +
            "                                \"en\": \"Governmental decisions\",\n" +
            "                                \"nb\": \"Vedtak\",\n" +
            "                                \"nn\": \"Vedtak\"\n" +
            "                            }\n" +
            "                        },\n" +
            "                        \"accrualPeriodicity\": {\n" +
            "                            \"uri\": \"http://publications.europa.eu/resource/authority/frequency/ANNUAL\",\n" +
            "                            \"code\": \"ANNUAL\",\n" +
            "                            \"prefLabel\": {\n" +
            "                                \"de\": \"jährlich\",\n" +
            "                                \"lv\": \"reizi gadā\",\n" +
            "                                \"bg\": \"годишен\",\n" +
            "                                \"nl\": \"jaarlijks\",\n" +
            "                                \"sk\": \"ročný\",\n" +
            "                                \"no\": \"årlig\",\n" +
            "                                \"sv\": \"årlig\",\n" +
            "                                \"pl\": \"roczny\",\n" +
            "                                \"hr\": \"godišnje\",\n" +
            "                                \"sl\": \"letni\",\n" +
            "                                \"fi\": \"vuotuinen\",\n" +
            "                                \"mt\": \"annwali\",\n" +
            "                                \"lt\": \"kasmetinis\",\n" +
            "                                \"fr\": \"annuel\",\n" +
            "                                \"ga\": \"bliantúil\",\n" +
            "                                \"da\": \"årligt\",\n" +
            "                                \"et\": \"aastane\",\n" +
            "                                \"pt\": \"anual\",\n" +
            "                                \"ro\": \"anual\",\n" +
            "                                \"es\": \"anual\",\n" +
            "                                \"el\": \"ετήσιος\",\n" +
            "                                \"en\": \"annual\",\n" +
            "                                \"cs\": \"roční\",\n" +
            "                                \"it\": \"annuale\",\n" +
            "                                \"hu\": \"évenkénti\"\n" +
            "                            }\n" +
            "                        },\n" +
            "                        \"subject\": [\n" +
            "                            {\n" +
            "                                \"uri\": \"https://data-david.github.io/Begrep/begrep/Enhet\",\n" +
            "                                \"identifier\": \"https://data-david.github.io/Begrep/begrep/Enhet\",\n" +
            "                                \"prefLabel\": {\n" +
            "                                    \"no\": \"enhet\"\n" +
            "                                },\n" +
            "                                \"definition\": {\n" +
            "                                    \"no\": \"alt som er registrert med et organisasjonsnummer \"\n" +
            "                                },\n" +
            "                                \"note\": {\n" +
            "                                    \"no\": \"Alle hovedenheter, underenheter og organisasjonsledd som er identifisert med et organisasjonsnummer.\"\n" +
            "                                },\n" +
            "                                \"source\": \"https://jira.brreg.no/browse/BEGREP-208\",\n" +
            "                                \"creator\": {\n" +
            "                                    \"overordnetEnhet\": \"912660680\",\n" +
            "                                    \"organisasjonsform\": \"ORGL\",\n" +
            "                                    \"naeringskode\": {\n" +
            "                                        \"uri\": \"http://www.ssb.no/nace/sn2007/84.110\",\n" +
            "                                        \"code\": \"84.110\",\n" +
            "                                        \"prefLabel\": {\n" +
            "                                            \"no\": \"Generell offentlig administrasjon\"\n" +
            "                                        }\n" +
            "                                    },\n" +
            "                                    \"sektorkode\": {\n" +
            "                                        \"uri\": \"http://www.brreg.no/sektorkode/6100\",\n" +
            "                                        \"code\": \"6100\",\n" +
            "                                        \"prefLabel\": {\n" +
            "                                            \"no\": \"Statsforvaltningen\"\n" +
            "                                        }\n" +
            "                                    },\n" +
            "                                    \"valid\": true,\n" +
            "                                    \"uri\": \"http://data.brreg.no/enhetsregisteret/enhet/974760673\",\n" +
            "                                    \"id\": \"974760673\",\n" +
            "                                    \"name\": \"Brønnøysundregistrene\",\n" +
            "                                    \"orgPath\": \"/STAT/912660680/974760673\"\n" +
            "                                },\n" +
            "                                \"inScheme\": [\n" +
            "                                    \"http://data-david.github.io/vokabular/Befolkning\"\n" +
            "                                ]\n" +
            "                            }\n" +
            "                        ],\n" +
            "                        \"conformsTo\": [\n" +
            "                            {\n" +
            "                                \"uri\": \"http://www.nisse.no\",\n" +
            "                                \"prefLabel\": {\n" +
            "                                    \"nb\": \"Julestandarden\"\n" +
            "                                },\n" +
            "                                \"extraType\": \"http://purl.org/dc/terms/Standard\"\n" +
            "                            }\n" +
            "                        ],\n" +
            "                        \"type\": \"Data\",\n" +
            "                        \"catalog\": {\n" +
            "                            \"id\": \"910888447\",\n" +
            "                            \"uri\": \"http://brreg.no/catalogs/910888447\",\n" +
            "                            \"title\": {\n" +
            "                                \"nb\": \"Datakatalog for REINLI OG BERLEVÅG REGNSKAP\"\n" +
            "                            },\n" +
            "                            \"description\": {\n" +
            "                                \"nb\": \"Datasettbeskrivelser\\n\"\n" +
            "                            },\n" +
            "                            \"publisher\": {\n" +
            "                                \"valid\": false,\n" +
            "                                \"uri\": \"http://data.brreg.no/enhetsregisteret/enhet/910888447\",\n" +
            "                                \"id\": \"910888447\",\n" +
            "                                \"name\": \"REINLI OG BERLEVÅG REGNSKAP\",\n" +
            "                                \"orgPath\": \"/ANNET/910888447\"\n" +
            "                            }\n" +
            "                        }\n" +
            "                    }";

    String dataset2json = "{\n" +
            "\"id\": \"2da6a86c-c69b-46d4-a838-12ed6922d74a\",\n" +
            "\"uri\": \"http://brreg.no/catalogs/910888447/datasets/b997c2b4-e6a1-4405-a2ec-62c6f98e3beb\",\n" +
            "\"source\": \"A\",\n" +
            "\"title\": {\n" +
            "\"nb\": \"Juledata\"\n" +
            "},\n" +
            "\"description\": {\n" +
            "\"nb\": \"Viktige opplysninger om julehøytiden\"\n" +
            "},\n" +
            "\"objective\": {\n" +
            "\"nb\": \"Test\"\n" +
            "},\n" +
            "\"contactPoint\": [\n" +
            "{\n" +
            "\"uri\": \"http://datakatalog.no/contact/export/9ff0f0b7-7dfe-4105-a02c-599ffe2ef31c\",\n" +
            "\"email\": \"nissen@nord.pol\",\n" +
            "\"organizationUnit\": \"Julenissen\",\n" +
            "\"hasURL\": \"http://registration-api:8080/catalogs/www.nisse.no\",\n" +
            "\"hasTelephone\": \"12345678\"\n" +
            "}\n" +
            "],\n" +
            "\"publisher\": {\n" +
            "\"valid\": false,\n" +
            "\"uri\": \"http://data.brreg.no/enhetsregisteret/enhet/910888447\",\n" +
            "\"id\": \"910888447\",\n" +
            "\"name\": \"REINLI OG BERLEVÅG REGNSKAP\",\n" +
            "\"orgPath\": \"/ANNET/910888447\"\n" +
            "},\n" +
            "\"modified\": \"2017-12-01T00:00:00+0100\",\n" +
            "\"landingPage\": [],\n" +
            "\"theme\": [\n" +
            "{\n" +
            "\"id\": \"http://publications.europa.eu/resource/authority/data-theme/SOCI\",\n" +
            "\"code\": \"SOCI\",\n" +
            "\"startUse\": \"2015-10-01\",\n" +
            "\"title\": {\n" +
            "\"bg\": \"Население и общество\",\n" +
            "\"sk\": \"Obyvateľstvo a spoločnosť\",\n" +
            "\"de\": \"Bevölkerung und Gesellschaft\",\n" +
            "\"fr\": \"Population et société\",\n" +
            "\"ro\": \"Populaţie şi societate\",\n" +
            "\"lt\": \"Gyventojų skaičius ir visuomenė\",\n" +
            "\"sv\": \"Befolkning och samhälle\",\n" +
            "\"hr\": \"Stanovništvo i društvo\",\n" +
            "\"lv\": \"Iedzīvotāji un sabiedrība\",\n" +
            "\"sl\": \"Prebivalstvo in družba\",\n" +
            "\"pt\": \"População e sociedade\",\n" +
            "\"pl\": \"Ludność i społeczeństwo\",\n" +
            "\"da\": \"Befolkning og samfund\",\n" +
            "\"hu\": \"Népesség és társadalom\",\n" +
            "\"es\": \"Población y sociedad\",\n" +
            "\"fi\": \"Väestö ja yhteiskunta\",\n" +
            "\"en\": \"Population and society\",\n" +
            "\"nb\": \"Befolkning og samfunn\",\n" +
            "\"it\": \"Popolazione e società\",\n" +
            "\"el\": \"Πληθυσμός και κοινωνία\",\n" +
            "\"et\": \"Elanikkond ja ühiskond\",\n" +
            "\"nl\": \"Bevolking en samenleving\",\n" +
            "\"mt\": \"Popolazzjoni u soċjetà\",\n" +
            "\"cs\": \"Populace a společnost\",\n" +
            "\"ga\": \"Daonra agus sochaí\"\n" +
            "},\n" +
            "\"conceptSchema\": {\n" +
            "\"id\": \"http://publications.europa.eu/resource/authority/data-theme\",\n" +
            "\"title\": {\n" +
            "\"en\": \"Dataset types Named Authority List\"\n" +
            "},\n" +
            "\"versioninfo\": \"20160921-0\",\n" +
            "\"versionnumber\": \"20160921-0\"\n" +
            "}\n" +
            "}\n" +
            "],\n" +
            "\"accessRights\": {\n" +
            "\"uri\": \"http://publications.europa.eu/resource/authority/access-right/PUBLIC\",\n" +
            "\"code\": \"PUBLIC\",\n" +
            "\"prefLabel\": {\n" +
            "\"en\": \"Public\",\n" +
            "\"nb\": \"Offentlig\",\n" +
            "\"nn\": \"Offentlig\"\n" +
            "}\n" +
            "},\n" +
            "\"hasAccuracyAnnotation\": {\n" +
            "\"inDimension\": \"http://iso.org/25012/2008/dataquality/Accuracy\",\n" +
            "\"hasBody\": {\n" +
            "\"no\": \"Kun om julen. Varer ikke helt til påske.\"\n" +
            "}\n" +
            "},\n" +
            "\"hasCompletenessAnnotation\": {\n" +
            "\"inDimension\": \"http://iso.org/25012/2008/dataquality/Completeness\",\n" +
            "\"hasBody\": {\n" +
            "\"no\": \"Alt om julen\"\n" +
            "}\n" +
            "},\n" +
            "\"hasAvailabilityAnnotation\": {\n" +
            "\"inDimension\": \"http://iso.org/25012/2008/dataquality/Availability\",\n" +
            "\"hasBody\": {\n" +
            "\"no\": \"Tilgjengelig kun i desember.\"\n" +
            "}\n" +
            "},\n" +
            "\"hasRelevanceAnnotation\": {\n" +
            "\"inDimension\": \"http://iso.org/25012/2008/dataquality/Relevance\",\n" +
            "\"hasBody\": {\n" +
            "\"no\": \"Relevant i adventstiden\"\n" +
            "}\n" +
            "},\n" +
            "\"provenance\": {\n" +
            "\"uri\": \"http://data.brreg.no/datakatalog/provinens/vedtak\",\n" +
            "\"code\": \"VEDTAK\",\n" +
            "\"prefLabel\": {\n" +
            "\"en\": \"Governmental decisions\",\n" +
            "\"nb\": \"Vedtak\",\n" +
            "\"nn\": \"Vedtak\"\n" +
            "}\n" +
            "},\n" +
            "\"accrualPeriodicity\": {\n" +
            "\"uri\": \"http://publications.europa.eu/resource/authority/frequency/ANNUAL\",\n" +
            "\"code\": \"ANNUAL\",\n" +
            "\"prefLabel\": {\n" +
            "\"de\": \"jährlich\",\n" +
            "\"lv\": \"reizi gadā\",\n" +
            "\"bg\": \"годишен\",\n" +
            "\"nl\": \"jaarlijks\",\n" +
            "\"sk\": \"ročný\",\n" +
            "\"no\": \"årlig\",\n" +
            "\"sv\": \"årlig\",\n" +
            "\"pl\": \"roczny\",\n" +
            "\"hr\": \"godišnje\",\n" +
            "\"sl\": \"letni\",\n" +
            "\"fi\": \"vuotuinen\",\n" +
            "\"mt\": \"annwali\",\n" +
            "\"lt\": \"kasmetinis\",\n" +
            "\"fr\": \"annuel\",\n" +
            "\"ga\": \"bliantúil\",\n" +
            "\"da\": \"årligt\",\n" +
            "\"et\": \"aastane\",\n" +
            "\"pt\": \"anual\",\n" +
            "\"ro\": \"anual\",\n" +
            "\"es\": \"anual\",\n" +
            "\"el\": \"ετήσιος\",\n" +
            "\"en\": \"annual\",\n" +
            "\"cs\": \"roční\",\n" +
            "\"it\": \"annuale\",\n" +
            "\"hu\": \"évenkénti\"\n" +
            "}\n" +
            "},\n" +
            "\"subject\": [\n" +
            "{\n" +
            "\"uri\": \"https://data-david.github.io/Begrep/begrep/Enhet\",\n" +
            "\"identifier\": \"https://data-david.github.io/Begrep/begrep/Enhet\",\n" +
            "\"prefLabel\": {\n" +
            "\"no\": \"enhet\"\n" +
            "},\n" +
            "\"definition\": {\n" +
            "\"no\": \"alt som er registrert med et organisasjonsnummer \"\n" +
            "},\n" +
            "\"note\": {\n" +
            "\"no\": \"Alle hovedenheter, underenheter og organisasjonsledd som er identifisert med et organisasjonsnummer.\"\n" +
            "},\n" +
            "\"source\": \"https://jira.brreg.no/browse/BEGREP-208\",\n" +
            "\"creator\": {\n" +
            "\"overordnetEnhet\": \"912660680\",\n" +
            "\"organisasjonsform\": \"ORGL\",\n" +
            "\"naeringskode\": {\n" +
            "\"uri\": \"http://www.ssb.no/nace/sn2007/84.110\",\n" +
            "\"code\": \"84.110\",\n" +
            "\"prefLabel\": {\n" +
            "\"no\": \"Generell offentlig administrasjon\"\n" +
            "}\n" +
            "},\n" +
            "\"sektorkode\": {\n" +
            "\"uri\": \"http://www.brreg.no/sektorkode/6100\",\n" +
            "\"code\": \"6100\",\n" +
            "\"prefLabel\": {\n" +
            "\"no\": \"Statsforvaltningen\"\n" +
            "}\n" +
            "},\n" +
            "\"valid\": true,\n" +
            "\"uri\": \"http://data.brreg.no/enhetsregisteret/enhet/974760673\",\n" +
            "\"id\": \"974760673\",\n" +
            "\"name\": \"Brønnøysundregistrene\",\n" +
            "\"orgPath\": \"/STAT/912660680/974760673\"\n" +
            "},\n" +
            "\"inScheme\": [\n" +
            "\"http://data-david.github.io/vokabular/Befolkning\"\n" +
            "]\n" +
            "}\n" +
            "],\n" +
            "\"conformsTo\": [\n" +
            "{\n" +
            "\"uri\": \"http://www.nisse.no\",\n" +
            "\"prefLabel\": {\n" +
            "\"nb\": \"Julestandarden\"\n" +
            "},\n" +
            "\"extraType\": \"http://purl.org/dc/terms/Standard\"\n" +
            "}\n" +
            "],\n" +
            "\"type\": \"Data\",\n" +
            "\"catalog\": {\n" +
            "\"id\": \"910888447\",\n" +
            "\"uri\": \"http://brreg.no/catalogs/910888447\",\n" +
            "\"title\": {\n" +
            "\"nb\": \"Datakatalog for REINLI OG BERLEVÅG REGNSKAP\"\n" +
            "},\n" +
            "\"description\": {\n" +
            "\"nb\": \"Datasettbeskrivelser\\n\"\n" +
            "},\n" +
            "\"publisher\": {\n" +
            "\"valid\": false,\n" +
            "\"uri\": \"http://data.brreg.no/enhetsregisteret/enhet/910888447\",\n" +
            "\"id\": \"910888447\",\n" +
            "\"name\": \"REINLI OG BERLEVÅG REGNSKAP\",\n" +
            "\"orgPath\": \"/ANNET/910888447\"\n" +
            "}\n" +
            "}\n" +
            "}";
}
