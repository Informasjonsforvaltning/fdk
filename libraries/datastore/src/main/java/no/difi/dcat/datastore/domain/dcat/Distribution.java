package no.difi.dcat.datastore.domain.dcat;

import lombok.Data;

@Data
public class Distribution extends no.dcat.shared.Distribution {
    private Dataset dataset;
}
