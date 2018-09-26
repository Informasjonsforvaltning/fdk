package no.dcat.datastore.domain.dcat;

import lombok.Data;
import lombok.ToString;
import no.dcat.shared.SkosCode;

import java.util.List;

@Data
@ToString(callSuper = true)
public class Publisher extends no.dcat.shared.Publisher {

    private String overordnetEnhet;
    private String organisasjonsform;
    private SkosCode naeringskode;
    private SkosCode sektorkode;
    private boolean valid;

    // All Publisher first level below.
    private List<Publisher> subPublisher;
    private Publisher superiorPublisher;

    // All Publisher all levels below.
    private List<Publisher> aggrSubPublisher;

}
