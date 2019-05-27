package no.dcat.themes.builders;

import no.dcat.themes.service.LOSService;
import no.dcat.themes.service.LosNode;
import no.dcat.themes.service.LosRDFImporter;
import no.fdk.test.testcategories.UnitTest;
import org.junit.Before;
import org.junit.Test;
import org.junit.experimental.categories.Category;

import java.util.ArrayList;
import java.util.List;

import static org.junit.Assert.*;

@Category(UnitTest.class)
public class ReferenceTest {

    private LOSService losService;

    @Before
    public void doBefore () {
        losService = new LOSService();
        losService.losRDFImporter = new LosRDFImporter();
        losService.fillDatastructure();
    }

    @Test
    public void SpesificLosTermExists() throws Throwable {
        LosNode sykeTransport = LOSService.getByURIString("http://psi.norge.no/los/ord/syketransport");
        assertNotNull(sykeTransport);
        assertEquals("Forventet at LOS tema skulle eksistere og hete syketransport på norsk bokmål", "Syketransport",sykeTransport.getName().get("nb"));
        assertEquals("Forventet at LOS tema skulle eksistere og hete Sjuketransport på nynorsk", "Sjuketransport",sykeTransport.getName().get("nn"));
        assertEquals("Forventet at LOS tema skulle eksistere og hete Patient transport på engelsk", "Patient transport",sykeTransport.getName().get("en"));
    }

    @Test
    public void LosTermHasExpectedChildren() throws Throwable {
        LosNode arbeid = LOSService.getByURIString("http://psi.norge.no/los/tema/arbeid");
        assertNotNull(arbeid);
        assertEquals(4, arbeid.children.size());
    }

    //path for hoved-nivå
    @Test
    public void TopLevelTermHasCorrectPath() throws Throwable {
        LosNode helse = LOSService.getByURIString("http://psi.norge.no/los/tema/helse");
        assertNotNull(helse);
        assertEquals("helse",helse.losPaths.get(0));
    }

    //path for mellom nivå
    @Test
    public void MidLevelTermHasCorrectPath() throws Throwable {
        LosNode folkehelse = LOSService.getByURIString("http://psi.norge.no/los/tema/folkehelse");
        assertNotNull(folkehelse);
        assertEquals("helse/folkehelse",folkehelse.losPaths.get(0));
    }

    //path for emneord
    @Test
    public void LowLevelTermHasCorrectPath() throws Throwable {
        LosNode stoey = LOSService.getByURIString("http://psi.norge.no/los/ord/stoey");
        assertNotNull(stoey);
        assertEquals("helse/folkehelse/støy",stoey.losPaths.get(0));
    }

    //test for ekspansjon - toplevel(brittle? telle og forvente f.eks 62) ?
    @Test
    public void TopLevelTermExpansion() throws Throwable {
        List<String> expandedTheme = losService.expandLosThemes(new ArrayList<String>(){{add("http://psi.norge.no/los/tema/helse");}} );
        assertNotNull(expandedTheme);
        assertEquals(156, expandedTheme.size()); //Intentionally brittle
        assertTrue(expandedTheme.contains("Helsetjenester"));
        assertTrue(expandedTheme.contains("Spilleavhengighet"));
        assertTrue(expandedTheme.contains("Gift"));
    }

    //test for ekspanjons -midlevel
    @Test
    public void MidLevelTermExpansion() throws Throwable {
        List<String> expandedTheme = losService.expandLosThemes(new ArrayList<String>(){{add("http://psi.norge.no/los/tema/folkehelse");}} );
        assertNotNull(expandedTheme);
        assertEquals(48, expandedTheme.size()); //Intentionally brittle
        assertTrue(expandedTheme.contains("Folkehelse"));
        assertTrue(expandedTheme.contains("Helse"));
        assertTrue(expandedTheme.contains("Gift"));
        assertTrue(expandedTheme.contains("Skadedyr"));
        assertTrue(expandedTheme.contains("Infection prevention and control"));
    }

    //test for ekspansjon - lowlevel (emne)
    @Test
    public void LowLevelTermExpansion() throws Throwable {
        List<String> expandedTheme = losService.expandLosThemes(new ArrayList<String>(){{add("http://psi.norge.no/los/ord/stoey");}} );
        assertNotNull(expandedTheme);
        assertEquals(18, expandedTheme.size()); //Intentionally brittle
        assertTrue(expandedTheme.contains("Folkehelse"));
        assertTrue(expandedTheme.contains("Helse"));
        assertTrue(expandedTheme.contains("Støy"));
        assertTrue(expandedTheme.contains("Health"));
        assertTrue(expandedTheme.contains("Støyskjerming"));
    }
}
