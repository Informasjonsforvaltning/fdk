package no.dcat.service;

import no.dcat.shared.admin.DcatSourceDto;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;

import java.util.List;

import static junit.framework.TestCase.assertTrue;

/**
 * Created by bjg on 20.02.2018.
 */
public class HarvesterServiceTest {

    @TestConfiguration
    static class HarvesterServiceTestContextConfiguration {

        @Bean
        public HarvesterService harvesterService() {
            return new HarvesterService();
        }
    }


    @Autowired
    private HarvesterService hs;

    @Test
    public void getHarvestEntriesReturnsContentFromHarvester() throws Exception {

        List<DcatSourceDto> result = hs.getHarvestEntries();

        assertTrue(result.size() > 0);

    }
}
