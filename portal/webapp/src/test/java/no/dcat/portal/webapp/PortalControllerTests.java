package no.dcat.portal.webapp;

import static org.junit.Assert.*;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.web.servlet.ModelAndView;


/**
 * Created by nodavsko on 18.10.2016.
 */
@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment= SpringBootTest.WebEnvironment.RANDOM_PORT)
public class PortalControllerTests {
    private static Logger logger = LoggerFactory.getLogger(PortalControllerTests.class);

    @MockBean
    PortalConfiguration config;

    @Test
    public void testResultsReturnsModelAndView () throws Exception {
        PortalController controller = new PortalController(config);
        MockHttpSession session = new MockHttpSession();
        ModelAndView actual = controller.result(session, "", "", "");

        assertEquals("", actual.getModel().get("themes"));
        assertEquals("", actual.getModel().get("publisher"));
        assertEquals("", actual.getModel().get("q"));
    }

    @Test
    public void testDetailsAPI() throws Exception {
        PortalController controller = new PortalController(config);
        ModelAndView actual = controller.detail("anyIdHere");

        assertNotEquals("OK", null, actual);

    }


}
