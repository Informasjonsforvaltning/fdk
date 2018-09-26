package no.dcat.harvester.crawler.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import no.dcat.datastore.domain.dcat.vocabulary.EnhetsregisteretRDF;
import org.apache.jena.rdf.model.Model;
import org.apache.jena.rdf.model.Property;
import org.apache.jena.rdf.model.Resource;
import org.apache.jena.sparql.vocabulary.FOAF;
import org.apache.jena.vocabulary.RDF;


public class Enhet {

    public String organisasjonsnummer;
    public String navn;
    public Organisasjonsform organisasjonsform;
    public String hjemmeside;
    public Adresse postadresse;
    public String registreringsdatoEnhetsregisteret;
    public boolean registrertIMvaregisteret;
    public Naeringskode1 naeringskode1;
    public int antallAnsatte;
    public String overordnetEnhet;
    public Adresse forretningsadresse;
    public InstitusjonellSektorkode institusjonellSektorkode;
    public boolean registrertIForetaksregisteret;
    public boolean registrertIStiftelsesregisteret;
    public boolean registrertIFrivillighetsregisteret;
    public boolean konkurs;
    public boolean underAvvikling;
    public boolean underTvangsavviklingEllerTvangsopplosning;
    public String maalform;

    @JsonIgnore
    private Model model = null; //Call initialize(Model) to initialize

    public void initialize(final Model model) {
        this.model = model;
        model.setNsPrefix("er", EnhetsregisteretRDF.NS);
    }

    public Model getModel() {
        return model;
    }

    public String getBaseURI() {
        return "http://data.brreg.no/enhetsregisteret/enhet/"+getOrganisasjonsnummer()+"/";
    }

    public String getOrganisasjonsnummer() {return organisasjonsnummer;}
    public String getNavn() {return navn;}
    public String getHjemmeside() {return hjemmeside;}
    public String getRegistreringsdatoEnhetsregisteret() {return registreringsdatoEnhetsregisteret;}
    public boolean getRegistrertIMvaregisteret() {return registrertIMvaregisteret;}
    public int getAntallAnsatte() {return antallAnsatte;}
    public String getOverordnetEnhet() {return overordnetEnhet;}
    public boolean getRegistrertIForetaksregisteret() {return registrertIForetaksregisteret;}
    public boolean getRegistrertIStiftelsesregisteret() {return registrertIStiftelsesregisteret;}
    public boolean getRegistrertIFrivillighetsregisteret() {return registrertIFrivillighetsregisteret;}
    public boolean getKonkurs() {return konkurs;}
    public boolean getUnderAvvikling() {return underAvvikling;}
    public boolean getUnderTvangsavviklingEllerTvangsopplosning() {return underTvangsavviklingEllerTvangsopplosning;}
    public String getMaalform() {return maalform;}
    public String getOrganisasjonsform() {return organisasjonsform==null ? null : organisasjonsform.getKode();}
    public String getInstitusjonellSektorkode() {return institusjonellSektorkode==null ? null : institusjonellSektorkode.getKode();}
    public String getNaeringskode1() {return naeringskode1==null ? null : naeringskode1.getKode();}
    public no.dcat.harvester.crawler.entities.Adresse getPostadresse() {return postadresse;}
    public no.dcat.harvester.crawler.entities.Adresse getForretningsadresse() {return forretningsadresse;}

    public static void addProperty(final Resource resource, final Property property, final Object value) {
        if (value!=null) {
            if (value instanceof String) {
                resource.addProperty(property, (String)value);
            } else if (value instanceof Boolean) {
                resource.addLiteral(property, (Boolean)value);
            } else if (value instanceof Integer) {
                resource.addLiteral(property, (Integer)value);
            } else if (value instanceof Resource) {
                resource.addProperty(property, (Resource)value);
            } else {
                throw new RuntimeException("Unknown property datatype");
            }
        }
    }

    public Resource createResource(final Model model, final Resource parentResource, final Resource existingResource) {
        initialize(model);

        Resource orgResource = existingResource;
        addProperty(orgResource, RDF.type, FOAF.Agent);

        addProperty(orgResource, EnhetsregisteretRDF.antallAnsatte, getAntallAnsatte());
        addProperty(orgResource, EnhetsregisteretRDF.hjemmeside, getHjemmeside());
        addProperty(orgResource, EnhetsregisteretRDF.konkurs, getKonkurs());
        addProperty(orgResource, EnhetsregisteretRDF.maalform, getMaalform());
        addProperty(orgResource, EnhetsregisteretRDF.navn, getNavn());
        addProperty(orgResource, EnhetsregisteretRDF.organisasjonsnummer, getOrganisasjonsnummer());
        addProperty(orgResource, EnhetsregisteretRDF.overordnetEnhet, getOverordnetEnhet());
        addProperty(orgResource, EnhetsregisteretRDF.registreringsdatoEnhetsregisteret, getRegistreringsdatoEnhetsregisteret());
        addProperty(orgResource, EnhetsregisteretRDF.registrertIForetaksregisteret, getRegistrertIForetaksregisteret());
        addProperty(orgResource, EnhetsregisteretRDF.registrertIFrivillighetsregisteret, getRegistrertIFrivillighetsregisteret());
        addProperty(orgResource, EnhetsregisteretRDF.registrertIMvaregisteret, getRegistrertIMvaregisteret());
        addProperty(orgResource, EnhetsregisteretRDF.registrertIStiftelsesregisteret, getRegistrertIStiftelsesregisteret());
        addProperty(orgResource, EnhetsregisteretRDF.underAvvikling, getUnderAvvikling());
        addProperty(orgResource, EnhetsregisteretRDF.underTvangsavviklingEllerTvangsopplosning, getUnderTvangsavviklingEllerTvangsopplosning());

        if (forretningsadresse != null) {
            Resource forretningsadresseResource = forretningsadresse.createResource(this, "forretningsadresse");
            model.add(orgResource, EnhetsregisteretRDF.forretningsadresse, forretningsadresseResource);
        }

        if (institusjonellSektorkode != null) {
            Resource institusjonellSektorkodeResource = institusjonellSektorkode.createResource(this, "institusjonellSektorkode");
            model.add(orgResource, EnhetsregisteretRDF.institusjonellSektorkode, institusjonellSektorkodeResource);
        }

        if (naeringskode1 != null) {
            Resource naeringskode1Resource = naeringskode1.createResource(this, "naeringskode1");
            model.add(orgResource, EnhetsregisteretRDF.naeringskode, naeringskode1Resource);
        }

        if (organisasjonsform != null) {
            Resource orgFormResource = organisasjonsform.createResource(this, "orgform");
            model.add(orgResource, EnhetsregisteretRDF.orgform, orgFormResource);
            model.add(orgResource, EnhetsregisteretRDF.organisasjonsform, organisasjonsform.getKode());
        }

        if (postadresse != null) {
            Resource postadresseResource = postadresse.createResource(this, "postadresse");
            model.add(orgResource, EnhetsregisteretRDF.postadresse, postadresseResource);
        }

        return orgResource;
    }

}
