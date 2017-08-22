package no.dcat.portal.webapp;

import org.apache.commons.io.IOUtils;
import org.junit.Before;
import org.junit.Ignore;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.test.web.ModelAndViewAssert;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpSession;
import java.util.Locale;

import static org.junit.Assert.assertEquals;
import static org.mockito.Mockito.*;

/**
 * Created by nodavsko on 18.10.2016.
 */
public class PortalControllerTests {
    private static Logger logger = LoggerFactory.getLogger(PortalControllerTests.class);

    private PortalController portal;

    @Before
    public void setup() {
        PortalConfiguration config = new PortalConfiguration();
        portal = new PortalController(config);
    }

    @Test
    public void testDatasetsRedirectsToSearchkit () throws Exception {

        MockHttpSession session = new MockHttpSession();
        ModelAndView actual = portal.result(session, "","", "", "");

        assertEquals("searchkit", actual.getViewName());
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


    @Ignore
    @Test
    public void themesThrowsException() throws  Exception {
        HttpSession mockSession = mock(HttpSession.class);
        ModelAndView actual = portal.themes(mockSession);

        ModelAndViewAssert.assertViewName(actual, "error");
    }

    @Ignore
    @Test
    public void themesReturnsOK() throws  Exception {
        String themesJson = readFile("themeCount.json");
        PortalController spyPortal = spy(portal);
        LocaleContextHolder.setLocale(new Locale("nb", "NO"));

        doReturn(themesJson).when(spyPortal).httpGet(anyObject(), anyObject());
        HttpSession mockSession = mock(HttpSession.class);

        ModelAndView actual = spyPortal.themes(mockSession);

        ModelAndViewAssert.assertViewName(actual, "theme");
        assertEquals("nb",actual.getModel().get("lang"));
    }

    @Ignore
    @Test
    public void themesReturnWithLangENOK() throws  Exception {
        String themesJson = readFile("themeCount.json");
        PortalController spyPortal = spy(portal);
        LocaleContextHolder.setLocale(Locale.UK);

        doReturn(themesJson).when(spyPortal).httpGet(anyObject(), anyObject());
        HttpSession mockSession = mock(HttpSession.class);

        ModelAndView actual = spyPortal.themes(mockSession);

        ModelAndViewAssert.assertViewName(actual, "theme");
        assertEquals("en",actual.getModel().get("lang"));
    }

    @Test
    public void publisherWithNoMockReturnsErrorView () throws Exception {

        ModelAndView actual = portal.publisher();

        ModelAndViewAssert.assertViewName(actual, "error");
    }

    @Test
    public void publisherWithMockReturnPublisherView() throws  Exception {
        String publisherJson = readFile("publisherDataset.json");
        String publishercount = readFile("publishercount.json");
        PortalController spyPortal = spy(portal);

        doReturn(publisherJson).doReturn(publishercount).when(spyPortal).httpGet(anyObject(), anyObject());

        ModelAndView actual = spyPortal.publisher();

        ModelAndViewAssert.assertViewName(actual, "publisher");

    }


    private String readFile(String filename) {
        String result = null;
        try {
            result = IOUtils.toString(getClass().getClassLoader().getResourceAsStream(filename));
        } catch (Exception e) {

        }
        return result;
    }

}
