package no.dcat.datastore.domain.dcat;

import lombok.Data;
import no.dcat.shared.Dataset;

@Data
public class Distribution extends no.dcat.shared.Distribution {
    private Dataset dataset;

    @Override
    public String toString() {
        String first = super.toString();
        return first;
    }
}
