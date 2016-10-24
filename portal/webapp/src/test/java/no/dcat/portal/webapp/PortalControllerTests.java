package no.dcat.portal.webapp;

import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.test.context.junit4.SpringRunner;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpSession;
import javax.servlet.http.HttpSessionContext;
import java.util.Enumeration;

/**
 * Created by nodavsko on 18.10.2016.
 */
@RunWith(SpringRunner.class)
public class PortalControllerTests {
    private static Logger logger = LoggerFactory.getLogger(PortalControllerTests.class);

    @MockBean
    PortalConfiguration config;

    @Test
    public void testIndex () throws Exception {
        PortalController controller = new PortalController(config);
        MockHttpSession session = new MockHttpSession();
        String actual = controller.index(session);
        logger.info(actual);

        Assert.assertNotEquals("index == home", null, actual);
    }


}
