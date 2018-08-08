package no.dcat.datastore.domain.dcat.vocabulary;

import org.apache.jena.rdf.model.Model;
import org.apache.jena.rdf.model.ModelFactory;
import org.apache.jena.rdf.model.Property;

/**
 * Vocabulary definitions from enhetsregisteret
 * @author Marcus Gustafson
 */
public class EnhetsregisteretRDF {

    private static final Model model = ModelFactory.createDefaultModel();

    public static final String NS = "http://data.brreg.no/meta/";

    public static String getUri() {
        return NS;
    }

    public static final Property overordnetEnhet = model.createProperty(NS, "overordnetEnhet");
    public static final Property organisasjonsform = model.createProperty(NS, "organisasjonsform");
    public static final Property navn = model.createProperty(NS, "navn");
    public static final Property naeringskode = model.createProperty(NS, "naeringskode1");
    public static final Property beskrivelse = model.createProperty(NS, "beskrivelse");
    public static final Property kode = model.createProperty(NS, "kode");
    public static final Property institusjonellSektorkode = model.createProperty(NS, "institusjonellSektorkode" );

}
