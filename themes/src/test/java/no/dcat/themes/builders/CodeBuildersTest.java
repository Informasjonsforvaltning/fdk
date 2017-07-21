package no.dcat.themes.builders;

import no.dcat.shared.SkosCode;
import no.dcat.shared.Types;
import no.dcat.themes.CodesService;
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
        List<SkosCode> codes = new CodesService().getCodes(Types.provenancestatement);

        SkosCode vedtak = codes.stream().filter(code -> code.getUri().equals("http://data.brreg.no/datakatalog/provinens/vedtak")).findAny().get();

        assertEquals("Governmental decisions", vedtak.getPrefLabel().get("en"));
        assertEquals("Statlig vedtak", vedtak.getPrefLabel().get("nb"));
        assertEquals("Statlig vedtak", vedtak.getPrefLabel().get("nn"));

        SkosCode bruker = codes.stream().filter(code -> code.getUri().equals("http://data.brreg.no/datakatalog/provinens/bruker")).findAny().get();

        assertEquals("User collection", bruker.getPrefLabel().get("en"));
        assertEquals("Brukerinnsamlede data", bruker.getPrefLabel().get("nb"));
        assertEquals("Brukerinnsamlede data", bruker.getPrefLabel().get("nn"));
    }


}