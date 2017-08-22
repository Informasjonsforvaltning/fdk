package no.dcat.controller;

import com.sun.net.httpserver.Headers;
import no.dcat.model.Catalog;
import no.dcat.model.Dataset;
import org.apache.jena.riot.RDFDataMgr;
import org.apache.jena.riot.RDFFormat;
import org.apache.jena.riot.WriterDatasetRIOT;
import org.apache.jena.riot.system.PrefixMap;
import org.apache.jena.riot.system.RiotLib;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.PagedResources;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import java.io.StringWriter;

import static org.springframework.http.HttpStatus.OK;
import static org.springframework.http.MediaType.APPLICATION_JSON_UTF8_VALUE;
import static org.springframework.web.bind.annotation.RequestMethod.GET;
import static org.springframework.web.bind.annotation.RequestMethod.POST;

@RestController
@RequestMapping(value = "/import")
public class ImportController {

    private static Logger logger = LoggerFactory.getLogger(ImportController.class);


    @CrossOrigin
    @RequestMapping(value = "/{id}",
            method = POST,
            produces = APPLICATION_JSON_UTF8_VALUE)
    public HttpEntity<Catalog> importCatalog(@PathVariable(value="id") String catalogId, @RequestParam(value="url") String url) {

        RestTemplate restTemplate = new RestTemplate();

        Headers headers = new Headers();
        headers.set("Accept", "application/ld+json");
        ResponseEntity<String> ldResponse = restTemplate.getForEntity(url, String.class, headers );

        logger.debug("response: {}", ldResponse);


        return null;

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
