package no.acat.model;

import no.dcat.shared.HarvestMetadata;
import no.dcat.shared.testcategories.UnitTest;
import org.joda.time.DateTime;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.experimental.categories.Category;
import org.mockito.MockitoAnnotations;

import java.util.Arrays;
import java.util.Date;
import java.util.List;

@Category(UnitTest.class)
public class HarvestMetadataFactoryTest {

    Date harvestDate;
    HarvestMetadata harvestMetadata;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        harvestDate = new DateTime(2018, 6, 20, 0, 0).toDate();
        harvestMetadata = new HarvestMetadata();
        harvestMetadata.setFirstHarvested(harvestDate);
        harvestMetadata.setLastChanged(harvestDate);
        harvestMetadata.setLastHarvested(harvestDate);
    }

    @Test
    public void updateChangesIfChanged() throws Exception {

        HarvestMetadata metadata =
            HarvestMetadataFactory.recordHarvest(harvestMetadata, harvestDate, true);
        Assert.assertTrue(metadata.getChanged().get(0).equals(harvestDate));
    }

    @Test
    public void updateLastHarvested() throws Exception {

        List<Date> dates =
            Arrays.asList(
                new DateTime(2018, 6, 20, 0, 0).toDate(), new DateTime(2019, 6, 20, 0, 0).toDate());
        harvestMetadata.setChanged(dates);

        HarvestMetadata metadata =
            HarvestMetadataFactory.recordHarvest(harvestMetadata, harvestDate, false);
        Assert.assertTrue(metadata.getChanged().size() == 2);
    }
}
