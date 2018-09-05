package no.acat.harvester;

import no.acat.model.ApiDocument;
import no.acat.service.ElasticsearchService;
import no.acat.service.ReferenceDataService;
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
        ReferenceDataService referenceDataService = mock(ReferenceDataService.class);
        ApiHarvester harvester = new ApiHarvester(elasticsearchService, referenceDataService);

        ApiHarvester spyHarvester = spy(harvester);
        doNothing().when(spyHarvester).indexApi(any());

        ApiDocumentBuilder mockApiDocumentBuilder = mock(ApiDocumentBuilder.class);
        doReturn(new ApiDocument()).when(mockApiDocumentBuilder).create(any());

        doReturn(mockApiDocumentBuilder).when(spyHarvester).createApiDocumentBuilder();

        List<ApiDocument> response = spyHarvester.harvestAll();
        final int FROM_HARDCODED = 2;
        final int FROM_CSV = 5;
        assertThat(response.size(), is(FROM_CSV + FROM_HARDCODED));

    }
}
