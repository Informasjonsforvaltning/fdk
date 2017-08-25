package no.dcat.controller;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import no.dcat.model.Catalog;
import no.dcat.model.Dataset;
import no.dcat.model.exceptions.CatalogNotFoundException;
import no.dcat.model.exceptions.DatasetNotFoundException;
import no.dcat.model.exceptions.ErrorResponse;
import no.dcat.service.CatalogRepository;
import org.apache.commons.io.IOUtils;
import org.apache.jena.query.DatasetFactory;
import org.apache.jena.rdf.model.InfModel;
import org.apache.jena.rdf.model.Model;
import org.apache.jena.rdf.model.ModelFactory;
import org.apache.jena.reasoner.ReasonerRegistry;
import org.apache.jena.riot.JsonLDWriteContext;
import org.apache.jena.riot.RDFDataMgr;
import org.apache.jena.riot.RDFFormat;
import org.apache.jena.riot.WriterDatasetRIOT;
import org.apache.jena.riot.system.PrefixMap;
import org.apache.jena.riot.system.RiotLib;
import org.apache.jena.util.FileManager;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.io.StringWriter;
import java.util.ArrayList;
import java.util.List;

import static org.springframework.http.MediaType.APPLICATION_JSON_UTF8_VALUE;
import static org.springframework.web.bind.annotation.RequestMethod.POST;

@RestController
@RequestMapping(value = "/catalogs/{id}/import")
public class ImportController {

    private static Logger logger = LoggerFactory.getLogger(ImportController.class);

    @Autowired
    protected CatalogController catalogController;

    @Autowired
    protected DatasetController datasetController;

    @Autowired
    protected CatalogRepository catalogRepository;

    private final static Model owlSchema = FileManager.get().loadModel("frames/schema.ttl");

    @CrossOrigin
    @RequestMapping(value = "",
            method = POST,
            produces = APPLICATION_JSON_UTF8_VALUE)
    public HttpEntity<Catalog> importCatalog(
            @PathVariable(value = "id") String catalogId,
            @RequestBody String url) throws DatasetNotFoundException, CatalogNotFoundException, IOException {
        logger.info("import requested for {}", url);
        Catalog catalog;

        catalog = importDatasets(catalogId, url);

        return new ResponseEntity<>(catalog, HttpStatus.OK);
    }

    @ExceptionHandler(IOException.class)
    public ResponseEntity<ErrorResponse> exceptionHandler(Exception ex) {
        ErrorResponse error = new ErrorResponse();
        error.setErrorCode(HttpStatus.BAD_REQUEST.value());
        error.setMessage(ex.getMessage());

        return new ResponseEntity<ErrorResponse>(error, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(value = {CatalogNotFoundException.class, DatasetNotFoundException.class })
    public ResponseEntity<ErrorResponse> notFoundException(Exception ex) {
        ErrorResponse error = new ErrorResponse();
        error.setErrorCode(HttpStatus.NOT_FOUND.value());
        error.setMessage(ex.getMessage());

        return new ResponseEntity<ErrorResponse>(error, HttpStatus.NOT_FOUND);
    }

    private Catalog importDatasets(String catalogId, String url) throws IOException, CatalogNotFoundException, DatasetNotFoundException {
        Model model = null;

        try {
            model = FileManager.get().loadModel(url);
        } catch (NullPointerException e) {
            throw new IOException(String.format("Cannot open import url %s",url));
        }

        Catalog existingCatalog = catalogRepository.findOne(catalogId);

        if (existingCatalog == null) {
            throw new CatalogNotFoundException(String.format("Catalog %s does not exist in registration database", catalogId));
        }


        List<Catalog> catalogs = parseCatalogs(model);

        Catalog catalogToImportTo = catalogs
                .stream()
                .filter(cat -> cat.getUri().contains(catalogId))
                .peek(cat -> logger.debug("Found catalog {} in external data", cat.toString()))
                .findFirst()
                .orElseThrow(() -> new CatalogNotFoundException(String.format("Catalog %s is not found in import data", catalogId)));

        // Ignore imported catalog attributes, i.e. copy over stored values to result
        catalogToImportTo.setId(existingCatalog.getId());
        catalogToImportTo.setTitle(existingCatalog.getTitle());
        catalogToImportTo.setDescription(existingCatalog.getDescription());

        List<Dataset> datasets = parseDatasets(model);
        List<Dataset> importedDatasets = new ArrayList<>();
        for (Dataset ds : datasets) {
            if (ds.getCatalog() != null && ds.getCatalog().contains(catalogId)) {
                Dataset newDataset = datasetController.saveDataset(catalogId, ds, catalogToImportTo);
                importedDatasets.add(ds);
                logger.debug("ds: {}", newDataset);
            }
        }

        if (importedDatasets.size() == 0) {
            throw new DatasetNotFoundException(String.format("No datasets found in import data that is part of catalog %s", catalogId ));
        }

        catalogToImportTo.setDataset(importedDatasets);

        return catalogToImportTo;
    }


    protected List<Catalog> parseCatalogs(Model model) throws IOException {

        String json = frame(DatasetFactory.create(model), IOUtils.toString(new ClassPathResource("frames/catalog.json").getInputStream(), "UTF-8"));

        List<Catalog> result = new Gson().fromJson(json, FramedCatalog.class).getGraph();

        return result;
    }

    protected List<Dataset> parseDatasets(Model model) throws IOException {

        // using owl ontology to get inverse relations from dataset to catalog
        InfModel modelWithInverseCatalogRelations = ModelFactory.createInfModel(ReasonerRegistry.getOWLReasoner(), owlSchema, model);

        String json = frame(DatasetFactory.create(modelWithInverseCatalogRelations),
                IOUtils.toString(new ClassPathResource("frames/dataset.json").getInputStream(), "UTF-8"));

        logger.debug("json after frame: {}",json);



        List<Dataset> result = new Gson().fromJson(preProcessDatasetAttributes(json), FramedDataset.class).getGraph();

        postprosessDatasetAttributes(result);

        logger.trace("Result frame transformation: {}", new GsonBuilder().setPrettyPrinting().create().toJson(result));
        logger.info("parsed {} datasets from RDF import", result.size());

        return result;
    }

    private String preProcessDatasetAttributes(String json) {
        Gson gson = new GsonBuilder().create();

        JsonObject model = gson.fromJson(json, JsonObject.class);
        JsonArray datasets = model.getAsJsonArray("@graph");

        datasets.forEach( (JsonElement d) -> {
            // preprocess temporals because framing cannot convert object structure
            JsonArray temporals = d.getAsJsonObject().getAsJsonArray("temporal");
            if (temporals != null) {
                temporals.forEach((JsonElement t) -> {
                    JsonElement hasBeginning = t.getAsJsonObject().getAsJsonObject("owt:hasBeginning").getAsJsonObject("owt:inXSDDateTime").getAsJsonPrimitive("@value");
                    JsonElement hasEnd = t.getAsJsonObject().getAsJsonObject("owt:hasEnd").getAsJsonObject("owt:inXSDDateTime").getAsJsonPrimitive("@value");
                    t.getAsJsonObject().add("startDate", hasBeginning);
                    t.getAsJsonObject().add("endDate", hasEnd);
                });
            }
        });
        
        return gson.toJson(model);
    }

    private void postprosessDatasetAttributes(List<Dataset> result) {
        result.forEach(d -> {
            // Postprocess keywords
            if (d.getKeyword() != null) {
                d.getKeyword().forEach(k -> {
                    String lang = k.get("@language");
                    String value = k.get("@value");
                    k.clear();
                    k.put(lang, value);
                });
            }

        });


    }

    String frame(org.apache.jena.query.Dataset dataset, String frame) {

        WriterDatasetRIOT w = RDFDataMgr.createDatasetWriter(RDFFormat.JSONLD_FRAME_PRETTY);
        PrefixMap pm = RiotLib.prefixMap(dataset.getDefaultModel().getGraph());

        StringWriter stringWriter = new StringWriter();

        JsonLDWriteContext ctx = new JsonLDWriteContext();

        ctx.setFrame(frame);

        w.write(stringWriter, dataset.asDatasetGraph(), pm, null, ctx);


        return stringWriter.toString();
    }


}
