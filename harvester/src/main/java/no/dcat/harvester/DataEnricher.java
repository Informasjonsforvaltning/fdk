package no.dcat.harvester;

import no.difi.dcat.datastore.domain.dcat.vocabulary.DCAT;
import org.apache.jena.datatypes.xsd.XSDDatatype;
import org.apache.jena.rdf.model.*;
import org.apache.jena.sparql.vocabulary.FOAF;
import org.apache.jena.vocabulary.DCTerms;
import org.apache.jena.vocabulary.RDF;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by bjg on 14.10.2016.
 *
 * The purpose of this class is to enrich data imported from external sources
 * Elements required by the DCAT-AP-NO 1.1 standard may be missing.
 * This class adds sensible default data
 */
public class DataEnricher {

    private final Logger logger = LoggerFactory.getLogger(DataEnricher.class);

    //Default language added to titles, descriptions and keywords with no language
    private static final String DEFAULT_LANGUAGE = "no-nb";

    //Hold the model to be enriched
    private Model model;

    //Hold statements to be deleted at end
    private List<Statement> statementsToDelete = new ArrayList<>();

    /**
     * This method enriches an input RDF DCAT model with extra data
     *
     * @param inputModel DCAT RDF model to be enriched
     * @return Enriched DCAT RDF model
     */
    public Model enrichData(Model inputModel) {

        model = inputModel;

        if (isEntryscape()) {
            enrichForEntryscape();
        }
        if (isVegvesenet()) {
            enrichForVegvesenet();
        }
        enrichLanguage();

        //Remove statements marked for deletion
        statementsToDelete.forEach(model::remove);

        return model;

    } //end method enrichData


    /**
     * Check to see if a model have been created with EntryScape
     */
    private boolean isEntryscape() {
        //detect entryscape data by doing a string match against the uri of a catalog
        ResIterator resIterator = model.listResourcesWithProperty(RDF.type, model.createResource("http://www.w3.org/ns/dcat#Catalog"));
        return resIterator.hasNext() && resIterator.nextResource().getURI().contains("://difi.entryscape.net/");
    }


    /**
     * Check if model is from Vegvesenet (Norwegian state roads authority)
     */
    private boolean isVegvesenet() {
        //detect entryscape data by doing a string match against the uri of a catalog
        ResIterator resIterator = model.listResourcesWithProperty(RDF.type, model.createResource("http://www.w3.org/ns/dcat#Catalog"));
        return resIterator.hasNext() && resIterator.nextResource().getURI().contains("utv.vegvesen.no");
    }


    /**
     * Add required DCAT-AP-NO data elements to models created with Entryscape
     */
    private void enrichForEntryscape() {

        // Add type DCTerms.RightsStatement to alle DCTerms.rights
        NodeIterator dctRights = model.listObjectsOfProperty(DCTerms.rights);
        while (dctRights.hasNext()) {
            dctRights.next().asResource().addProperty(RDF.type, DCTerms.RightsStatement);
        }

        // Add type  DCTerms.Location to all DCTerms.spatial
        NodeIterator dctSpatial = model.listObjectsOfProperty(DCTerms.spatial);
        while (dctSpatial.hasNext()) {
            dctSpatial.next().asResource().addProperty(RDF.type, DCTerms.Location);
        }

        // Replace all DCTerms.issued where the literal is not a date or datetime
        StmtIterator dctIssued = model.listStatements(new SimpleSelector(null, DCTerms.issued, (RDFNode) null));
        while (dctIssued.hasNext()) {
            Statement statement = dctIssued.next();
            Literal literal = statement.getObject().asLiteral();
            if (literal.getDatatype().equals(XSDDatatype.XSDstring)) {


                String string = literal.getString();
                statementsToDelete.add(statement);

                if (string.contains(":")) {
                    //datetime
                    Literal typedLiteral = ResourceFactory.createTypedLiteral(string, XSDDatatype.XSDdateTime);
                    statement.getSubject().addLiteral(DCTerms.issued, typedLiteral);
                } else {
                    //date

                    Literal typedLiteral = ResourceFactory.createTypedLiteral(string, XSDDatatype.XSDdate);
                    statement.getSubject().addLiteral(DCTerms.issued, typedLiteral);

                }


            }
        }

        // Remove DCTerms.accrualPeriodicity that are not according to DCAT AP 1.1
        StmtIterator accrualPeriodicity = model.listStatements(new SimpleSelector(null, DCTerms.accrualPeriodicity, (RDFNode) null));
        while (accrualPeriodicity.hasNext()) {
            Statement statement = accrualPeriodicity.next();
            String uri = statement.getObject().asResource().getURI();
            if (!uri.startsWith("http://publications.europa.eu/resource/authority/frequency/")) {
                statementsToDelete.add(statement);
            }
        }
    } //end method enrichForEntryscape


    /**
     * Add required DCAT-AP-NO data elements to models created by Vegvesenet
     */
    private void enrichForVegvesenet() {

        // Make all use of dcat:contactPoint point to resources of type vcard:Kind
        NodeIterator contactPoint = model.listObjectsOfProperty(DCAT.contactPoint);
        while (contactPoint.hasNext()) {
            Resource resource = contactPoint.next().asResource();
            resource.addProperty(RDF.type, model.createResource("http://www.w3.org/2006/vcard/ns#Kind"));
        }

        // Find a resource with foaf:name "Statens vegvesen" and use it as the dct:publisher for all dcat:Catalog(s)
        ResIterator catalogPublisher = model.listSubjectsWithProperty(RDF.type, DCAT.Catalog);
        while (catalogPublisher.hasNext()) {
            Resource resource = catalogPublisher.next().asResource();
            ResIterator resIterator = model.listSubjectsWithProperty(FOAF.name, "Statens vegvesen");
            resource.addProperty(DCTerms.publisher, resIterator.nextResource());
        }

        // Change dcat:accessUrl from string literal to uri resource
        List<Statement> toDelete = new ArrayList<>();
        StmtIterator accessURL = model.listStatements(null, DCAT.accessUrl, (String) null);
        while (accessURL.hasNext()) {
            toDelete.add(accessURL.nextStatement());
        }

        //TODO: kan sikkert gjøres på en lurerer måte
        for (Statement statement : toDelete) {
            Resource subject = statement.getSubject();
            subject.addProperty(DCAT.accessUrl, model.createResource(statement.getObject().toString()));
            statementsToDelete.add(statement);
        }


        // Make all uses of dct:publisher point to resources of type foaf:Agent
        NodeIterator dctPublisher = model.listObjectsOfProperty(DCTerms.publisher);
        while (dctPublisher.hasNext()) {
            Resource resource = dctPublisher.next().asResource();
            resource.addProperty(RDF.type, FOAF.Agent);
        }


    } //end method enrichForVegvesenet


    /**
     * Add language tag to dataset title, description and keyword if this is missing
     * Value will be set to "no-nb"
     * See Jira https://jira.brreg.no/browse/FDK-82
     */
    private void enrichLanguage() {

        //Find all resources that has a title property
        StmtIterator titles = model.listStatements(new SimpleSelector(null, DCTerms.title, (RDFNode) null));
        while(titles.hasNext()) {
            Statement titleStmt = titles.nextStatement();
            Literal title = titleStmt.getObject().asLiteral();

            //if language is blank, default language should be added
            if(title.getLanguage().equals("")) {
                //create new resource with language added
                Literal titleWithLang = ResourceFactory.createLangLiteral(title.getString(), DEFAULT_LANGUAGE);
                titleStmt.getSubject().addLiteral(DCTerms.title, titleWithLang);

                //mark resource without language for deletion
                statementsToDelete.add(titleStmt);
            }
        }

        //Find all resources that has a description property
        StmtIterator descriptions = model.listStatements(new SimpleSelector(null, DCTerms.description, (RDFNode) null));
        while(descriptions.hasNext()) {
            Statement descStmt = descriptions.nextStatement();
            Literal description = descStmt.getObject().asLiteral();

            //if language is blank, default language should be added
            if(description.getLanguage().equals("")) {
                //create new resource with language added
                Literal descWithLang = ResourceFactory.createLangLiteral(description.getString(), DEFAULT_LANGUAGE);
                descStmt.getSubject().addLiteral(DCTerms.description, descWithLang);

                //mark resource without language for deletion
                statementsToDelete.add(descStmt);
            }
        }

        //Find all resources that has a keyword property
        StmtIterator keywords = model.listStatements(new SimpleSelector(null, DCAT.keyword, (RDFNode) null));
        while(keywords.hasNext()) {
            Statement keywordStmt = keywords.nextStatement();
            Literal keyword = keywordStmt.getObject().asLiteral();

            //if language is blank, default language should be added
            if(keyword.getLanguage().equals("")) {
                //create new resource with language added
                Literal keywordWithLang = ResourceFactory.createLangLiteral(keyword.getString(), DEFAULT_LANGUAGE);
                keywordStmt.getSubject().addLiteral(DCAT.keyword, keywordWithLang);

                //mark resource without language for deletion
                statementsToDelete.add(keywordStmt);
            }
        }

    } //end method enrichLanguage

}
