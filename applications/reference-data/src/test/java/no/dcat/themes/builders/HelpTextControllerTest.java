package no.dcat.themes.builders;

import no.dcat.shared.HelpText;
import no.dcat.themes.Controller;
import static org.junit.Assert.*;
import org.hamcrest.Matchers;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;


import java.util.List;

/**
 * Created by extkkj on 10.10.2017.
 */

@SpringBootTest
@RunWith(SpringRunner.class)
public class HelpTextControllerTest {
        @Autowired
        private Controller controller;

        @Test
        public void helpTextsHasDesc() throws Throwable {
            List<HelpText> helpTexts = controller.helpTexts("foo");
            //           helpTexts.stream().anyMatch(helpText -> {helpText.get
            //                   equals("http://brreg.no/fdk/fields#Dataset_title")});
            assertThat(helpTexts.get(2).getDescription().get("nb"), Matchers.is(Matchers.startsWith("En setnings-beskrivelse av formålet til datasettet")));
        }

        @Test
        public void helpTextsHasAbstract() throws Throwable {
        List<HelpText> helpTexts = controller.helpTexts("foo");
            assertEquals(helpTexts.get(2).getAbstract().get("nb"), "Beskrivelsen skal være kortfattet og ikke gjentas i Beskrivelsesfeltet.");
            assertEquals(helpTexts.get(2).getShortdesc().get("nb"), "Beskrivelsen skal være kortfattet og ikke gjentas i Beskrivelsesfeltet.");
            System.out.println("OMG" + helpTexts.get(2).getShortdesc().toString());
        }
    }
