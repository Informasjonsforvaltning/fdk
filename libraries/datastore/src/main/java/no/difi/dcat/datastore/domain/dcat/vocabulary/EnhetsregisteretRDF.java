package no.difi.dcat.datastore.domain.dcat.vocabulary;

import org.apache.jena.rdf.model.Property;
import org.apache.jena.rdf.model.ResourceFactory;

/**
 * Vocabulary definitions from enhetsregisteret
 * @author Marcus Gustafson
 */
public class EnhetsregisteretRDF {
    public static final Property overordnetEnhet = metaProperty("overordnetEnhet");
    public static final Property organisasjonsform = metaProperty("organisasjonsform");
    public static final Property naeringskode = metaProperty("naeringskode1");
    public static final Property beskrivelse = metaProperty("beskrivelse");
    public static final Property kode = metaProperty("kode");

    private static Property metaProperty(String local) {
        return ResourceFactory.createProperty("http://data.brreg.no/meta/", local);
    }
}

