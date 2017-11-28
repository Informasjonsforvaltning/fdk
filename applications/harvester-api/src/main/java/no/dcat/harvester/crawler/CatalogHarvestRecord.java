package no.dcat.harvester.crawler;

import lombok.Data;

import java.util.Date;
import java.util.List;
import java.util.Set;

@Data
public class CatalogHarvestRecord {
    private Date date;
    private String harvestUrl;
    private String dataSourceId;
    private String message;
    private List<String> validationMessages;
    private Set<String> validDatasetUris;
    private Set<String> nonValidDatasetUris;
    private ChangeInformation changeInformation;
    private String status;

}
