package no.dcat.themes.builders;

import no.dcat.shared.HelpText;
import no.dcat.themes.Controller;
import static org.junit.Assert.*;
import static org.hamcrest.Matcher.*;

import org.apache.commons.lang3.Validate;
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
        public void helpTextsExists() throws Throwable {
            List<HelpText> helpTexts = controller.helpTexts("foo");
 //           helpTexts.stream().anyMatch(helpText -> {helpText.get
 //                   equals("http://brreg.no/fdk/fields#Dataset_title")});
            String actual = helpTexts.get(2).getDescription().get("nb");
            assertThat(actual, Matchers.is(Matchers.startsWith("En setnings-beskrivelse av formålet til datasettet")));
            System.out.println(helpTexts.get(2).getDescription().toString());
        }
    }
