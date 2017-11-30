package no.dcat.datastore.domain.harvest;

import lombok.Data;

@Data
public class DatasetLookup {
    private String harvestUri;
    private String datasetId;
}
