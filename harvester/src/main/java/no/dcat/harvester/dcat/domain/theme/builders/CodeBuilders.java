package no.dcat.harvester.dcat.domain.theme.builders;

import no.dcat.harvester.dcat.domain.theme.builders.vocabulary.FdkRDF;
import no.dcat.harvester.dcat.domain.theme.builders.vocabulary.SkosRDF;
import no.difi.dcat.datastore.domain.dcat.SkosCode;
import no.difi.dcat.datastore.domain.dcat.builders.AbstractBuilder;
import org.apache.jena.rdf.model.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

/**
 * Class for extracting data from Skos or brreg code into Java Code-class.
 */
public class CodeBuilders extends AbstractBuilder {
    private final Logger logger = LoggerFactory.getLogger(DataThemeBuilders.class);

    private final Model model;

    public CodeBuilders(Model model) {
        this.model = model;
    }

    public List<SkosCode> build() {
        logger.trace("Start extracting data.");

        List<SkosCode> codeObjs = new ArrayList<>();
        ResIterator iterartor = model.listResourcesWithProperty(FdkRDF.atAuthorityName);

        while (iterartor.hasNext()) {
            populateCode(codeObjs, iterartor.next());
        }
        return codeObjs;
    }

    private void populateCode(List<SkosCode> codeObjs, Resource codeRdf) {

        StmtIterator codePropsIter = codeRdf.listProperties();

        SkosCode codeObj = new SkosCode();
        codeObj.setPrefLabel(new HashMap<String, String>());

        String uri = codeRdf.getURI();
        codeObj.setUri(uri);

        while (codePropsIter.hasNext()) {
            Statement codeProp = codePropsIter.next();
            Property predicate = codeProp.getPredicate();

            if (predicate.equals(FdkRDF.atAuthorityName)) {
                codeObj.setAuthorityCode(codeProp.getLiteral().getString());
            } else if(predicate.equals(SkosRDF.skosPreflabel)) {
                String lang  = codeProp.getLanguage();
                String prefLabel = codeProp.getObject().asLiteral().getString();
                codeObj.getPrefLabel().put(lang, prefLabel);
            }
        }
        logger.trace(String.format("Created Java object of class Code, with code %s. ", codeObj.getUri()));
        codeObjs.add(codeObj);
    }
}
