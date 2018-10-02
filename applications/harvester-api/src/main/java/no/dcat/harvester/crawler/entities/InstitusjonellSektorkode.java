package no.dcat.harvester.crawler.entities;

import no.dcat.datastore.domain.dcat.vocabulary.EnhetsregisteretRDF;
import org.apache.jena.rdf.model.Model;
import org.apache.jena.rdf.model.Resource;


public class InstitusjonellSektorkode {

    public String kode;
    public String beskrivelse;

    public String getKode() {return kode;}
    public String getBeskrivelse() {return beskrivelse;}

    public Resource createResource(final no.dcat.harvester.crawler.entities.Enhet enhet, final String identifier) {
        final Model model = enhet.getModel();
        Resource institusjonellSektorkodeResource = model.createResource(enhet.getBaseURI() + identifier);
        Enhet.addProperty(institusjonellSektorkodeResource, EnhetsregisteretRDF.kode, getKode());
        Enhet.addProperty(institusjonellSektorkodeResource, EnhetsregisteretRDF.beskrivelse, getBeskrivelse());
        return institusjonellSektorkodeResource;
    }
}
