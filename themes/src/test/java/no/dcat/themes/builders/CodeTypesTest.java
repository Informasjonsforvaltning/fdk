package no.dcat.themes.builders;

import no.dcat.themes.Types;
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
        String sourceUrl = Types.rightsstatement.getSourceUrl();
        logger.info(sourceUrl);

        Assert.assertNotNull(sourceUrl);
    }
}
