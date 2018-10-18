package no.acat.harvester;

import no.acat.model.ApiDocument;
import no.acat.service.ApiDocumentBuilderService;
import no.acat.service.ElasticsearchService;
import no.dcat.shared.testcategories.UnitTest;
import org.junit.Test;
import org.junit.experimental.categories.Category;
import org.junit.runner.RunWith;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.List;

import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertThat;
import static org.mockito.Mockito.*;

@Category(UnitTest.class)
@RunWith(SpringRunner.class)
public class ApiHarvestTest {

    @Test
    public void harvestAllOK() throws Throwable {

        ElasticsearchService elasticsearchService = mock(ElasticsearchService.class);
        ApiDocumentBuilderService apiDocumentBuilderService = mock(ApiDocumentBuilderService.class);
        doReturn(new ApiDocument()).when(apiDocumentBuilderService).create(any());
        ApiHarvester harvester = new ApiHarvester(elasticsearchService, apiDocumentBuilderService);

        ApiHarvester spyHarvester = spy(harvester);
        doNothing().when(spyHarvester).indexApi(any());

        List<ApiDocument> response = spyHarvester.harvestAll();
        final int FROM_CSV = 11;
        assertThat(response.size(), is(FROM_CSV));

    }
}
