package no.dcat.themes.builders;

import no.dcat.shared.HelpText;
import no.dcat.themes.Controller;

import static org.junit.Assert.*;

import static org.hamcrest.Matchers.*;

import org.apache.jena.shared.NotFoundException;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;


import java.util.List;
import java.util.function.Predicate;

/**
 * Created by extkkj on 10.10.2017.
 */

@SpringBootTest
@RunWith(SpringRunner.class)
public class HelpTextControllerTest {
    @Autowired
    private Controller controller;

    @Test
    public void helpTextsSingleIsSingle() throws Throwable {
        List<HelpText> helpTexts = controller.helpTexts("Dataset_description");
        assertEquals(helpTexts.size(), 1);
    }

    @Test
    public void helpTextsMoreisMore() throws Throwable {
        List<HelpText> helpTexts = controller.helpTexts();
        assertThat(helpTexts.size(), greaterThan(1));
    }

    @Test
    public void helpTextsSingleHasDesc() throws Throwable {
        List<HelpText> helpTexts = controller.helpTexts("Dataset_description");
        assertThat(helpTexts.get(0).getDescription(), is(notNullValue()));
     //   assertThat(helpTexts.get(0).getDescription(), isMapContaining); Want to test the Map<String, String> structure
        assertThat(helpTexts.get(0).getDescription().get("nb"), is(notNullValue()));
    }

    @Test
    public void helpTextsSingleHasAbstract() throws Throwable {
        List<HelpText> helpTexts = controller.helpTexts("Dataset_description");
        assertThat(helpTexts.get(0).getShortdesc(), is(notNullValue()));
        assertThat(helpTexts.get(0).getAbstract(), is(notNullValue()));
        //   assertThat(helpTexts.get(0).getShortdesc(), isMapContaining); Want to test the Map<String, String> structure
        assertThat(helpTexts.get(0).getShortdesc().get("nb"), is(notNullValue()));
    }

    @Test(expected = NotFoundException.class)
    public void helpTextSingleThrows() throws Throwable {
        List<HelpText> helpTexts = controller.helpTexts("Dahut_description");
    }

        @Test
    public void helpTextsMoreHasDesc() throws Throwable {
        List<HelpText> helpTexts = controller.helpTexts();
        assertThat(helpTexts.get(0).getDescription(), is(notNullValue()));
        //   assertThat(helpTexts.get(0).getDescription(), isMapContaining); Want to test the Map<String, String> structure
        assertThat(helpTexts.get(0).getDescription().get("nb"), is(notNullValue()));
        assertTrue(helpTexts.stream().allMatch(helpText -> helpText.getDescription().containsKey("nb")));
        assertTrue(helpTexts.stream().anyMatch(helpText -> helpText.getDescription().get("nb").contains("beskrivelse")));
    }

    @Test
    public void helpTextsMoreHasAbstract() throws Throwable {
        List<HelpText> helpTexts = controller.helpTexts();
        assertThat(helpTexts.get(0).getShortdesc(), is(notNullValue()));
        assertThat(helpTexts.get(0).getAbstract(), is(notNullValue()));
        //   assertThat(helpTexts.get(0).getShortdesc(), isMapContaining); Want to test the Map<String, String> structure
        assertThat(helpTexts.get(0).getShortdesc().get("nb"), is(notNullValue()));
        assertTrue(helpTexts.stream().allMatch(helpText -> helpText.getShortdesc().containsKey("nb")));
    }



}
