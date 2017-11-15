package no.dcat.harvester.crawler;

import lombok.Data;
import no.dcat.shared.Dataset;

import java.util.Date;

@Data
public class DatasetHarvestRecord {
    private Date date;
    private String datasourceId;
    private String datasetUri;
    private String datasetId;
    private ValidationStatus validationStatus;
    private Dataset dataset;
}
