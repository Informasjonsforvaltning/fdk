package no.dcat.portal.webapp;

import no.dcat.portal.webapp.utility.DataitemQuery;
import org.junit.Test;

import static org.junit.Assert.*;

/**
 * class for testing DataitemQuery.
 */
public class DataitemQueryTest {

    public static final String QUERY = "q";
    public static final String THEME = "theme";

    @Test
    public void populateClassTest() {
        DataitemQuery diq = new DataitemQuery();
        diq.setQ(QUERY);
        diq.setTheme(THEME);

        assertEquals(QUERY, diq.getQ());
        assertEquals(THEME, diq.getTheme());
    }

}