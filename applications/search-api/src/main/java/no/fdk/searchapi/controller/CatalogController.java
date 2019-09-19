package no.fdk.searchapi.controller;

import no.dcat.shared.Catalog;
import org.apache.jena.query.*;
import org.apache.jena.rdf.model.Literal;
import org.apache.jena.rdf.model.Model;
import org.apache.jena.sparql.engine.http.QueryEngineHTTP;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.annotation.PostConstruct;
import java.io.*;
import java.net.URLDecoder;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

import static org.springframework.http.HttpStatus.OK;
import static org.springframework.web.bind.annotation.RequestMethod.GET;

@RestController
public class CatalogController {

    private static final Logger logger = LoggerFactory.getLogger(CatalogController.class);
    private static final String DATASET_QUERY_FILENAME = "sparql/dataset.sparql";
    private static final String CATALOG_QUERY_FILENAME = "sparql/catalog.sparql";
    private static final String GET_CATALOGS_QUERY_FILENAME = "sparql/allcatalogs.sparql";

    @Value("${application.fusekiService}")
    private String fusekiService;

    @PostConstruct
    void validate() {
        assert fusekiService != null;
    }

    String getFusekiService() {
        return fusekiService;
    }

    /**
     * API to find dataset based on id from .../dataset?id={id}
     *
     * @param id           of dataset to find
     * @param acceptHeader accepted format
     * @return Formatted response based on acceptHeader {@link SupportedFormat}
     */
    @RequestMapping(value = "/catalogs", params = {"id", "format"},
        method = GET,
        consumes = MediaType.ALL_VALUE,
        produces = {"text/turtle", "application/ld+json", "application/rdf+xml"})
    public ResponseEntity<String> getCatalogDcat(
        @RequestParam(value = "id") String id,
        @RequestParam(value = "format", required = false) String format,
        @RequestHeader(value = "Accept", required = false) String acceptHeader) {

        ResponseEntity<String> responseBody = invokeFusekiQuery(id, format, acceptHeader, CATALOG_QUERY_FILENAME);

        if (responseBody != null) {
            return responseBody;
        }

        return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @RequestMapping(value = "/catalogs", method = GET, produces = "application/json")
    public List<Catalog> allCatalogs() {
        String queryString;

        // fail early
        try {
            Resource resource = new ClassPathResource(GET_CATALOGS_QUERY_FILENAME);
            queryString = read(resource.getInputStream());
        } catch (IOException e) {
            logger.error("List catalogs failed {}", e.getMessage(), e);
            throw new RuntimeException(e.getMessage());
        }

        List<Catalog> result = new ArrayList<>();
        Query query = getQuery(queryString);

        try (QueryExecution qe = getQueryExecution(query)) {
            ResultSet resultset = qe.execSelect();

            while (resultset.hasNext()) {
                QuerySolution qs = resultset.next();

                Literal title = qs.get("cname").asLiteral();
                String titleLanguage = title.getLanguage();
                String titleString = title.getString();

                String catalogUri = qs.get("catalog").asResource().getURI();

                Catalog catalog = new Catalog();
                catalog.setUri(catalogUri);
                catalog.setTitle(new HashMap<>());
                catalog.getTitle().put(titleLanguage, titleString);

                result.add(catalog);
            }


        } catch (Exception e) {
            logger.error("Query to find catalogs failed: ", e);
            throw new RuntimeException("Query to find catalogs failed: " + e.getMessage());
        }

        return result;
    }


    /**
     * Lists catalogs in a simple html format
     *
     * @return html list of catalogs
     */
    @RequestMapping(value = "/catalogs",
        method = GET,
        produces = "text/html")
    public ResponseEntity<String> getCatalogs() {

        List<Catalog> catalogs;

        // fail early
        try {
            catalogs = allCatalogs();
        } catch (Exception e) {
            logger.error("List catalogs failed {}", e.getMessage(), e);
            return new ResponseEntity<>("Error: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }

        StringBuilder builder = new StringBuilder();

        builder.append("<html>");
        builder.append("<head>");
        builder.append("<link rel='stylesheet' href='/static/bootstrap.min.css' media='all'/>");
        builder.append("<link rel='stylesheet' href='/static/styles.css' media='all'/>");
        builder.append("</head>");
        builder.append("<body>");
        builder.append("<h1>Velg katalog for nedlasting</h1>");
        builder.append("<p>Du kan velge mellom følgende formater: turtle, json-ld eller rdf/xml. Bruk accept header (text/turtle, application/ld+json, application/rdf+xml) i restkallet eller format parameter format=(ttl, json, rdf)</p>");

        int count = 0;
        for (Catalog catalog : catalogs) {
            if (catalog.getTitle() == null || catalog.getUri() == null) {
                continue;
            }
            count++;
            StringBuilder catalogName = new StringBuilder();
            boolean moreThanOneName = false;
            for (String language : catalog.getTitle().keySet()) {
                if (moreThanOneName) {
                    catalogName.append(" / ");
                }
                catalogName.append(catalog.getTitle().get(language));
                moreThanOneName = true;
            }

            String catalogUri = catalog.getUri();

            builder.append("<div class=\"fdk-label-distribution fdk-label-distribution-offentlig\">\n");
            builder.append("<i class=\"fa fa-download fdk-fa-left\"></i>\n");
            builder.append("<a class='fdk-distribution-format' href='" + "/catalogs?id=" + catalogUri + "&format=ttl'>").append(catalogName).append("</a>\n");
            builder.append(("</div>\n"));
        }

        builder.append("</body>");
        builder.append("</html>");

        if (count > 0) {
            return new ResponseEntity<>(builder.toString(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>("No catalogs found.", HttpStatus.NOT_FOUND);
        }

    }

    /**
     * API to find dataset based on id from .../dataset?id={id}
     *
     * @param uri          of dataset to find
     * @param acceptHeader accepted format
     * @return Formatted response based on acceptHeader {@link SupportedFormat}
     */
    @RequestMapping(value = "/catalogs/datasets",
        method = GET,
        consumes = MediaType.ALL_VALUE,
        produces = {"text/turtle", "application/ld+json", "application/rdf+xml"})
    public ResponseEntity<String> getDatasetDcat(
        @RequestParam(value = "uri") String uri,
        @RequestParam(value = "format", required = false) String format,
        @RequestHeader(value = "Accept", defaultValue = "*/*", required = false) String acceptHeader) {

        ResponseEntity<String> responseBody = invokeFusekiQuery(uri, format, acceptHeader, DATASET_QUERY_FILENAME);

        if (responseBody != null) {
            return responseBody;
        }

        return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }

    /**
     * Invokes a query to Fuseki and returns the reslut as a response entity
     *
     * @param id           the resource to look for
     * @param format       the format to return (can be null)
     * @param acceptHeader the format to return (can be null)
     * @param queryFile    the sparql query to perform
     * @return a responseEntity with the RDF formated according to the format.
     */
    ResponseEntity<String> invokeFusekiQuery(String id, String format, String acceptHeader, String queryFile) {
        try {
            logger.info("Export {}", id);

            // read query file
            Resource resource = new ClassPathResource(queryFile);
            String query = read(resource.getInputStream());

            String returnFormat = getReturnFormat(acceptHeader, format);

            if (returnFormat == null) {
                return new ResponseEntity<>("Unknown format " + format + " and/or Accept-header: " + acceptHeader,
                    HttpStatus.NOT_ACCEPTABLE);
            }

            logger.info("Prepare export of {}", returnFormat);

            // find the resource to export
            String responseBody = findResourceById(id, query, returnFormat);
            if (responseBody == null) {
                return new ResponseEntity<>("Unable to find " + id, HttpStatus.NOT_FOUND);
            }


            HttpHeaders headers = new HttpHeaders();
            headers.add("Content-Type", returnFormat + "; charset=UTF-8");

            return new ResponseEntity<>(responseBody, headers, OK);

        } catch (IOException e) {
            logger.error("Unable to open sparql-file {}", queryFile, e);
        } catch (NoSuchElementException nsee) {
            logger.info("ID {} not found {}", id, nsee.getMessage(), nsee);
            return new ResponseEntity<>("Unable to find " + id, HttpStatus.NOT_FOUND);
        }

        return null;
    }

    /**
     * Convert inputstream to String (java 8)
     *
     * @param input the inputstream
     * @return the string
     * @throws IOException if anything is wrong
     */
    String read(InputStream input) throws IOException {
        try (BufferedReader buffer = new BufferedReader(new InputStreamReader(input))) {
            return buffer.lines().collect(Collectors.joining("\n"));
        }
    }

    /**
     * Returns the iana format to return
     *
     * @param acceptFormat if Accept has a format we use it
     * @param fileFormat   if ?format=ttl has a format we use it
     * @return the returned format.
     */
    private String getReturnFormat(String acceptFormat, String fileFormat) {
        String modelFormat = null;

        if (acceptFormat != null) {
            if (acceptFormat.contains("json")) {
                modelFormat = "application/ld+json";
            } else if (acceptFormat.contains("rdf")) {
                modelFormat = "application/rdf+xml";
            } else if (acceptFormat.contains("turtle")) {
                modelFormat = "text/turtle";
            }
        }

        if (modelFormat == null && fileFormat != null) {
            if (fileFormat.toLowerCase().contains("xml") || fileFormat.toLowerCase().contains("rdf")) {
                modelFormat = "application/rdf+xml";
            } else if (fileFormat.toLowerCase().contains("json")) {
                modelFormat = "application/ld+json";
            } else if (fileFormat.toLowerCase().contains("ttl")) {
                modelFormat = "text/turtle";
            }
        }

        return modelFormat;
    }

    /**
     * Asks fuseki to do query and return the wanted format
     *
     * @param id          the ide of the resource to find
     * @param queryString the query which describe the result
     * @param format      the wanted format.
     * @return RDF formated string according to DCAT and format, if null the query returned empty
     */
    String findResourceById(String id, String queryString, String format) {
        String uri = id;
        // make sure the uri is not encoded
        try {
            uri = URLDecoder.decode(id, "UTF-8");

        } catch (UnsupportedEncodingException e) {
            // Should in principle newer be thrown
            logger.error("URI syntax error ", uri, e);
            return null;
        }

        Query query = getQuery(String.format(queryString, uri));

        try (QueryExecution qe = getQueryExecution(query)) {

            logger.trace(query.toString());

            Model submodel = qe.execDescribe();

            if (submodel.isEmpty()) {
                return null;
            }
            ModelFormatter modelFormatter = new ModelFormatter(submodel);

            return modelFormatter.format(format);
        } catch (Exception e) {
            logger.error("No resource found {}", e.getClass().getName(), e);
            return null;
        }
    }

    /**
     * Creates a query based on a sparql text query
     *
     * @param query the sparql query
     * @return the query object
     */
    Query getQuery(String query) {
        return QueryFactory.create(query);
    }

    /**
     * Do query fuseki service
     *
     * @param query sparql query
     * @return the execution handler of the query
     */
    QueryExecution getQueryExecution(Query query) {
        return new QueryEngineHTTP(getFusekiService() + "/dcat", query);
    }


}
