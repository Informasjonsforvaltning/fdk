package no.dcat.portal.webapp;

import static org.junit.Assert.*;

import com.fasterxml.jackson.core.JsonParser;
import org.apache.commons.io.IOUtils;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.powermock.api.mockito.PowerMockito;
import org.powermock.api.support.membermodification.MemberMatcher;
import org.powermock.core.classloader.annotations.PrepareForTest;
import org.powermock.modules.junit4.rule.PowerMockRule;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootContextLoader;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.test.web.ModelAndViewAssert;
import org.springframework.web.servlet.ModelAndView;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.net.URI;

import static org.mockito.Mockito.*;

/**
 * Created by nodavsko on 18.10.2016.
 */
@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest
public class PortalControllerTests {
    private static Logger logger = LoggerFactory.getLogger(PortalControllerTests.class);

    private PortalController portal;

    @Before
    public void setup() {
        PortalConfiguration config = new PortalConfiguration();
        ReflectionTestUtils.setField(config, "queryServiceExternal", "http://query.service.external.no/");
        ReflectionTestUtils.setField(config, "queryService", "http://query.service.no/");

        portal = new PortalController(config);

    }

    @Test
    public void testResultReturnsModelAndView () throws Exception {

        MockHttpSession session = new MockHttpSession();
        ModelAndView actual = portal.result(session, "", "", "");

        assertEquals("result", actual.getViewName());
        assertEquals(null, actual.getModel().get("themes"));
        assertEquals("", actual.getModel().get("query"));
    }

    @Test
    public void testDetailWithWrongIdReturnsErrorView() throws Exception {

        ModelAndView actual = portal.detail("anyIdHere");

        assertEquals("error", actual.getViewName());
    }


    @Test
    public void testDetailWithOKIdReturnsDetailView() throws Exception {
        String detailJson = readFile("detailTestDataset.json");
        PortalController spyPortal = spy(portal);
        doReturn(detailJson).when(spyPortal).httpGet(anyObject(),anyObject());

        ModelAndView actual = spyPortal.detail("ignoreId");

        ModelAndViewAssert.assertViewName(actual, "detail");
    }


    public String readFile(String filename) {
        String result = null;
        try {
            result = IOUtils.toString(getClass().getClassLoader().getResourceAsStream(filename));
        } catch (Exception e) {

        }
        return result;
    }
}
