package no.dcat.portal.webapp;

import no.dcat.portal.webapp.domain.DataTheme;
import no.dcat.portal.webapp.domain.Dataset;
import no.dcat.portal.webapp.domain.Distribution;
import no.dcat.portal.webapp.utility.ResponseManipulation;
import no.dcat.shared.SkosCode;
import org.junit.Test;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNull;

/**
 * Class for testing ResponseManipulation.
 */
public class ResponseManipulationTest {

    @Test
    public void testEnglishToNorwegianForAllAffectedFields() {
        ResponseManipulation rm = new ResponseManipulation();

        List<DataTheme> ldt = createTheme("en", "englishTitel", null, null);

        List<String> englishKeyWords = new ArrayList<>();
        englishKeyWords.add("key1");
        englishKeyWords.add("key2");
        Map<String, List<String>> kw = createKeyWords(englishKeyWords, "en");

        List<Distribution> ld = createDistrubution("en", "Dist.titel", "Dist.beskr");

        SkosCode accrual = new SkosCode("testcode", "code", new HashMap<String,String>());
        accrual.getPrefLabel().put("en", "very often");

        Dataset ds = new Dataset();
        ds.setTheme(ldt);
        ds.setKeyword(kw);
        ds.setDistribution(ld);

        rm.fillWithAlternativeLangValIfEmpty(ds, "nb");

        assertEquals("englishTitel", ds.getTheme().get(0).getTitle().get("nb"));
        assertEquals("key1", ds.getKeyword().get("nb").get(0));
        assertEquals("key2", ds.getKeyword().get("nb").get(1));
        assertEquals("Dist.titel", ds.getDistribution().get(0).getTitle().get("nb"));
        assertEquals("Dist.beskr", ds.getDistribution().get(0).getDescription().get("nb"));
    }

    @Test
    public void testNbFieldIsSelectedFirst() {
        ResponseManipulation rm = new ResponseManipulation();

        List<DataTheme> ldt = createTheme("en", "englishTitel", "nb", "norTitel");

        Dataset ds = new Dataset();
        ds.setTheme(ldt);

        rm.fillWithAlternativeLangValIfEmpty(ds, "nb");

        assertEquals("norTitel", ds.getTheme().get(0).getTitle().get("nb"));
    }

    @Test
    public void testEmptyFieldDontcreateAnNBField() {
        ResponseManipulation rm = new ResponseManipulation();

        List<DataTheme> ldt = createTheme(null, null, null, null);

        Dataset ds = new Dataset();
        ds.setTheme(ldt);

        rm.fillWithAlternativeLangValIfEmpty(ds, "nb");

        assertNull(null, ds.getTheme().get(0).getTitle().get("nb"));
    }

    @Test
    public void testEmptyTheme() {
        ResponseManipulation rm = new ResponseManipulation();

        Dataset ds = new Dataset();

        rm.fillWithAlternativeLangValIfEmpty(ds, "nb");

        assertNull(null, ds.getTheme());
    }

    private List<Distribution> createDistrubution(String lang, String distributionValue, String distributionBesk) {
        List<Distribution> ld = new ArrayList<Distribution>();
        Distribution dist = new Distribution();
        Map<String, String> title = new HashMap<>();
        Map<String, String> besk = new HashMap<>();

        title.put(lang, distributionValue);
        besk.put(lang, distributionBesk);

        dist.setTitle(title);
        dist.setDescription(besk);

        ld.add(dist);

        return ld;
    }

    private Map<String, List<String>> createKeyWords(List<String> keys1, String lang1) {
        Map<String, List<String>> kw = new HashMap<>();
        List<String> lkw = new ArrayList();

        for (String key : keys1) {
            lkw.add(key);
        }

        kw.put(lang1, lkw);

        return kw;
    }

    private List<DataTheme> createTheme(String langEn, String englishTitle, String langNo, String NbTitle) {
        DataTheme dt = new DataTheme();
        Map<String, String> titles = new HashMap<>();

        if(langEn != null) {
            titles.put(langEn, englishTitle);
        }

        if(langNo != null) {
            titles.put(langNo, NbTitle);
        }

        dt.setTitle(titles);

        List<DataTheme> ldt = new ArrayList<>();
        ldt.add(dt);
        return ldt;
    }
}