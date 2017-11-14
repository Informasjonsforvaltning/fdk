package no.dcat.harvester;

import lombok.Data;

import java.util.Date;
import java.util.List;

@Data
public class CatalogHarvestRecord {
    private Date date;
    private String harvestUrl;
    private String dataSourceId;
    private String message;
    private List<String> validationMessages;
    private String status;
}
