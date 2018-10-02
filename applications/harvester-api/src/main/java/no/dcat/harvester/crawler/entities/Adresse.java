package no.dcat.harvester.crawler.entities;

import no.dcat.datastore.domain.dcat.vocabulary.EnhetsregisteretRDF;
import org.apache.jena.rdf.model.Model;
import org.apache.jena.rdf.model.Resource;


public class Adresse {

    public String[] adresse;
    public String kommune;
    public String kommunenummer;
    public String land;
    public String landkode;
    public String postnummer;
    public String poststed;

    public String getAdresse() {return String.join("\n", adresse);}
    public String[] getAdresseArray() {return adresse;}
    public String getKommune() {return kommune;}
    public String getKommunenummer() {return kommunenummer;}
    public String getLand() {return land;}
    public String getLandkode() {return landkode;}
    public String getPostnummer() {return postnummer;}
    public String getPoststed() {return poststed;}

    public Resource createResource(final no.dcat.harvester.crawler.entities.Enhet enhet, final String identifier) {
        final Model model = enhet.getModel();
        Resource adresseResource = model.createResource(enhet.getBaseURI() + identifier);
        Enhet.addProperty(adresseResource, EnhetsregisteretRDF.adresse, getAdresse());
        Enhet.addProperty(adresseResource, EnhetsregisteretRDF.kommune, getKommune());
        Enhet.addProperty(adresseResource, EnhetsregisteretRDF.kommunenummer, getKommunenummer());
        Enhet.addProperty(adresseResource, EnhetsregisteretRDF.land, getLand());
        Enhet.addProperty(adresseResource, EnhetsregisteretRDF.landkode, getLandkode());
        Enhet.addProperty(adresseResource, EnhetsregisteretRDF.postnummer, getPostnummer());
        Enhet.addProperty(adresseResource, EnhetsregisteretRDF.poststed, getPoststed());
        return adresseResource;
    }
}
