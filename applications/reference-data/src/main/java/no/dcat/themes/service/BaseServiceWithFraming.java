package no.dcat.themes.service;

import no.dcat.datastore.domain.dcat.builders.RdfModelLoader;
import no.dcat.themes.database.TDBConnection;
import org.apache.jena.atlas.web.HttpException;
import org.apache.jena.query.Dataset;
import org.apache.jena.rdf.model.Model;
import org.apache.jena.riot.JsonLDWriteContext;
import org.apache.jena.riot.RDFDataMgr;
import org.apache.jena.riot.RDFFormat;
import org.apache.jena.riot.WriterDatasetRIOT;
import org.apache.jena.riot.system.PrefixMap;
import org.apache.jena.riot.system.RiotLib;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import java.io.StringWriter;
import java.net.MalformedURLException;
import java.net.URL;

abstract class BaseServiceWithFraming {

    TDBConnection tdbConnection;

    static private final Logger logger = LoggerFactory.getLogger(BaseServiceWithFraming.class);

    @Autowired
    public BaseServiceWithFraming(TDBConnection tdbConnection) {
        this.tdbConnection = tdbConnection;
    }


    String frame(Dataset dataset, String frame) {
        WriterDatasetRIOT w = RDFDataMgr.createDatasetWriter(RDFFormat.JSONLD_FRAME_PRETTY);
        PrefixMap pm = RiotLib.prefixMap(dataset.getDefaultModel().getGraph());


        StringWriter stringWriter = new StringWriter();

        JsonLDWriteContext ctx = new JsonLDWriteContext();

        ctx.setFrame(frame);

        w.write(stringWriter, dataset.asDatasetGraph(), pm, null, ctx);


        return stringWriter.toString();
    }

    // get model, trying multiple syntaxes
    Model getRemoteModel(URL uri) throws MalformedURLException, HttpException {
        return RdfModelLoader.loadModel(uri);
    }



}
