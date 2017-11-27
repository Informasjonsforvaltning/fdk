package no.dcat.portal.query;

import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;

public class HarvestQueryTest {
    private static Logger logger = LoggerFactory.getLogger(HarvestQueryTest.class);
    @Test
    public void t () throws Throwable {

        HarvestQueryService service = new HarvestQueryService();
        service.setClusterName("elasticsearch");
        service.setElasticsearchHost("localhost");
        service.setPort(9300);

        ResponseEntity<String> response = service.listCatalogHarvestRecords("");

        logger.info(response.getBody());

    }
}
