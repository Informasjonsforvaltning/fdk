package no.dcat.shared;

public enum Types {

    provenancestatement("rdf/provenance.rdf", "provenancestatement"),
    rightsstatement("rdf/access-right-skos.rdf","rightsstatement"),
    frequency("rdf/frequency.rdf","frequency"),
   //frequency("http://publications.europa.eu/resource/authority/frequency","frequency"),
   // To bigfile, contains over 7700 languages, 5 million lines og code.
   //LINGUISTICSYSTEM("http://publications.europa.eu/mdr/resource/authority/language/skos/languages-skos.rdf", "linguisticsystem");
    linguisticsystem("rdf/languages-skos.rdf", "linguisticsystem"),
    referencetypes("rdf/reference-code-skos.ttl", "referencetypes"),
    openlicenses("rdf/open-licenses-skos.rdf", "openlicenses"),
    distributiontype("rdf/distribution-type-skos.rdf", "distributiontype"),
    apistatus("rdf/api-status-skos.ttl", "apistatus"),
    apiservicetype("rdf/api-service-type-skos.ttl", "apiservicetype"),

    location(null, "location"),
    subject(null, "subject");

   private String sourceUrl;
   private String type;

   Types(String sourceUrl, String type) {
       this.sourceUrl = sourceUrl;
       this.type = type;
   }
   public String getType() {
       return type;
   }

   public void setType(String type) {
       this.type = type;
   }

   public String getSourceUrl() {
       return sourceUrl;
   }

   public void setSourceUrl(String sourceUrl) {
       this.sourceUrl = sourceUrl;
   }


    @Override
    public String toString() {
        return type;
    }
}
