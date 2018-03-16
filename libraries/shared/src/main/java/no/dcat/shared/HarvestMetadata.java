package no.dcat.shared;

import lombok.Data;

import java.util.Date;
import java.util.List;

@Data
public class HarvestMetadata {
    private Date firstHarvested;
    private Date lastHarvested;
    private Date lastChanged;
    private List<Date> changed;
}
