package no.dcat.testadmin;

import no.dcat.datastore.Elasticsearch;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import javax.annotation.PostConstruct;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.List;

/**
 * Created by nodavsko on 02.11.2016.
 */
@Controller
public class TestAdminController {

    public static final String FUSEKI_DATASETS = "/fuseki/$/datasets";
    private static Logger logger = LoggerFactory.getLogger(TestAdminController.class);

    @Value("${application.elasticsearchHosts}")
    private String elasticSearchHosts;

    @Value("${application.elasticsearchCluster}")
    private String elasticSearchCluster;

    @Value("${application.fusekiHost}")
    private String fusekiHost;

    @Value("${application.harvesterHost}")
    private String harvesterHost;


    @PostConstruct
    void validate(){
        assert elasticSearchHosts != null;
        assert elasticSearchCluster != null;
        assert fusekiHost != null;
        assert harvesterHost != null;

    }



    /**
     * The resultSet page. Sets callback service and version identification and returns home.html page
     */
    @RequestMapping({"/"})
    String index(HttpSession session) {

        //session.setAttribute("dcatQueryService", buildMetadata.getQueryServiceURL());

        //session.setAttribute("versionInformation", buildMetadata.getVersionInformation());

        //logger.debug("Requestmapping / : es host: " + elasticSearchHost);
        //logger.debug("Requestmapping / : es cluster: " + elasticSearchCluster);

        return "test"; // templates/home.html
    }

    /**
     * Talks to Fuseki and attempts to delete the dcat dataset. It so attemts to create
     * the dcat dataset anew
     *
     * @return response of operation
     */
    @CrossOrigin
    @RequestMapping(method = RequestMethod.DELETE, value = "fuseki-dcat")
    public ResponseEntity<String> resetFusekiDataset() {

        ResponseEntity<String> deleteResponse = deleteFusekiDataset("dcat");

        if (deleteResponse.getStatusCode() == HttpStatus.OK ||
                deleteResponse.getStatusCode() == HttpStatus.NOT_FOUND) {

            logger.info("FUSEKI database dcat no longer exists");

            ResponseEntity<String> responseCreate = createFusekiDataset("dcat");

            if (responseCreate.getStatusCodeValue() == 200) {

                return new ResponseEntity<String>("FUSEKI dataset dcat is reset", HttpStatus.OK);
            } else {
                return new ResponseEntity<String>("Unable to recreate FUSEKI dcat dataset",
                        responseCreate.getStatusCode());
            }
        }

        return new ResponseEntity<String>(HttpStatus.BAD_REQUEST);

    }

    /**
     * Creates a dataset in the fuseki database. Invokes create dataset command by
     * sending rest-call to fuseki-service.
     *
     * @param datasetName name of the dataset, e.g. dcat
     * @return the response from the fuseki-service.
     */
    ResponseEntity<String> createFusekiDataset(String datasetName) {
        final String uri = fusekiHost + FUSEKI_DATASETS;
        logger.info("Start create FUSEKI {} by connection to {}", datasetName, uri);

        String body = String.format("dbName=/%s&dbType=tdb", datasetName);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        HttpEntity<String> request = new HttpEntity<String>(body, headers);
        RestTemplate restTemplate = new RestTemplate();

        ResponseEntity<String> response = restTemplate.postForEntity(uri, request, String.class);

        logger.info("Create FUSEKI dataset {} returns {}", datasetName, response.getStatusCode());

        return response;
    }

    ResponseEntity<String> deleteFusekiDataset(String datasetName) {
        final String uri = fusekiHost + FUSEKI_DATASETS + "/" + datasetName;
        logger.info("Start connection to {}", uri);

        RestTemplate restTemplate = new RestTemplate();

        logger.info("Send FUSEKI delete dataset {}", datasetName);
        ResponseEntity<String> response = new ResponseEntity<String>(HttpStatus.NOT_FOUND);
        try {
            response = restTemplate.exchange(uri, HttpMethod.DELETE, null, String.class);
        } catch (HttpClientErrorException cee) {
            if (cee.getStatusCode() != HttpStatus.NOT_FOUND) {
                throw cee;
            }
        }

        return response;
    }

    /**
     * Delete dcat index from Elasticsearch
     *
     * @param response the httpservlet response (not used)
     * @return HTTP 200 OK if index was deleted succesfully
     */
    @CrossOrigin
    @RequestMapping(method = RequestMethod.DELETE, value = "esdata")
    public ResponseEntity<String> deleteCatalogIndexes(HttpServletResponse response) {
        HttpURLConnection httpCon = null;

        try {
            List<Elasticsearch.ElasticsearchNode> elasticsearchNodes = Elasticsearch.parseHostsString(elasticSearchHosts);

            URL url = new URL("http://" + elasticsearchNodes.get(0).host + ":9200/dcat,theme,codes");

            httpCon = (HttpURLConnection) url.openConnection();
            httpCon.addRequestProperty("Content-Type", "application/x-www-form-urlencoded");
            httpCon.setRequestMethod("DELETE");

            logger.debug(httpCon.toString());

            int responseCode = httpCon.getResponseCode();

            if (responseCode == HttpStatus.OK.value()) {

                logger.info("Database deleted");
                return new ResponseEntity<>(HttpStatus.OK);
            }
        } catch (Exception e) {
            logger.error("Failed to delete", e);
        } finally {
            if (httpCon != null) {
                httpCon.disconnect();
            }
        }

        return new ResponseEntity<String>(HttpStatus.BAD_REQUEST);
    }

    /**
     * Ask harvester to load DCAT data file into elasticsearch
     *
     * @param filename Name of file to be loaded. Must be Turlte, json-ld or RFD/XML format
     * @param base64   Base64 encoded DCAT data
     * @return HTTP 200 OK if data was successfully loaded, HTTP 400 Bad request if loading did not succeed
     */
    @CrossOrigin
    @RequestMapping(method = RequestMethod.POST, value = "load")
    public ResponseEntity<String> load(@RequestParam(value = "filename") String filename,
                                       @RequestParam(value = "data") String base64) {

        logger.info("Load request: " + filename + " " + base64.length() + " bytes");

        String uri = harvesterHost + "/api/admin/load";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> payload = new LinkedMultiValueMap<>();
        payload.add("filename", filename);
        payload.add("data", base64);

        final HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<MultiValueMap<String, String>>(payload, headers);
        RestTemplate restTemplate = new RestTemplate();

        try {

            return restTemplate.exchange(uri, HttpMethod.POST, request, String.class);

        } catch (Exception e) {
            logger.error("Unable to load file {} due to {}", filename, e.getMessage(), e);
            return new ResponseEntity<String>("Unable to load " + filename, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


}