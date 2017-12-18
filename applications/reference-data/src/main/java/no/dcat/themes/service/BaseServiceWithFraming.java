package no.dcat.themes.service;

import no.dcat.themes.database.TDBConnection;
import org.apache.jena.atlas.web.HttpException;
import org.apache.jena.query.Dataset;
import org.apache.jena.rdf.model.Model;
import org.apache.jena.riot.JsonLDWriteContext;
import org.apache.jena.riot.RDFDataMgr;
import org.apache.jena.riot.RDFFormat;
import org.apache.jena.riot.RDFLanguages;
import org.apache.jena.riot.RiotException;
import org.apache.jena.riot.WriterDatasetRIOT;
import org.apache.jena.riot.system.PrefixMap;
import org.apache.jena.riot.system.RiotLib;
import org.apache.jena.util.FileManager;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import java.io.StringWriter;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
        logger.info("get remote model for subject {}", uri);

        if (uri.getProtocol().equals("http") || uri.getProtocol().equals("https")) {

            String syntax[] = {null, RDFLanguages.strLangTurtle, RDFLanguages.strLangJSONLD, RDFLanguages.strLangN3};
            Map<String,String> noSucessWithSyntax = new HashMap<>();

            for (String s : syntax) {
                try {
                    if (s != null) {
                        return FileManager.get().loadModel(uri.toString(), s);
                    } else {
                        return FileManager.get().loadModel(uri.toString());
                    }
                } catch (RiotException e) {
                    noSucessWithSyntax.put(s, e.getLocalizedMessage());
                }
            }

            logger.warn("Couldn't read <{}>. Tried the following formats {}", uri, noSucessWithSyntax.keySet().toString());
            noSucessWithSyntax.forEach( (key, value) -> {
                logger.warn("Format {} caused {}", key, value);
            });

        } else {
            throw new MalformedURLException("Protocol not supported");
        }

        return null;
    }

}
