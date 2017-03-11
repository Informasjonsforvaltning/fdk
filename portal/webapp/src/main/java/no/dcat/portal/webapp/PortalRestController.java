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
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.net.URISyntaxException;
import java.util.NoSuchElementException;

import static org.springframework.http.HttpStatus.OK;
import static org.springframework.web.bind.annotation.RequestMethod.GET;

@RestController
public class PortalRestController {

    private final static Logger logger = LoggerFactory.getLogger(PortalRestController.class);

    @Value("${application.fusekiService}")
    private String fusekiService;

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
        try {
            logger.info("Searching for {} ", id);
            String returnFormat = getReturnFormat(acceptHeader, format);
            logger.info("Prepare export of {}", returnFormat);

            String responseBody = findSubjectById(id, returnFormat);
            logger.info("Dataset found {} ", id);
            return new ResponseEntity<>(responseBody, OK);
        } catch (NoSuchElementException nsee) {
            logger.info("ID {} not found {}", id,nsee.getMessage(),nsee);
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
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

    private String findSubjectById(String id, String format) {
        DcatDataStore dcatDataStore = new DcatDataStore(new Fuseki(fusekiService + "/dcat"));
        Model model = dcatDataStore.getAllDataCatalogues();

        String decodedUri = id;
        try {
            decodedUri = new java.net.URI(id).toString();
        } catch (URISyntaxException e) {
            logger.error("URI syntax error ", id, e);
        }

        String queryString =
                "PREFIX dcat: <http://www.w3.org/ns/dcat#> " +
                "PREFIX dct: <http://purl.org/dc/terms/> " +
                "PREFIX owl: <http://www.w3.org/TR/owl-time/> " +
                "PREFIX adms: <http://www.w3.org/ns/adms#>" +
                "PREFIX foaf: <http://xmlns.com/foaf/0.1/>" +
                "PREFIX vcard: <http://www.w3.org/2006/vcard/ns#>" +
                "PREFIX dcatno: <http://difi.no/dcatno#>" +
                "PREFIX er: <http://data.brreg.no/meta/>" +
                "DESCRIBE ?dataset ?publisher ?contact ?distribution ?nace ?fadr ?padr ?sektor " +
                "where {?dataset a dcat:Dataset. " +
                " ?dataset dct:publisher ?publisher." +
                        " OPTIONAL {?publisher er:naeringskode1 ?nace}" +
                        " OPTIONAL {?publisher er:forretningsadresse ?fadr}" +
                        " OPTIONAL {?publisher er:postadresse ?padr}" +
                        " OPTIONAL {?publisher er:institusjonellSektorkode ?sektor}" +
                " OPTIONAL {?dataset dcat:contactPoint ?contact} " +
                " OPTIONAL {?dataset dcat:distribution ?distribution }" +
                " FILTER (?dataset = <" + decodedUri + "> ) " +
                "}";

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
