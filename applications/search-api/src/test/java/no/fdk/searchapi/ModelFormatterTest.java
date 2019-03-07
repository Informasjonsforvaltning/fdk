package no.fdk.searchapi;

import no.fdk.searchapi.controller.ModelFormatter;
import no.fdk.searchapi.controller.SupportedFormat;
import no.fdk.test.testcategories.UnitTest;
import org.apache.jena.rdf.model.Model;
import org.apache.jena.rdf.model.ModelFactory;
import org.junit.Before;
import org.junit.Test;
import org.junit.experimental.categories.Category;

import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertThat;


@Category(UnitTest.class)
public class ModelFormatterTest {

    private ModelFormatter modelFormatter;

    @Before
    public void setUp() throws Exception {
        Model model = ModelFactory.createDefaultModel();
        modelFormatter = new ModelFormatter(model);
    }

    @Test
    public void format_xml() throws Exception {
        String expectedResult = "<rdf:RDF\r\n    xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\">\r\n</rdf:RDF>\r\n";
        assertThat(removeLinebreak(modelFormatter.format(SupportedFormat.RDF_XML.getAccept())), is(removeLinebreak(expectedResult)));
    }

    @Test
    public void format_jsonld() throws Exception {
        String expectedResult = "{ }\n";
        assertThat(removeLinebreak(modelFormatter.format(SupportedFormat.JSON_LD.getAccept())), is(removeLinebreak(expectedResult)));
    }

    @Test
    public void format_csv() throws Exception {
        String expectedResult = "";
        assertThat(modelFormatter.format(SupportedFormat.TURTLE.getAccept()), is(expectedResult));
    }

    private String removeLinebreak(String input) {
        return input.replaceAll("[ \\r\\n]", "");
    }

}
