package no.dcat.portal.webapp.comparator;

import no.dcat.shared.DataTheme;
import org.junit.Test;

import java.util.HashMap;
import java.util.Map;

import static org.junit.Assert.assertEquals;

/**
 * Class for testing ThemeTitleComparator
 */
public class ThemeTitleComparatorTest {
    private static ThemeTitleComparator ttc = new ThemeTitleComparator("nb");
    private static DataTheme d1 = new DataTheme();
    private static DataTheme d2 = new DataTheme();
    private static int equal = 0;
    private static int greaterThan = 1;
    private static int lessThan = -1;

    @Test
    public void testBothTitleNull() {
        d1.setTitle(null);
        d2.setTitle(null);

        assertEquals(equal, ttc.compare(d1, d2));
    }

    @Test
    public void testBothTitleNbNull() {
        Map t = new HashMap();
        t.put("nb", null);

        d1.setTitle(t);
        d2.setTitle(t);

        assertEquals(equal, ttc.compare(d1, d2));
    }

    @Test
    public void testFirstTitleNull() {
        Map t = new HashMap();
        t.put("nb", null);

        d1.setTitle(null);
        d2.setTitle(t);

        assertEquals(lessThan, ttc.compare(d1, d2));
    }

    @Test
    public void testSeconfTitleNull() {
        Map t = new HashMap();
        t.put("nb", null);

        d1.setTitle(t);
        d2.setTitle(null);

        assertEquals(greaterThan, ttc.compare(d1, d2));
    }

    @Test
    public void testFirstTitleNbNull() {
        Map t = new HashMap();
        t.put("nb", null);

        Map t2 = new HashMap();
        t2.put("nb", "");

        d1.setTitle(t);
        d2.setTitle(t2);

        assertEquals(lessThan, ttc.compare(d1, d2));
    }

    @Test
    public void testSecondTitleNbNull() {
        Map t = new HashMap();
        t.put("nb", null);

        Map t2 = new HashMap();
        t2.put("nb", "");

        d1.setTitle(t2);
        d2.setTitle(t);

        assertEquals(greaterThan, ttc.compare(d1, d2));
    }

    @Test
    public void testCompare() {
        Map t = new HashMap();
        t.put("nb", "A");

        Map t2 = new HashMap();
        t2.put("nb", "B");

        d1.setTitle(t);
        d2.setTitle(t2);

        assertEquals(lessThan, ttc.compare(d1, d2));
    }

}