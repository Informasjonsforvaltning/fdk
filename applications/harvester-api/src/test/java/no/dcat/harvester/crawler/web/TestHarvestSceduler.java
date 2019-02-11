package no.dcat.harvester.crawler.web;

import no.fdk.test.testcategories.UnitTest;
import org.junit.Test;
import org.junit.experimental.categories.Category;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.TriggerContext;
import org.springframework.scheduling.support.CronTrigger;

import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.Calendar;
import java.util.Date;

import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.greaterThanOrEqualTo;
import static org.junit.Assert.assertThat;

/**
 * Created by dask on 28.02.2017.
 */
@Category(UnitTest.class)
public class TestHarvestSceduler {
    private static Logger logger = LoggerFactory.getLogger(TestHarvestSceduler.class);

    final String onceAminute = ("0 */1 * * * *");
    final String oneOclock = ("0 0 1 * * *");

    @Test
    public void testEachMinute() {
        Calendar now = Calendar.getInstance();
        Calendar cal = Calendar.getInstance();
        cal.setTime(getNextExecutionTime(onceAminute));

        assertThat(cal.get(Calendar.MINUTE), equalTo((now.get(Calendar.MINUTE) + 1) % 60));
    }

    @Test
    public void testOneOclock() {
        LocalDate before = LocalDate.now();

        Calendar cal = Calendar.getInstance();
        cal.setTime(getNextExecutionTime(oneOclock));

        assertThat(cal.get(Calendar.HOUR), equalTo(1));
        assertThat(cal.get(Calendar.MINUTE), equalTo(0));
        assertThat(cal.get(Calendar.DAY_OF_YEAR), greaterThanOrEqualTo(before.getDayOfYear()));

    }

    public Date getNextExecutionTime(String cronExpression) {
        // to test if a cron expression runs only from Monday to Friday
        org.springframework.scheduling.support.CronTrigger trigger =
            new CronTrigger(cronExpression);
        Calendar today = Calendar.getInstance();
        //today.set(Calendar.DAY_OF_WEEK, Calendar.TUESDAY);

        SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss EEEE");
        final Date currentTime = today.getTime();

        logger.info("Current time is    : " + df.format(currentTime));
        Date nextExecutionTime = trigger.nextExecutionTime(new TriggerContext() {

            @Override
            public Date lastScheduledExecutionTime() {
                return currentTime;
            }

            @Override
            public Date lastActualExecutionTime() {
                return currentTime;
            }

            @Override
            public Date lastCompletionTime() {
                return currentTime;
            }
        });

        String message = "Next Execution time: " + df.format(nextExecutionTime);
        logger.info(message);

        return nextExecutionTime;
    }

    @Test
    public void checkHarvestingCronJob() throws Throwable {

    }
}
