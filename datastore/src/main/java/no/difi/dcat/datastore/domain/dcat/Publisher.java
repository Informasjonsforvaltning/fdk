package no.difi.dcat.datastore.domain.dcat;

public class Publisher {

    private String id;
    private String name;
    private String overordnetEnhet;
    private String organisasjonsform;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }


    public void setOverordnetEnhet(String overordnetEnhet) {
        this.overordnetEnhet = overordnetEnhet;
    }

    public String getOverordnetEnhet() {
        return overordnetEnhet;
    }

    public void setOrganisasjonsform(String organisasjonsform) {
        this.organisasjonsform = organisasjonsform;
    }

    public String getOrganisasjonsform() {
        return organisasjonsform;
    }
}
