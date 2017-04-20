package no.dcat.data.store.domain.dcat;

/**
 * Class for defining loadingdata for all types.
 * The type is loaded automatically as part of harvest when defined in this class.
 * The source is expected to follow skos-owl for codes.
 * TODO: tis class shall be replaces by Types in harvester when this has been etracted in a separate modul.
 */
public enum Types {

    PROVENANCESTATEMENT("rdf/provenance.rdf", "provenancestatement"),
    RIGHTSSTATEMENT("rdf/access-right-skos.rdf","rightsstatement"),
    FREQUENCY("http://publications.europa.eu/mdr/resource/authority/frequency/skos/frequencies-skos.rdf","frequency"),
    // To bigfile, contains over 7700 languages, 5 milllion lines og code.
    //LINGUISTICSYSTEM("http://publications.europa.eu/mdr/resource/authority/language/skos/languages-skos.rdf", "linguisticsystem");
    LINGUISTICSYSTEM("rdf/languages-skos.rdf", "linguisticsystem");

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
}
