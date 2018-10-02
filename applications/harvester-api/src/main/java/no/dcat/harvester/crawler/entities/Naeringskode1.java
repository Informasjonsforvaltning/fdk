package no.dcat.harvester.crawler.entities;

import no.dcat.datastore.domain.dcat.vocabulary.EnhetsregisteretRDF;
import org.apache.jena.rdf.model.Model;
import org.apache.jena.rdf.model.Resource;


public class Naeringskode1 {

    public String kode;
    public String beskrivelse;

    public String getKode() {return kode;}
    public String getBeskrivelse() {return beskrivelse;}

    public Resource createResource(final no.dcat.harvester.crawler.entities.Enhet enhet, final String identifier) {
        final Model model = enhet.getModel();
        Resource naeringskode1Resource = model.createResource(enhet.getBaseURI() + identifier);
        Enhet.addProperty(naeringskode1Resource, EnhetsregisteretRDF.kode, getKode());
        Enhet.addProperty(naeringskode1Resource, EnhetsregisteretRDF.beskrivelse, getBeskrivelse());
        return naeringskode1Resource;
    }
}
