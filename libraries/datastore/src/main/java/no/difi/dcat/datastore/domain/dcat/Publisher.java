package no.difi.dcat.datastore.domain.dcat;

import lombok.Data;
import lombok.ToString;
import no.dcat.shared.SkosCode;

import java.util.ArrayList;
import java.util.List;

@Data
@ToString(callSuper = true)
public class Publisher extends no.dcat.shared.Publisher {

    public static String PUBLISHERID_ENHETSREGISTERET_URI = "http://data.brreg.no/enhetsregisteret/enhet/%s";

    private String overordnetEnhet;
    private String organisasjonsform;
    private SkosCode naeringskode;
    private SkosCode sektorkode;
    private boolean valid;

    // private List<Publisher> underPublishers;
    // private Publisher superierPublishers;

    // All Publisher first level below.
    private List<Publisher> subPublisher;
    private Publisher superiorPublisher;

    // All Publisher all levels below.
    private List<Publisher> aggrSubPublisher;

}
