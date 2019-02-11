package no.dcat.shared;

import no.fdk.test.testcategories.UnitTest;
import org.junit.Assert;
import org.junit.Test;
import org.junit.experimental.categories.Category;

import java.util.Date;

@Category(UnitTest.class)
public class HarvestMetadataUtilTest {

    @Test
    public void initialize() throws Exception {
        Date harvestDate = new Date();

        HarvestMetadata metadata =
            HarvestMetadataUtil.createOrUpdate(null, harvestDate, false);
        Assert.assertEquals(metadata.getFirstHarvested(),harvestDate);
        Assert.assertEquals(metadata.getLastHarvested(),harvestDate);
    }

    @Test
    public void updateLastHarvested() throws Exception {
        Date createDate = new Date();
        Date harvestDate = new Date();
        harvestDate.setTime(createDate.getTime() + 1000);

        HarvestMetadata oldMetadata =
            HarvestMetadataUtil.createOrUpdate(null, createDate, false);

        HarvestMetadata metadata =
            HarvestMetadataUtil.createOrUpdate(oldMetadata, harvestDate, false);
        Assert.assertEquals(metadata.getFirstHarvested(), createDate);
        Assert.assertEquals(metadata.getLastHarvested(), harvestDate);
    }

    @Test
    public void updateChangesIfChanged() throws Exception {
        Date createDate = new Date();
        Date harvestDate = new Date();

        HarvestMetadata oldMetadata =
            HarvestMetadataUtil.createOrUpdate(null, createDate, false);

        HarvestMetadata metadata =
            HarvestMetadataUtil.createOrUpdate(oldMetadata, harvestDate, true);
        Assert.assertEquals(metadata.getChanged().get(0), harvestDate);
    }

}
