package no.dcat.harvester.notification;

import ch.qos.logback.classic.Logger;
import no.dcat.harvester.crawler.notification.HarvestLogger;
import org.junit.Test;

import java.io.File;

import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;
import static org.hamcrest.CoreMatchers.containsString;

/**
 * Created by bjg on 15.01.2018.
 */
public class HarvestLoggerTest {
    @Test
    public void logMessagesShouldBeSaved() {
        HarvestLogger hl = new HarvestLogger("test.log");
        Logger logger = hl.getLogger();

        logger.info("test message");

        String actualLogContents = hl.getLogContents(logger);
        //cleanup
        hl.closeLog();

        assertThat(actualLogContents, containsString("test message"));
    }


    @Test
    public void logFileShouldBeDeletedAfterClosing() {
        HarvestLogger hl = new HarvestLogger("test.log");
        Logger logger = hl.getLogger();

        logger.info("test message");
        hl.closeLog();

        //assertThat(actualLogContents, containsString("test message"));
        File file = new File("test.log");
        assertThat(file.exists(), is(false));
    }
}
