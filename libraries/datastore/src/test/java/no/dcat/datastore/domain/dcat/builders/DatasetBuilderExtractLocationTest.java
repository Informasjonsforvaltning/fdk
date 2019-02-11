package no.dcat.datastore.domain.dcat.builders;

import no.dcat.shared.SkosCode;
import no.fdk.test.testcategories.UnitTest;
import org.apache.jena.rdf.model.Model;
import org.apache.jena.rdf.model.Resource;
import org.apache.jena.riot.RDFDataMgr;
import org.junit.Test;
import org.junit.experimental.categories.Category;

import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.notNullValue;
import static org.junit.Assert.assertThat;

@Category(UnitTest.class)
public class DatasetBuilderExtractLocationTest {

    @Test
    public void createLocation() {
        final String locationUri = "http://data.geonorge.no/administrativeEnheter/fylke/id/173150";
        Model model = RDFDataMgr.loadModel("location_geonorge_fylke.ttl");
        Resource location = model.getResource(locationUri);

        SkosCode locationCode = DatasetBuilder.extractLocation(location);

        assertThat(locationCode, is(notNullValue()));
        assertThat(locationCode.getUri(), is(locationUri));
        assertThat(locationCode.getCode(), is(locationUri));
        assertThat(locationCode.getPrefLabel().get("no"), is("Sogn og Fjordane"));
    }

    @Test
    public void extractLocationFromGeonorgeKommune() {
        final String locationUri = "http://data.geonorge.no/administrativeEnheter/kommune/id/172746";
        Model model = RDFDataMgr.loadModel("location_geonorge_kommune.jsonld");
        Resource location = model.getResource(locationUri);

        SkosCode locationCode = DatasetBuilder.extractLocation(location);

        assertThat(locationCode, is(notNullValue()));
        assertThat(locationCode.getUri(), is(locationUri));
        assertThat(locationCode.getCode(), is(locationUri));
        assertThat(locationCode.getPrefLabel().get("no"), is("Jølster"));
    }

    @Test
    public void extractLocationFromGeonamesData() {
        final String locationUri = "http://sws.geonames.org/3143242/";
        Model model = RDFDataMgr.loadModel("location_geonames_oslo.xml");
        Resource location = model.getResource(locationUri);

        SkosCode locationCode = DatasetBuilder.extractLocation(location);

        assertThat(locationCode, is(notNullValue()));
        assertThat(locationCode.getUri(), is(locationUri));
        assertThat(locationCode.getCode(), is(locationUri));
        assertThat(locationCode.getPrefLabel().get("no"), is("Oslo"));
    }
}
