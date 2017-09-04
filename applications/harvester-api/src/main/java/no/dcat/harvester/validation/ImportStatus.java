package no.dcat.harvester.validation;

import org.apache.jena.rdf.model.RDFNode;

/**
 * Holds validation status for DCAT element
 * and wether it should be imported by the harvester
 * More detailed validation results on a per rule basis
 * is held by ValidationError class.
 *
 * Created by bjg on 18.01.2017.
 */
public class ImportStatus {

    /**
     * Name of RDF class name
     * For DCAT, it can be Dataset, Catalog, Distribution
     */
    public String className;

    /**
     * The most severe validation result returned for
     * all attributes of the class
     */
    public ValidationError.RuleSeverity mostSevereValidationResult;

    /**
     * Should the class be imported?
     * true = class should be imported
     * false = class should not be imported
     */
    public boolean shouldBeImported;
}
