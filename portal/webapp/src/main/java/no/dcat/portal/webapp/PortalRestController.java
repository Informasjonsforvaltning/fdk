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
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.NoSuchElementException;

import static org.springframework.http.HttpStatus.OK;
import static org.springframework.web.bind.annotation.RequestMethod.GET;

@RestController
public class PortalRestController {

    public static final String SERVICE_URI = "http://localhost:3030/fuseki/dcat";
    private final static Logger logger = LoggerFactory.getLogger(PortalRestController.class);

    /**
     * API to find dataset based on id from .../dataset?id={id}
     * @param id of dataset to find
     * @param acceptHeader accepted format
     * @return Formatted response based on acceptHeader {@link SupportedFormat}
     */
    @CrossOrigin
    @RequestMapping(value = "/dataset", method = GET,
            consumes = MediaType.ALL_VALUE)
    public ResponseEntity<String> getDatasourceDcat(
            @RequestParam(value = "id") String id,
            @RequestHeader(value = "Accept", defaultValue = "*/*") String acceptHeader) {
        try {
            logger.info("Searching for {} with {}", id, acceptHeader);
            String responseBody = findSubjectById(id, acceptHeader);
            logger.info("Dataset found {} ", id);
            return new ResponseEntity<>(responseBody, OK);
        } catch (NoSuchElementException nsee) {
            logger.info("ID {} not found {}", id);
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    private String findSubjectById(String id, String format) {
        DcatDataStore dcatDataStore = new DcatDataStore(new Fuseki(SERVICE_URI));
        Model model = dcatDataStore.getAllDataCatalogues();

        String queryString =
                "PREFIX dcat: <http://www.w3.org/ns/dcat#> " +
                "PREFIX dct: <http://purl.org/dc/terms/> " +
                "PREFIX owl: <http://www.w3.org/TR/owl-time/> " +
                "PREFIX adms: <http://www.w3.org/ns/adms#>" +
                "PREFIX foaf: <http://xmlns.com/foaf/0.1/>" +
                "DESCRIBE <"+ id +">" +
                "where {?x dcat:Dataset ?y}";
        Query query = QueryFactory.create(queryString);

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
