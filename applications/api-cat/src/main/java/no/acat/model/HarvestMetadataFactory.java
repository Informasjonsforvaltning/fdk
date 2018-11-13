package no.acat.model;

import no.dcat.shared.HarvestMetadata;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/*
HarvestMetadataFactory is class for logic for managing HarvestMetadata objects, which itself are Anemic DTO
*/
public class HarvestMetadataFactory {

    public static HarvestMetadata recordHarvest(HarvestMetadata oldMetadata, Date harvestDate, boolean hasChanged) {

        HarvestMetadata metadata = new HarvestMetadata();

        if (oldMetadata != null && oldMetadata.getFirstHarvested() != null) {
            metadata.setFirstHarvested(oldMetadata.getFirstHarvested());
        } else
            metadata.setFirstHarvested(harvestDate);

        metadata.setLastHarvested(harvestDate);

        if (!hasChanged) {
            if(oldMetadata!=null) {
                metadata.setChanged(oldMetadata.getChanged());
            }
        } else {
            List<Date> oldChanged = oldMetadata != null ? oldMetadata.getChanged() : null;
            List<Date> changed = oldChanged != null ? new ArrayList<>(oldChanged): new ArrayList<>();
            changed.add(harvestDate);
            metadata.setChanged(changed);
            metadata.setLastChanged(harvestDate);
        }

        return metadata;
    }

}
