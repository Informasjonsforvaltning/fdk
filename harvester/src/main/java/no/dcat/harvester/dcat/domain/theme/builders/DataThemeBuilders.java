package no.dcat.harvester.dcat.domain.theme.builders;

import no.dcat.harvester.crawler.handlers.ElasticSearchSkosResultHandler;
import no.dcat.harvester.dcat.domain.theme.ConceptSchema;
import no.dcat.harvester.dcat.domain.theme.DataTheme;
import no.difi.dcat.datastore.domain.dcat.builders.AbstractBuilder;
import org.apache.jena.rdf.model.*;
import org.apache.jena.vocabulary.RDF;
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
    private final Logger logger = LoggerFactory.getLogger(ElasticSearchSkosResultHandler.class);

    public static final String ENGLISH_EXTRACT = "en";
    public static final String ENGLISH = "en";
    public static final String NORWEGIAN_EXTRACT = "no";
    public static final String NORWEGIAN = "nb";
    public static final String PREDICATE_INSCHEMA = "inScheme";
    public static final String PREDICATE_INACHEMA_PREFLABEL = "prefLabel";
    public static final String PREDICATE_INSCHEMA_VERSIONINFO = "versionInfo";
    public static final String PREDICATE_INSCHEMA_VERSIONNUMBER = "table.version.number";
    public static final String PREDICATE_STARTUSE = "start.use";
    private final Model model;

    public DataThemeBuilders(Model model) {
        this.model = model;
    }

    public List<DataTheme> build() {
        logger.trace("Start extracting data.");

        List<DataTheme> dataThemeObjs = new ArrayList<>();

        ResIterator catalogIterator = model.listResourcesWithProperty(RDF.type);
        ConceptSchema conceptSchema = new ConceptSchema();
        boolean found = false;
        while (catalogIterator.hasNext()) {
            populateConceptSchema(catalogIterator.next(), conceptSchema, found);
            if (found) break;
        }

        catalogIterator = model.listResourcesWithProperty(RDF.type);
        while (catalogIterator.hasNext()) {
            DataTheme dataThemeObj = new DataTheme();
            dataThemeObj.setTitle(new HashMap<String, String>());

            populateDataTheme(dataThemeObjs, catalogIterator.next(), dataThemeObj);

            dataThemeObj.setConceptSchema(conceptSchema);
            logger.trace("Created Java DataTheme: " + dataThemeObj.toString());
        }
        return dataThemeObjs;
    }

    private void populateConceptSchema(Resource catalog, ConceptSchema conceptSchema, boolean found) {
        StmtIterator dataThemeIterator = catalog.listProperties();

        while (dataThemeIterator.hasNext()) {
            Statement dataTheme = dataThemeIterator.next();

            if (Objects.equals(dataTheme.getPredicate().getLocalName(), PREDICATE_INSCHEMA)) {
                createConceptSchema(dataTheme, conceptSchema, found);
            }
        }

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

    private void createConceptSchema(Statement dataTheme, ConceptSchema conceptSchema, boolean found) {
        StmtIterator inSchemaProperties = dataTheme.getResource().listProperties();

        while (inSchemaProperties.hasNext()) {
            Statement inSchemaProperty = inSchemaProperties.next();
            if (inSchemaProperty.getObject().isLiteral()) {
                if (Objects.equals(inSchemaProperty.getPredicate().getLocalName(), PREDICATE_INACHEMA_PREFLABEL)) {
                    conceptSchema.setTitle(inSchemaProperty.getObject().asLiteral().getString());
                    found = true;
                }
                if (Objects.equals(inSchemaProperty.getPredicate().getLocalName(), PREDICATE_INSCHEMA_VERSIONINFO)) {
                    conceptSchema.setVersioninfo(inSchemaProperty.getObject().asLiteral().getString());
                    found = true;
                }
                if (Objects.equals(inSchemaProperty.getPredicate().getLocalName(), PREDICATE_INSCHEMA_VERSIONNUMBER)) {
                    conceptSchema.setVersionnumber(inSchemaProperty.getObject().asLiteral().getString());
                    found = true;
                }
                if (Objects.equals(inSchemaProperty.getPredicate().getLocalName(), "table.id")) {
                    conceptSchema.setId(inSchemaProperty.getSubject().getURI());
                    found = true;
                }
                //conceptSchema.setId(inSchemaProperty.getSubject().getURI());
            }
        }
    }
}
