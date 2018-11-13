package no.dcat.shared;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/*
HarvestMetadataUtil is class for logic for managing HarvestMetadata objects, which itself are Anemic DTO
*/
public class HarvestMetadataUtil {

    public static HarvestMetadata createOrUpdate(HarvestMetadata oldMetadata, Date harvestDate, boolean hasChanged) {

        HarvestMetadata metadata = new HarvestMetadata();

        if (oldMetadata != null && oldMetadata.getFirstHarvested() != null) {
            metadata.setFirstHarvested(oldMetadata.getFirstHarvested());
        } else
            metadata.setFirstHarvested(harvestDate);

        metadata.setLastHarvested(harvestDate);

        if (!hasChanged) {
            if (oldMetadata != null) {
                metadata.setChanged(oldMetadata.getChanged());
            }
        } else {
            List<Date> oldChanged = oldMetadata != null ? oldMetadata.getChanged() : null;
            List<Date> changed = oldChanged != null ? new ArrayList<>(oldChanged) : new ArrayList<>();
            changed.add(harvestDate);
            metadata.setChanged(changed);
            metadata.setLastChanged(harvestDate);
        }

        return metadata;
    }

}
