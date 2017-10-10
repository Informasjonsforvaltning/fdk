package no.dcat.themes.builders;

import no.dcat.shared.HelpText;
import no.dcat.themes.Controller;
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
            System.out.println(helpTexts.toString());
        }
    }
