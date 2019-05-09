package no.dcat.themes.builders;

import no.dcat.themes.service.LOSService;
import no.dcat.themes.service.LosNode;
import no.fdk.test.testcategories.UnitTest;
import org.junit.Before;
import org.junit.Test;
import org.junit.experimental.categories.Category;
import static org.junit.Assert.*;

@Category(UnitTest.class)
public class ReferenceTest {

    private LOSService losService;

    @Before
    public void doBefore () {
        losService = new LOSService();
        losService.fillDatastructure();
    }

    @Test
    public void SpesificLosTermExists() throws Throwable {
        LosNode sykeTransport = LOSService.getByURIString("http://psi.norge.no/los/ord/syketransport");
        assertNotNull(sykeTransport);
        assertEquals("Forventet at LOS tema skulle ekstere og hete syketransport på norsk bokmål", "Syketransport",sykeTransport.getName().get("nb"));
        assertEquals("Forventet at LOS tema skulle ekstere og hete Sjuketransport på nynorsk", "Sjuketransport",sykeTransport.getName().get("nn"));
        assertEquals("Forventet at LOS tema skulle ekstere og hete Patient transport på engelsk", "Patient transport",sykeTransport.getName().get("en"));
    }

    @Test
    public void LosTermHasExpectedChildren() throws Throwable {
        LosNode arbeid = LOSService.getByURIString("http://psi.norge.no/los/tema/arbeid");
        assertNotNull(arbeid);
        assertEquals(4, arbeid.children.size());
    }

}
