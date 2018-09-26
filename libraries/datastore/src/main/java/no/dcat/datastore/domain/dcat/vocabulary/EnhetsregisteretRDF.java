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

    public static final Property adresse = model.createProperty(NS, "adresse");
    public static final Property antallAnsatte = model.createProperty(NS, "antallAnsatte");
    public static final Property beskrivelse = model.createProperty(NS, "beskrivelse");
    public static final Property forretningsadresse = model.createProperty(NS, "forretningsadresse");
    public static final Property hjemmeside = model.createProperty(NS, "hjemmeside");
    public static final Property institusjonellSektorkode = model.createProperty(NS, "institusjonellSektorkode" );
    public static final Property kode = model.createProperty(NS, "kode");
    public static final Property kommune = model.createProperty(NS, "kommune");
    public static final Property kommunenummer = model.createProperty(NS, "kommunenummer");
    public static final Property konkurs = model.createProperty(NS, "konkurs");
    public static final Property land = model.createProperty(NS, "land");
    public static final Property landkode = model.createProperty(NS, "landkode");
    public static final Property maalform = model.createProperty(NS, "maalform");
    public static final Property naeringskode = model.createProperty(NS, "naeringskode1");
    public static final Property navn = model.createProperty(NS, "navn");
    public static final Property organisasjonsform = model.createProperty(NS, "organisasjonsform");
    public static final Property organisasjonsnummer = model.createProperty(NS, "organisasjonsnummer");
    public static final Property orgform = model.createProperty(NS, "orgform");
    public static final Property overordnetEnhet = model.createProperty(NS, "overordnetEnhet");
    public static final Property postadresse = model.createProperty(NS, "postadresse");
    public static final Property postnummer = model.createProperty(NS, "postnummer");
    public static final Property poststed = model.createProperty(NS, "poststed");
    public static final Property registreringsdatoEnhetsregisteret = model.createProperty(NS, "registreringsdatoEnhetsregisteret");
    public static final Property registrertIForetaksregisteret = model.createProperty(NS, "registrertIForetaksregisteret");
    public static final Property registrertIFrivillighetsregisteret = model.createProperty(NS, "registrertIFrivillighetsregisteret");
    public static final Property registrertIMvaregisteret = model.createProperty(NS, "registrertIMvaregisteret");
    public static final Property registrertIStiftelsesregisteret = model.createProperty(NS, "registrertIStiftelsesregisteret");
    public static final Property underAvvikling = model.createProperty(NS, "underAvvikling");
    public static final Property underTvangsavviklingEllerTvangsopplosning = model.createProperty(NS, "underTvangsavviklingEllerTvangsopplosning");
}
