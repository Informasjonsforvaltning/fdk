package no.dcat.harvester.clean;

import org.junit.Test;

import static org.hamcrest.core.Is.is;
import static org.junit.Assert.assertThat;

public class HtmlCleanerTest {

    @Test
    public void clean_noHtml_sameText() throws Exception {
        String testString = "Test";
        assertThat(HtmlCleaner.clean(testString), is(testString));
    }

    @Test
    public void clean_multipleConvertions() throws Exception {
        cleanAndAssert("Test <H1> Text", "Test Text");
        cleanAndAssert("Test <BR /> Text", "Test \n Text");
        cleanAndAssert("Test <BR /> Text \n test", "Test \n Text \n test");
        cleanAndAssert("Test <P /> Text \n test", "Test \n\n Text \n test");
        cleanAndAssert("Test <P/> Text \n test", "Test \n\n Text \n test");
        cleanAndAssert("Test <P> Text \n test", "Test \n\n Text \n test");
        cleanAndAssert("Test <script>evilJavascriptCode('dangerous')</script> Text \n test", "Test Text \n test");
        cleanAndAssert("Test &nbsp;<H1> Text", "Test Text");
    }

    private void cleanAndAssert(String input, String expected) {
        assertThat(HtmlCleaner.clean(input), is(expected));
    }
}