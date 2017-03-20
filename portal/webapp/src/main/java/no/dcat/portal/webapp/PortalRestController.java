package no.dcat.portal.webapp;

import no.difi.dcat.datastore.DcatDataStore;
import no.difi.dcat.datastore.Fuseki;
import org.apache.jena.query.Query;
import org.apache.jena.query.QueryExecution;
import org.apache.jena.query.QueryExecutionFactory;
import org.apache.jena.query.QueryFactory;
import org.apache.jena.rdf.model.Model;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.URISyntaxException;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

import static org.springframework.http.HttpStatus.OK;
import static org.springframework.web.bind.annotation.RequestMethod.GET;

@RestController
public class PortalRestController {

    private final static Logger logger = LoggerFactory.getLogger(PortalRestController.class);

    @Value("${application.fusekiService}")
    private String fusekiService;

    protected String getFusekiService() {
        return fusekiService;
    }

    /**
     * API to find dataset based on id from .../dataset?id={id}
     * @param id of dataset to find
     * @param acceptHeader accepted format
     * @return Formatted response based on acceptHeader {@link SupportedFormat}
     */
    @CrossOrigin
    @RequestMapping(value = "/catalogs", method = GET,
            consumes = MediaType.ALL_VALUE, produces= {"text/turtle", "application/ld+json", "application/rdf+xml"})
    public ResponseEntity<String> getCatalogDcat(@RequestParam(value = "id") String id,
                                                    @RequestParam(value = "format") String format,
                                                    @RequestHeader(value = "Accept", defaultValue = "*/*") String acceptHeader) {

        final String queryFile = "sparql/catalog.sparql";

        try {
            Resource resource  = new ClassPathResource(queryFile);
            String query = read(resource.getInputStream());

            String returnFormat = getReturnFormat(acceptHeader, format);
            logger.info("Prepare export of {}", returnFormat);

            String responseBody = findSubjectById(id, query, returnFormat);
            logger.debug(responseBody);

            return new ResponseEntity<>(responseBody, OK);

        } catch (IOException e) {
            logger.error("Unable to open sparql-file {}", queryFile, e);
        } catch (NoSuchElementException nsee) {
            logger.info("ID {} not found {}", id, nsee.getMessage(), nsee);
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    public static String read(InputStream input) throws IOException {
        try (BufferedReader buffer = new BufferedReader(new InputStreamReader(input))) {
            return buffer.lines().collect(Collectors.joining("\n"));
        }
    }

            /**
             * API to find dataset based on id from .../dataset?id={id}
             * @param id of dataset to find
             * @param acceptHeader accepted format
             * @return Formatted response based on acceptHeader {@link SupportedFormat}
             */
    @CrossOrigin
    @RequestMapping(value = "/dataset", method = GET,
            consumes = MediaType.ALL_VALUE, produces= {"text/turtle", "application/ld+json", "application/rdf+xml"})
    public ResponseEntity<String> getDatasourceDcat(
            @RequestParam(value = "id") String id, @RequestParam(value = "format") String format,
            @RequestHeader(value = "Accept", defaultValue = "*/*") String acceptHeader) {

        final String queryFile = "sparql/dataset.sparql";

        logger.info("Searching for {} ", id);

        try {

            Resource resource  = new ClassPathResource(queryFile);
            String query = read(resource.getInputStream());

            String returnFormat = getReturnFormat(acceptHeader, format);
            logger.info("Prepare export of {}", returnFormat);

            String responseBody = findSubjectById(id, query, returnFormat);
            logger.info("Dataset found {} ", id);

            return new ResponseEntity<>(responseBody, OK);

        } catch (IOException e) {
            logger.error("Unable to open sparql-file {}", queryFile, e);
        } catch (NoSuchElementException nsee) {
            logger.info("ID {} not found {}", id,nsee.getMessage(),nsee);

            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    private String getReturnFormat(String acceptFormat, String fileFormat) {
        String modelFormat = "text/turtle";

        if (!"*/*".equals(acceptFormat)) {
            if (acceptFormat.contains("json") || acceptFormat.contains("ld+json")) {
                modelFormat = "application/ld+json";
            } else if (acceptFormat.contains("rdf")) {
                modelFormat = "application/rdf+xml";
            }
        } else if (!"".equals(fileFormat)) {
            if (fileFormat.toLowerCase().contains("xml") || fileFormat.toLowerCase().contains("rdf")) {
                modelFormat = "application/rdf+xml";
            } else if (fileFormat.toLowerCase().contains("json") || fileFormat.toLowerCase().contains("jsonld")) {
                modelFormat = "application/ld+json";
            }
        }
        return modelFormat;
    }

    private String findSubjectById(String id, String queryString, String format) {
        DcatDataStore dcatDataStore = new DcatDataStore(new Fuseki(getFusekiService() + "/dcat"));
        Model model = dcatDataStore.getAllDataCatalogues();

        String decodedUri = id;
        try {
            decodedUri = new java.net.URI(id).toString();
        } catch (URISyntaxException e) {
            logger.error("URI syntax error ", id, e);
        }

        Query query = QueryFactory.create(String.format(queryString, id));

        try (QueryExecution qexec = QueryExecutionFactory.create(query, model)){
            Model submodel = qexec.execDescribe();
            if (submodel.isEmpty()) {
                throw new NoSuchElementException("Empty result");
            }
            ModelFormatter modelFormatter = new ModelFormatter(submodel);

            return modelFormatter.format(format);
        }
    }


}
