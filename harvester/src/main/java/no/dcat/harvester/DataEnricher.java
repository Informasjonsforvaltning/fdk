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

    /**
     * This method enriches an input RDF DCAT model with extra data
     *
     * @param inputModel DCAT RDF model to be enriched
     * @return Enriched DCAT RDF model
     */
    public Model enrichData(Model model) {
        if (isEntryscape(model)) {
            enrichForEntryscape(model);
        }
        if (isVegvesenet(model)) {
            enrichForVegvesenet(model);
        }
        enrichLanguage(model);

        return model;
    } //end method enrichData


    /**
     * Check to see if a model have been created with EntryScape
     *
     * @param union RDF DCAT model to be checked
     * @return True if model is made by Entryscape
     */
    private boolean isEntryscape(Model union) {
        //detect entryscape data by doing a string match against the uri of a catalog
        ResIterator resIterator = union.listResourcesWithProperty(RDF.type, union.createResource("http://www.w3.org/ns/dcat#Catalog"));
        return resIterator.hasNext() && resIterator.nextResource().getURI().contains("://difi.entryscape.net/");
    }


    /**
     * Check if model is from Vegvesenet (Norwegian state roads authority)
     *
     * @param union RDF DCAT model to be checked
     * @return True if model is from Vegvesenet
     */
    private boolean isVegvesenet(Model union) {
        //detect entryscape data by doing a string match against the uri of a catalog
        ResIterator resIterator = union.listResourcesWithProperty(RDF.type, union.createResource("http://www.w3.org/ns/dcat#Catalog"));
        return resIterator.hasNext() && resIterator.nextResource().getURI().contains("utv.vegvesen.no");
    }


    /**
     * Add required DCAT-AP-NO data elements to models created with Entryscape
     * @param union Model to enrich
     */
    private void enrichForEntryscape(Model union) {

        // Add type DCTerms.RightsStatement to alle DCTerms.rights
        NodeIterator dctRights = union.listObjectsOfProperty(DCTerms.rights);
        while (dctRights.hasNext()) {
            dctRights.next().asResource().addProperty(RDF.type, DCTerms.RightsStatement);
        }

        // Add type  DCTerms.Location to all DCTerms.spatial
        NodeIterator dctSpatial = union.listObjectsOfProperty(DCTerms.spatial);
        while (dctSpatial.hasNext()) {
            dctSpatial.next().asResource().addProperty(RDF.type, DCTerms.Location);
        }

        // Replace all DCTerms.issued where the literal is not a date or datetime
        List<Statement> dctIssuedToDelete = new ArrayList<>();
        StmtIterator dctIssued = union.listStatements(new SimpleSelector(null, DCTerms.issued, (RDFNode) null));
        while (dctIssued.hasNext()) {
            Statement statement = dctIssued.next();
            Literal literal = statement.getObject().asLiteral();
            if (literal.getDatatype().equals(XSDDatatype.XSDstring)) {


                String string = literal.getString();
                dctIssuedToDelete.add(statement);

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

        dctIssuedToDelete.forEach(union::remove);


        // Remove DCTerms.accrualPeriodicity that are not according to DCAT AP 1.1
        List<Statement> accrualPeriodicityToDelete = new ArrayList<>();
        StmtIterator accrualPeriodicity = union.listStatements(new SimpleSelector(null, DCTerms.accrualPeriodicity, (RDFNode) null));
        while (accrualPeriodicity.hasNext()) {
            Statement statement = accrualPeriodicity.next();
            String uri = statement.getObject().asResource().getURI();
            if (!uri.startsWith("http://publications.europa.eu/resource/authority/frequency/")) {
                accrualPeriodicityToDelete.add(statement);
            }
        }

        accrualPeriodicityToDelete.forEach(union::remove);

    } //end method enrichForEntryscape


    /**
     * Add required DCAT-AP-NO data elements to models created by Vegvesenet
     * @param union Model to be enriched
     */
    private void enrichForVegvesenet(Model union) {

        // Make all use of dcat:contactPoint point to resources of type vcard:Kind
        NodeIterator contactPoint = union.listObjectsOfProperty(DCAT.contactPoint);
        while (contactPoint.hasNext()) {
            Resource resource = contactPoint.next().asResource();
            resource.addProperty(RDF.type, union.createResource("http://www.w3.org/2006/vcard/ns#Kind"));
        }

        // Find a resource with foaf:name "Statens vegvesen" and use it as the dct:publisher for all dcat:Catalog(s)
        ResIterator catalogPublisher = union.listSubjectsWithProperty(RDF.type, DCAT.Catalog);
        while (catalogPublisher.hasNext()) {
            Resource resource = catalogPublisher.next().asResource();
            ResIterator resIterator = union.listSubjectsWithProperty(FOAF.name, "Statens vegvesen");
            resource.addProperty(DCTerms.publisher, resIterator.nextResource());
        }

        // Change dcat:accessUrl from string literal to uri resource
        List<Statement> toDelete = new ArrayList<>();
        StmtIterator accessURL = union.listStatements(null, DCAT.accessUrl, (String) null);
        while (accessURL.hasNext()) {
            toDelete.add(accessURL.nextStatement());
        }

        for (Statement statement : toDelete) {
            Resource subject = statement.getSubject();
            subject.addProperty(DCAT.accessUrl, union.createResource(statement.getObject().toString()));
            union.remove(statement);
        }


        // Make all uses of dct:publisher point to resources of type foaf:Agent
        NodeIterator dctPublisher = union.listObjectsOfProperty(DCTerms.publisher);
        while (dctPublisher.hasNext()) {
            Resource resource = dctPublisher.next().asResource();
            resource.addProperty(RDF.type, FOAF.Agent);
        }


    } //end method enrichForVegvesenet


    /**
     * Add language tag to dataset title, description and keyword if this is missing
     * Value will be set to "no-nb"
     * See Jira https://jira.brreg.no/browse/FDK-82
     *
     * @param union Model to be enriched
     */
    private void enrichLanguage(Model union) {

        //Debug: Skricv ut alle statements før endring
        logger.info("Alle ressurser");
        logger.info("==============================");
        StmtIterator stmtIt = union.listStatements(new SimpleSelector(null, null, (RDFNode) null));
        while(stmtIt.hasNext()) {
            Statement stmt = stmtIt.next();
            logger.info("stmt : " + stmt.toString());
        }


        //Store statements that need to be deleted
        List<Statement> statementToBeDeleted = new ArrayList<>();

        //Find all resources that has a title property
        StmtIterator titles = union.listStatements(new SimpleSelector(null, DCTerms.title, (RDFNode) null));
        while(titles.hasNext()) {
            Statement titleStmt = titles.nextStatement();
            Literal title = titleStmt.getObject().asLiteral();

            //if language is blank, default language should be added
            if(title.getLanguage().equals("")) {
                //create new resource with language added
                Literal titleWithLang = ResourceFactory.createLangLiteral(title.getString(), DEFAULT_LANGUAGE);
                titleStmt.getSubject().addLiteral(DCTerms.title, titleWithLang);

                //mark resource without language for deletion
                statementToBeDeleted.add(titleStmt);
            }
        }

        //Find all resources that has a description property
        StmtIterator descriptions = union.listStatements(new SimpleSelector(null, DCTerms.description, (RDFNode) null));
        while(descriptions.hasNext()) {
            Statement descStmt = descriptions.nextStatement();
            Literal description = descStmt.getObject().asLiteral();

            //if language is blank, default language should be added
            if(description.getLanguage().equals("")) {
                //create new resource with language added
                Literal descWithLang = ResourceFactory.createLangLiteral(description.getString(), DEFAULT_LANGUAGE);
                descStmt.getSubject().addLiteral(DCTerms.description, descWithLang);

                //mark resource without language for deletion
                statementToBeDeleted.add(descStmt);
            }
        }

        //Find all resources that has a keyword property
        StmtIterator keywords = union.listStatements(new SimpleSelector(null, DCAT.keyword, (RDFNode) null));
        while(keywords.hasNext()) {
            Statement keywordStmt = keywords.nextStatement();
            Literal keyword = keywordStmt.getObject().asLiteral();

            //if language is blank, default language should be added
            if(keyword.getLanguage().equals("")) {
                //create new resource with language added
                Literal keywordWithLang = ResourceFactory.createLangLiteral(keyword.getString(), DEFAULT_LANGUAGE);
                keywordStmt.getSubject().addLiteral(DCAT.keyword, keywordWithLang);

                //mark resource without language for deletion
                statementToBeDeleted.add(keywordStmt);
            }
        }

        //Delete resources without language
        statementToBeDeleted.forEach(union::remove);




        //Debug: Loop gjennom for å se at alle descriptions har språk
        logger.info("Description-ressurser skal ha språk");
        logger.info("====================================");
        StmtIterator dctDesc = union.listStatements(new SimpleSelector(null, DCTerms.description, (RDFNode) null));
        while(dctDesc.hasNext()) {
            Statement testDescRes = dctDesc.next();
            logger.info("Testres med beskrivelse: " + testDescRes.toString());
        }

        //Debug: Loop gjennom for å se at alle descriptions har språk
        logger.info("Keyword-ressurser skal ha språk");
        logger.info("====================================");
        StmtIterator keyStmti = union.listStatements(new SimpleSelector(null, DCAT.keyword, (RDFNode) null));
        while(keyStmti.hasNext()) {
            Statement keyStmt = keyStmti.next();
            logger.info("Testres med keyword: " + keyStmt.toString());
        }

    } //end method enrichLanguage

}
