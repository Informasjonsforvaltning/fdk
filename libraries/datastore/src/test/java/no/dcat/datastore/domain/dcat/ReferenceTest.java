package no.dcat.datastore.domain.dcat;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.GsonBuilder;
import no.dcat.datastore.domain.dcat.builders.DatasetBuilder;
import no.dcat.datastore.domain.dcat.builders.DcatBuilder;
import no.dcat.shared.Catalog;
import no.dcat.shared.Dataset;
import no.dcat.shared.Reference;
import no.fdk.test.testcategories.UnitTest;
import org.apache.jena.rdf.model.Model;
import org.apache.jena.rdf.model.ModelFactory;
import org.hamcrest.Matchers;
import org.junit.Assert;
import org.junit.Test;
import org.junit.experimental.categories.Category;

import java.io.ByteArrayInputStream;
import java.util.Arrays;
import java.util.List;

import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertThat;

@Category(UnitTest.class)
public class ReferenceTest {

    String referencesJson = "[  \n" +
        "  {  \n" +
        "     \"referenceType\":{  \n" +
        "        \"uri\":\"\",\n" +
        "         \"code\":\"\",\n" +
        "         \"prefLabel\":{  \n" +
        "           \"nb\":\"\"\n" +
        "         }\n" +
        "      },\n" +
        "      \"source\":{  \n" +
        "        \"uri\":\"\",\n" +
        "         \"prefLabel\":{  \n" +
        "           \"nb\":\"\"\n" +
        "         }\n" +
        "      }\n" +
        "   }\n" +
        "]";


    @Test
    public void canMarsalReferenceWithGson() throws Throwable {


        Reference[] references = new GsonBuilder().create().fromJson(referencesJson, Reference[].class);

        Assert.assertThat(references.length, Matchers.is(1));

        Assert.assertThat(references[0].getReferenceType().getPrefLabel().get("nb"), Matchers.is(""));

    }

    @Test
    public void canParseReferenceWithJackson() throws Throwable {
        ObjectMapper mapper = new ObjectMapper();

        Reference[] references = mapper.readValue(referencesJson, Reference[].class);
        Assert.assertThat(references.length, Matchers.is(1));

        Assert.assertThat(references[0].getReferenceType().getPrefLabel().get("nb"), Matchers.is(""));

    }

    @Test
    public void canCreateRDF() throws Throwable {
        String referenceJson = "{\n" +
            "\t\t\t\"referenceType\": {\n" +
            "\t\t\t\t\"uri\": \"http://purl.org/dc/source\",\n" +
            "\t\t\t\t\"code\": \"source\",\n" +
            "\t\t\t\t\"prefLabel\": {\n" +
            "\t\t\t\t\t\"nb\": \"Er avledet fra\"\n" +
            "\t\t\t\t}\n" +
            "\t\t\t},\n" +
            "\t\t\t\"source\": {\n" +
            "\t\t\t\t\"uri\": \"614a1c83-6fcd-4712-bcfa-fdcbccbc0a72\",\n" +
            "\t\t\t\t\"prefLabel\": {\n" +
            "\t\t\t\t\t\"nb\": \"Medlemsliste Berlevågs mannskor\"\n" +
            "\t\t\t\t},\n" +
            "\t\t\t\t\"extraType\": null\n" +
            "\t\t\t}\n" +
            "\t\t}";
        Reference reference = new GsonBuilder().create().fromJson(referenceJson, Reference.class);

        Dataset d1 = new Dataset();
        d1.setReferences(Arrays.asList(reference));
        d1.setUri("http://dataset1");

        Reference r2 = new Reference();


        Catalog c = new Catalog();
        c.setId("1234567891");
        c.setUri("http://catalog1");

        c.setDataset(Arrays.asList(d1));

        DcatBuilder builder = new DcatBuilder();
        builder.addCatalog(c);

        String dcat = builder.getDcatOutput("TURTLE");


        Model m = ModelFactory.createDefaultModel();
        m.read(new ByteArrayInputStream(dcat.getBytes()), null, "TTL");
        DatasetBuilder db = new DatasetBuilder(m);
        List<Dataset> datasets = db.build().getDataset();

        assertThat(datasets.size(), is(1));
        Dataset actual = datasets.get(0);
        assertThat(actual.getReferences().size(), is(1));

        Reference actualRef = actual.getReferences().get(0);
        assertThat(actualRef.getSource().getUri(), containsString("614a1c83-6fcd-4712-bcfa-fdcbccbc0a72"));
        assertThat(actualRef.getSource().getPrefLabel().get("nb"), is("Medlemsliste Berlevågs mannskor"));

    }

}
