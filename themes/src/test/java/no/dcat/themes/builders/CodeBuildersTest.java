package no.dcat.themes.builders;

import no.dcat.shared.SkosCode;
import org.apache.jena.rdf.model.Model;
import org.apache.jena.rdf.model.ModelFactory;
import org.junit.Test;

import java.io.File;
import java.io.IOException;
import java.util.List;

import static org.junit.Assert.assertEquals;

/**
 * Test class for CodeBuildersTest
 */
public class CodeBuildersTest {

    @Test
    public void testModel() throws IOException {
        Model model = createModel();
        List<SkosCode> codes = new CodeBuilders(model).build();

        assertEquals("http://data.brreg.no/datakatalog/provinens/vedtak", codes.get(0).getUri());
        assertEquals("Governmental decisions", codes.get(0).getPrefLabel().get("en"));
        assertEquals("Statlig vedtak", codes.get(0).getPrefLabel().get("nb"));
        assertEquals("Statlig vedtak", codes.get(0).getPrefLabel().get("nn"));

        assertEquals("http://data.brreg.no/datakatalog/provinens/bruker", codes.get(1).getUri());
        assertEquals("User collection", codes.get(1).getPrefLabel().get("en"));
        assertEquals("Brukerinnsamling", codes.get(1).getPrefLabel().get("nb"));
        assertEquals("Brukerinnsamling", codes.get(1).getPrefLabel().get("nn"));
    }

    private Model createModel() throws IOException {
        String defultPath = new File(".").getCanonicalPath().toString();
        String fileWithPath = String.format("file:%s/src/test/resources/rdf/%s", defultPath, "provenance.rdf");

        final Model model = ModelFactory.createDefaultModel();
        model.read(fileWithPath);
        return model;
    }
}