package no.dcat.service;

import no.dcat.shared.admin.DcatSourceDto;
import org.junit.Test;
import org.junit.Assert;

import java.util.List;

import static org.junit.Assert.assertTrue;

/**
 * Created by bjg on 02.02.2018.
 */
public class HarvesterServiceIT {
    @Test
    public void getHarvestEntriesReturnsContentFromHarvester() throws Exception {
        HarvesterService hs = new HarvesterService();
        List<DcatSourceDto> result = hs.getHarvestEntries();

        assertTrue(result.size() > 0);

    }
}
