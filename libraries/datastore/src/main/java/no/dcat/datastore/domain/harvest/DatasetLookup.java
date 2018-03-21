package no.dcat.datastore.domain.harvest;

import lombok.Data;
import no.dcat.shared.HarvestMetadata;

import java.util.Date;
import java.util.List;

@Data
public class DatasetLookup {
    private String harvestUri;
    private String datasetId;

    private List<String> identifier;

    private HarvestMetadata harvest;
}
