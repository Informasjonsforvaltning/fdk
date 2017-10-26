package no.difi.dcat.datastore.domain.dcat;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.GsonBuilder;
import no.dcat.shared.Reference;
import org.hamcrest.Matchers;
import org.junit.Assert;
import org.junit.Test;

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

}
