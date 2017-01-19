package no.dcat.harvester.dcat.domain.theme.builders;

import no.dcat.harvester.crawler.client.RetrieveRemote;
import org.apache.jena.rdf.model.Model;
import org.junit.Test;

import static org.junit.Assert.assertNotNull;

/**
 * Created by dask on 18.01.2017.
 */
public class RetrieveModelTest {


    @Test
    public void retrieveLocalModell() {
        Model actual = RetrieveRemote.localRDF("rdf/provenance.rdf");

        assertNotNull(actual);
    }
}
