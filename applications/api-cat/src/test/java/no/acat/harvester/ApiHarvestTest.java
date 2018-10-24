package no.acat.harvester;

import no.acat.model.ApiDocument;
import no.acat.service.ApiDocumentBuilderService;
import no.acat.service.ElasticsearchService;
import no.acat.service.RegistrationApiService;
import no.dcat.client.registrationapi.RegistrationApiClient;
import no.dcat.shared.testcategories.UnitTest;
import org.junit.Test;
import org.junit.experimental.categories.Category;
import org.junit.runner.RunWith;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.ArrayList;

import static org.mockito.Mockito.*;

@Category(UnitTest.class)
@RunWith(SpringRunner.class)
public class ApiHarvestTest {

    @Test
    public void harvestAllOK() throws Throwable {

        ElasticsearchService elasticsearchServiceMock = mock(ElasticsearchService.class);

        ApiDocumentBuilderService apiDocumentBuilderServiceMock = mock(ApiDocumentBuilderService.class);
        when(apiDocumentBuilderServiceMock.createFromApiRegistration(any(), any(), any())).thenReturn(new ApiDocument());

        RegistrationApiClient registrationApiClientMock = mock(RegistrationApiClient.class);
        when(registrationApiClientMock.getPublished()).thenReturn(new ArrayList<>());
        RegistrationApiService registrationApiService = mock(RegistrationApiService.class);
        when(registrationApiService.getClient()).thenReturn(registrationApiClientMock);

        ApiHarvester harvester = new ApiHarvester(elasticsearchServiceMock, apiDocumentBuilderServiceMock, registrationApiService);

        harvester.harvestAll();
        final int FROM_CSV = 8;
        verify(elasticsearchServiceMock, times(FROM_CSV)).updateApiDocument(any());

    }
}
