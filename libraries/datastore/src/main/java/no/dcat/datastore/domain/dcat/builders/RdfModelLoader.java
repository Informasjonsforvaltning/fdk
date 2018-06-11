package no.dcat.datastore.domain.dcat.builders;

import org.apache.jena.rdf.model.Model;
import org.apache.jena.riot.RDFLanguages;
import org.apache.jena.riot.RiotException;
import org.apache.jena.util.FileManager;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.net.MalformedURLException;
import java.net.URL;
import java.util.HashMap;
import java.util.Map;

public class RdfModelLoader {
    private static Logger logger = LoggerFactory.getLogger(RdfModelLoader.class);

    public static Model loadModel(URL uri) throws MalformedURLException {
        logger.debug("get remote model for uri {}", uri);

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
            throw new MalformedURLException("Protocol " + uri.getProtocol() + " not supported. Can only load model from http or https");
        }

        return null;
    }
}
