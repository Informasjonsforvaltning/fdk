package no.dcat.harvester.dcat.domain.theme.builders;

import no.dcat.harvester.crawler.Types;
import org.junit.Assert;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Created by dask on 18.01.2017.
 */
public class CodeTypesTest {
    private static final Logger logger = LoggerFactory.getLogger(CodeTypesTest.class);

    @Test
    public void getRights() {
        String sourceUrl = Types.RIGHTSSTATEMENT.getSourceUrl();
        logger.info(sourceUrl);

        Assert.assertNotNull(sourceUrl);
    }
}
