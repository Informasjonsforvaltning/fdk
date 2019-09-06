package no.ccat.service;

import no.ccat.model.ConceptDenormalized;
import no.fdk.test.testcategories.UnitTest;
import org.junit.Before;
import org.junit.Test;
import org.junit.experimental.categories.Category;
import org.springframework.core.io.ClassPathResource;

import java.io.InputStreamReader;
import java.io.Reader;
import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.mockito.Mockito.mock;

@Category(UnitTest.class)
public class RDFToModelTransformerTest {

    private RDFToModelTransformer transformer;
    private ConceptDenormalizedRepository conceptDenormalizedRepository;
    private ConceptBuilderService conceptBuilderService;

    @Before
    public void setup() {

        conceptDenormalizedRepository = mock(ConceptDenormalizedRepository.class);
        conceptBuilderService = mock(ConceptBuilderService.class);

        transformer = new RDFToModelTransformer(conceptBuilderService, conceptDenormalizedRepository);
    }

    @Test
    public void testSingleConcept() throws Throwable {
        Reader reader = new InputStreamReader(new ClassPathResource("difiConcept.turtle").getInputStream());

        List<ConceptDenormalized> concepts = transformer.getConceptsFromStream(reader);

        assertEquals("We should get 1 concept", 1, concepts.size());

        ConceptDenormalized testConcept = concepts.get(0);
        assertNotNull(testConcept.getExample());
        assertNotNull(testConcept.getDefinition());
        assertEquals(2, testConcept.getApplication().size());
        assertEquals("fotball",testConcept.getApplication().get(0).get("nb"));
        assertEquals("tennis",testConcept.getApplication().get(1).get("nb"));
        assertEquals("https://somewhere.com",testConcept.getDefinition().getRange().getUri());
        assertEquals("someomfangtekst",testConcept.getDefinition().getRange().getText().get("nb"));
    }

    @Test
    public void testSourceInConceptAndHarvestFromConceptCatalogue() throws Throwable {
        Reader reader = new InputStreamReader(new ClassPathResource("ConceptCatalogueHarvest.turtle").getInputStream());

        List<ConceptDenormalized> concepts = transformer.getConceptsFromStream(reader);

        assertEquals("We should get 2 concept", 2, concepts.size());
    }
}
