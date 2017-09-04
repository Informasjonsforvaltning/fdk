package no.dcat.data.store.domain.dcat;

import java.util.ArrayList;
import java.util.List;

public class Publisher {

    public static String PUBLISHERID_ENHETSREGISTERET_URI = "http://data.brreg.no/enhetsregisteret/enhet/%s";

    private String id;
    private String name;
    private String overordnetEnhet;
    private String organisasjonsform;
    // private List<Publisher> underPublishers;
    // private Publisher superierPublishers;

    // All Publisher first level below.
    private List<Publisher> subPublisher = new ArrayList<>();
    private Publisher superiorPublisher;

    // All Publisher all levels below.
    private List<Publisher> aggrSubPublisher= new ArrayList<>();;

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

    public List<Publisher> getSubPublisher() {
        return subPublisher;
    }

    public void setSuperiorPublisher(Publisher superiorPublisher) {
        this.superiorPublisher = superiorPublisher;
    }

    public Publisher getSuperiorPublisher() {
        return superiorPublisher;
    }

    public List<Publisher> getAggrSubPublisher() {
        return aggrSubPublisher;
    }
}
