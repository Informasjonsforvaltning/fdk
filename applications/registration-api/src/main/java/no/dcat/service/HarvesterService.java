package no.dcat.service;

import no.dcat.model.Catalog;
import no.dcat.shared.admin.DcatSourceDto;
import org.apache.commons.codec.binary.Base64;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.support.BasicAuthorizationInterceptor;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.net.URI;
import java.nio.charset.Charset;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by bjg on 02.02.2018.
 * <p>
 * Handles communication with harvester,
 * so that registration-api can create harvest
 * data sources for its catalogs
 */
@Service
public class HarvesterService {
    private static Logger logger = LoggerFactory.getLogger(HarvesterService.class);

    @Value("${application.harvesterUsername}")
    public String harvesterUsername;

    @Value("${application.harvesterPassword}")
    public String harvesterPassword;

    @Value("${application.harvesterUrl}")
    public String harvesterUrl;


    /**
     * List existing data source entries registered in harvester
     *
     * @return list of Dcat source DTO objects
     */
    public List<DcatSourceDto> getHarvestEntries() {

        RestTemplate restTemplate = new RestTemplate();
        String uri = harvesterUrl + "/api/admin/dcat-sources";
        logger.debug("harvester uri: {}", uri);

        try {
            ResponseEntity<List<DcatSourceDto>> response = restTemplate.exchange(
                uri,
                HttpMethod.GET,
                new HttpEntity<>(createHeaders(harvesterUsername, harvesterPassword)),
                new ParameterizedTypeReference<List<DcatSourceDto>>() {
                });
            return response.getBody();
        } catch (Exception e) {
            logger.error("Failed to get list of dcat sources from harvester-api: {}", e.getLocalizedMessage());
            return new ArrayList<>();
        }
    }


    /**
     * Create new data source in harvester for supplied catalog
     *
     * @param catalog Catalog to create harvest entry for
     * @param endpoint http/https endpoint where catalog should be harvested
     *
     * @return true if creation was successful, false otherwise
     */
    public boolean createHarvestEntry(Catalog catalog, String endpoint) {

        //prepare DTO for new harvest entry
        DcatSourceDto datasource = new DcatSourceDto(
                catalog.getUri(),
                catalog.getTitle().get("nb"), //use norwegian title of catalog as description
                endpoint,
                harvesterUsername, //for now, all new harvester entries are owned by test_user
                catalog.getId());


        RestTemplate restTemplate = new RestTemplate();
        restTemplate.getInterceptors().add(
                new BasicAuthorizationInterceptor(harvesterUsername,harvesterPassword)
        );
        String uri = harvesterUrl + "/api/admin/dcat-source";
        logger.debug("harvester uri: {}", uri);

        ResponseEntity<String> response = null;
        boolean harvestEntryCreated;

        try {
            //TODO få et result der statuskoden kan leses
            URI result = restTemplate.postForLocation(uri, datasource);
            harvestEntryCreated = true;
        } catch (Exception e) {
            logger.error("Failed to POST new data source to harvester: {}", e.getLocalizedMessage());
            harvestEntryCreated = false;
        }

        return harvestEntryCreated;
    }


    /**
     * helper method to create authorisation header for http request
     *
     * @param username
     * @param password
     * @return HTTP header containing basic auth and content type application/josn
     */
    private HttpHeaders createHeaders(String username, String password){
        return new HttpHeaders() {{
            String auth = username + ":" + password;

            byte[] encodedAuth = Base64.encodeBase64(
                    auth.getBytes(Charset.forName("US-ASCII")) );
            String authHeader = "Basic " + new String( encodedAuth );
            set( "Authorization", authHeader );
        }};
    }

}
