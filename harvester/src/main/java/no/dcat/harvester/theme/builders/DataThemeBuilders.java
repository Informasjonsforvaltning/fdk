package no.dcat.harvester.theme.builders;

import no.dcat.data.store.domain.dcat.ConceptSchema;
import no.dcat.data.store.domain.dcat.DataTheme;
import no.dcat.data.store.domain.dcat.builders.AbstractBuilder;
import no.dcat.harvester.theme.builders.vocabulary.FdkRDF;
import org.apache.jena.rdf.model.Model;
import org.apache.jena.rdf.model.ResIterator;
import org.apache.jena.rdf.model.Resource;
import org.apache.jena.rdf.model.Statement;
import org.apache.jena.rdf.model.StmtIterator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Objects;

/**
 * Class for extracting data from Skos themes into Java DataTheme-class.
 */
public class DataThemeBuilders extends AbstractBuilder {
    private final Logger logger = LoggerFactory.getLogger(DataThemeBuilders.class);

    public static final String ENGLISH_EXTRACT = "en";
    public static final String ENGLISH = "en";
    public static final String NORWEGIAN_EXTRACT = "no";
    public static final String NORWEGIAN = "nb";
    public static final String PREDICATE_STARTUSE = "start.use";
    private final Model model;

    public DataThemeBuilders(Model model) {
        this.model = model;
    }

    public List<DataTheme> build() {
        logger.trace("Start extracting data.");

        List<DataTheme> dataThemeObjs = new ArrayList<>();


        ResIterator catalogIterator = model.listResourcesWithProperty(FdkRDF.rdfsLabel);
        ConceptSchema conceptSchema = new ConceptSchema();

        while (catalogIterator.hasNext()) {
            conceptSchema = populateConceptSchema(catalogIterator.next());
        }

        catalogIterator = model.listResourcesWithProperty(FdkRDF.atAuthorityName);
        while (catalogIterator.hasNext()) {
            DataTheme dataThemeObj = new DataTheme();
            dataThemeObj.setTitle(new HashMap<String, String>());

            populateDataTheme(dataThemeObjs, catalogIterator.next(), dataThemeObj);

            dataThemeObj.setConceptSchema(conceptSchema);
            logger.trace("Created Java DataTheme: " + dataThemeObj.toString());
        }
        return dataThemeObjs;
    }

    private ConceptSchema populateConceptSchema(Resource catalog) {
        ConceptSchema conceptSchema = new ConceptSchema();
        catalog.getProperty(FdkRDF.atTableId);

        conceptSchema.setId(catalog.getProperty(FdkRDF.atTableId).getSubject().getURI());
        conceptSchema.setTitle(catalog.getProperty(FdkRDF.atPreflabel).getObject().asLiteral().getString());
        conceptSchema.setVersioninfo(catalog.getProperty(FdkRDF.owlVersionInfo).getObject().asLiteral().getString());
        conceptSchema.setVersionnumber(catalog.getProperty(FdkRDF.atVersionNumber).getObject().asLiteral().getString());

        return conceptSchema;
    }

    private void populateDataTheme(List<DataTheme> dataThemeObjs, Resource catalog, DataTheme dataThemeObj) {
        StmtIterator dataThemeIterator = catalog.listProperties();

        while (dataThemeIterator.hasNext()) {
            Statement dataTheme = dataThemeIterator.next();

            if (Objects.equals(dataTheme.getPredicate().getLocalName(), PREDICATE_STARTUSE)) {
                dataThemeObj.setStartUse(dataTheme.getObject().asLiteral().getString());
            }

            if (!dataTheme.getObject().isLiteral()) {
                continue;
            }

            if (Objects.equals(dataTheme.getLanguage(), ENGLISH_EXTRACT)) {
                populateIdCodeTitel(dataThemeObj, dataTheme, ENGLISH);
            }

            if (Objects.equals(dataTheme.getLanguage(), NORWEGIAN_EXTRACT)) {
                populateIdCodeTitel(dataThemeObj, dataTheme, NORWEGIAN);
            }
        }
        dataThemeObjs.add(dataThemeObj);
    }

    private void populateIdCodeTitel(DataTheme dataThemeObj, Statement dataTheme, String lang) {
        dataThemeObj.setId(dataTheme.getSubject().getURI());
        dataThemeObj.setCode(dataTheme.getSubject().getLocalName());
        dataThemeObj.getTitle().put(lang, dataTheme.getObject().asLiteral().getString());
    }
}
