package no.acat.harvester;

import no.dcat.client.referencedata.ReferenceDataClient;
import no.dcat.shared.SkosCode;
import no.dcat.shared.testcategories.UnitTest;
import org.elasticsearch.client.Client;
import org.junit.Test;
import org.junit.experimental.categories.Category;

import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertThat;
import static org.mockito.Mockito.mock;

/**
 * Created by bjg on 26.09.2018.
 */
@Category(UnitTest.class)
public class ApiDocumentBuilderTest {


    @Test
    public void createProvenanceSortNational() {

        Client elasticsearchClient = mock(Client.class);
        ReferenceDataClient referencedataClient = mock(ReferenceDataClient.class);

        ApiDocumentBuilder builder = new ApiDocumentBuilder(elasticsearchClient, referencedataClient, "http://some.url");

        SkosCode provenanceCode = new SkosCode();
        provenanceCode.setCode("NASJONAL");

        assertThat(builder.createProvenanceSort(provenanceCode), is("1NASJONAL"));
    }


    @Test
    public void createProvenanceSortVedtak() {

        Client elasticsearchClient = mock(Client.class);
        ReferenceDataClient referencedataClient = mock(ReferenceDataClient.class);

        ApiDocumentBuilder builder = new ApiDocumentBuilder(elasticsearchClient, referencedataClient, "http://some.url");

        SkosCode provenanceCode = new SkosCode();
        provenanceCode.setCode("VEDTAK");

        assertThat(builder.createProvenanceSort(provenanceCode), is("2VEDTAK"));
    }

    @Test
    public void createProvenanceSortNoCodeSupplied() {

        Client elasticsearchClient = mock(Client.class);
        ReferenceDataClient referencedataClient = mock(ReferenceDataClient.class);

        ApiDocumentBuilder builder = new ApiDocumentBuilder(elasticsearchClient, referencedataClient, "http://some.url");

        //no code set
        SkosCode provenanceCode = new SkosCode();

        assertThat(builder.createProvenanceSort(provenanceCode), is("9UKJENT"));
    }
}
