package no.fdk.searchapi;

import no.fdk.searchapi.controller.SupportedFormat;
import no.fdk.test.testcategories.UnitTest;
import org.apache.jena.riot.Lang;
import org.junit.Test;
import org.junit.experimental.categories.Category;

import java.util.Optional;

import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertThat;

@Category(UnitTest.class)
public class SupportedFormatTest {

    @Test
    public void getFormat_acceptHeader_givesCorrectLang() throws Exception {
        assertThat(SupportedFormat.getFormat("application/ld+json").get().getResponseFormat(), is(Lang.JSONLD));
        assertThat(SupportedFormat.getFormat("application/rdf+xml").get().getResponseFormat(), is(Lang.RDFXML));
        assertThat(SupportedFormat.getFormat("text/turtle").get().getResponseFormat(), is(Lang.TURTLE));

        assertThat(SupportedFormat.getFormat("*/*"), is(Optional.empty()));
    }

}
