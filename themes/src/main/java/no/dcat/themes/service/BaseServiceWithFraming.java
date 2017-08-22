package no.dcat.themes.service;

import no.dcat.themes.database.TDBConnection;
import org.apache.jena.query.Dataset;
import org.apache.jena.riot.JsonLDWriteContext;
import org.apache.jena.riot.RDFDataMgr;
import org.apache.jena.riot.RDFFormat;
import org.apache.jena.riot.WriterDatasetRIOT;
import org.apache.jena.riot.system.PrefixMap;
import org.apache.jena.riot.system.RiotLib;
import org.springframework.beans.factory.annotation.Autowired;

import java.io.StringWriter;

abstract class BaseServiceWithFraming {

    TDBConnection tdbConnection;

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


}
