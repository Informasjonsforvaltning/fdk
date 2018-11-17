package no.acat.harvester;

import no.acat.model.ApiDocument;
import no.acat.service.ApiDocumentBuilderService;
import no.acat.service.ElasticsearchService;
import no.acat.service.RegistrationApiClient;
import no.dcat.client.registrationapi.ApiRegistrationPublic;
import no.dcat.shared.testcategories.UnitTest;
import org.junit.Before;
import org.junit.Test;
import org.junit.experimental.categories.Category;
import org.junit.runner.RunWith;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.ArrayList;
import java.util.List;

import static org.mockito.Mockito.*;

@Category(UnitTest.class)
@RunWith(SpringRunner.class)
public class ApiHarvestTest {

    private ElasticsearchService elasticsearchServiceMock;
    private ApiDocumentBuilderService apiDocumentBuilderServiceMock;

    @Before
    public void setup() throws Throwable {
        elasticsearchServiceMock = mock(ElasticsearchService.class);

        apiDocumentBuilderServiceMock = mock(ApiDocumentBuilderService.class);
        when(apiDocumentBuilderServiceMock.createFromApiRegistration(any(), any(), any())).thenReturn(new ApiDocument());
    }

    @Test
    public void harvestAllOK() throws Throwable {

        List<ApiRegistrationPublic> publishedApis = new ArrayList<>();
        publishedApis.add(new ApiRegistrationPublic());

        RegistrationApiClient registrationApiClientMock = mock(RegistrationApiClient.class);
        when(registrationApiClientMock.getPublished()).thenReturn(publishedApis);

        ApiHarvester harvester = new ApiHarvester(elasticsearchServiceMock, apiDocumentBuilderServiceMock, registrationApiClientMock);

        harvester.harvestAll();

        verify(elasticsearchServiceMock, times(9)).createOrReplaceApiDocument(any());
    }


    @Test
    public void harvestAllShouldWorkWithEmtpyRegistration() throws Throwable {

        RegistrationApiClient registrationApiClientMock = mock(RegistrationApiClient.class);
        when(registrationApiClientMock.getPublished()).thenReturn(new ArrayList<>());


        ApiHarvester harvester = new ApiHarvester(elasticsearchServiceMock, apiDocumentBuilderServiceMock, registrationApiClientMock);

        ApiHarvester harvesterSpy = spy(harvester);

        doReturn(new ArrayList<>()).when(harvesterSpy).getApiRegistrationsFromCsv();

        harvesterSpy.harvestAll();

        verify(elasticsearchServiceMock, times(0)).createOrReplaceApiDocument(any());
    }

    @Test
    public void harvestAllShouldWorkWithEmtpyPublished() throws Throwable {

        RegistrationApiClient registrationApiClientMock = mock(RegistrationApiClient.class);
        when(registrationApiClientMock.getPublished()).thenReturn(new ArrayList<>());

        ApiHarvester harvester = new ApiHarvester(elasticsearchServiceMock, apiDocumentBuilderServiceMock, registrationApiClientMock);

        harvester.harvestAll();

        verify(elasticsearchServiceMock, times(8)).createOrReplaceApiDocument(any());
    }
}
