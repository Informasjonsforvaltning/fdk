package no.difi.dcat.datastore.domain.dcat;

import lombok.Data;
import no.dcat.shared.Dataset;

@Data
public class Distribution extends no.dcat.shared.Distribution {
    private Dataset dataset;
}
