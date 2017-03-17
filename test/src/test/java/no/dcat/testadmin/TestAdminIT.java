package no.dcat.testadmin;

import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.test.context.junit4.SpringRunner;

import javax.servlet.http.HttpSession;

import static org.junit.Assert.*;
import static org.hamcrest.Matchers.*;

/**
 * Created by nodavsko on 03.11.2016.
 */
@RunWith(SpringRunner.class)
public class TestAdminIT {
    private static Logger logger = LoggerFactory.getLogger(TestAdminIT.class);


    @Test
    public void loadTest() {
        TestAdminController tac = new TestAdminController();

        HttpSession session = new MockHttpSession();
        ClassLoader classLoader = getClass().getClassLoader();


        String url = classLoader.getResource("dataset.ttl").getFile();

        //tac.load("dataset.ttl", session);



    }

    @Test
    public void createFusekiDatasetOK() throws Throwable {

        TestAdminController controller = new TestAdminController();

        ResponseEntity<String> actual = controller.createFusekiDataset("xdcat");

        logger.info (actual.toString());

        assertThat(actual.getStatusCode(), is(HttpStatus.OK));
    }


    @Test
    public void deleteFusekiDatasetOK() throws Throwable {

        TestAdminController controller = new TestAdminController();

        ResponseEntity<String> actual = controller.deleteFusekiDataset("xdcat");

        logger.info(actual.toString());

        assertThat(actual.getStatusCode(), is(HttpStatus.OK));

    }

    @Test
    public void loadDatasetOK() throws Throwable {

        TestAdminController controller = new TestAdminController();

        ResponseEntity<String> actual = controller.load("test-data.ttl", "");
        logger.info(actual.toString());

        assertThat(actual.getStatusCode(), is(HttpStatus.OK));

    }
}
