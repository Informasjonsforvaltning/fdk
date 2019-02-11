package no.dcat.controller;

import no.dcat.model.ApiCatalog;
import no.dcat.service.ApiCatalogHarvesterService;
import no.dcat.service.ApiCatalogRepository;
import no.fdk.test.testcategories.UnitTest;
import no.fdk.webutils.exceptions.BadRequestException;
import no.fdk.webutils.exceptions.NotFoundException;
import org.junit.Before;
import org.junit.Test;
import org.junit.experimental.categories.Category;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.Spy;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.Optional;

import static org.junit.Assert.assertEquals;
import static org.mockito.Mockito.*;

@Category(UnitTest.class)
@RunWith(SpringRunner.class)
public class ApiCatalogControllerTest {

    private ApiCatalogController apiCatalogController;

    @Spy
    private ApiCatalogRepository apiCatalogRepositoryMock;

    @Mock
    private ApiCatalogHarvesterService apiCatalogHarvesterServiceMock;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        apiCatalogController =
            new ApiCatalogController(apiCatalogRepositoryMock, apiCatalogHarvesterServiceMock);
    }

    @Test
    public void getApiCatalog_ShouldReturnApiCatalog() throws NotFoundException {
        ApiCatalog existingApiCatalog = new ApiCatalog();
        String orgNr = "testOrgNr";
        when(apiCatalogRepositoryMock.findByOrgNo(orgNr)).thenReturn(Optional.of(existingApiCatalog));

        ApiCatalog apiCatalog = apiCatalogController.getApiCatalog(orgNr);

        assertEquals(apiCatalog, existingApiCatalog);
    }

    @Test(expected = NotFoundException.class)
    public void getApiCatalog_WhenNotFound_ShouldThrowNotFoundException() throws NotFoundException, BadRequestException {
        String orgNr = "testOrgNr";
        when(apiCatalogRepositoryMock.findByOrgNo(orgNr)).thenReturn(Optional.empty());

        apiCatalogController.getApiCatalog(orgNr);
    }

    @Test
    public void createApiCatalog_WhenApiCatalogFound_ShouldModifyExisting() {
        ApiCatalog existingApiCatalog = new ApiCatalog();
        String orgNr = "testOrgNr";
        String testHarvestSourceUri = "testUri";
        ApiCatalog postPayload = ApiCatalog.builder().harvestSourceUri(testHarvestSourceUri).build();

        when(apiCatalogRepositoryMock.findByOrgNo(orgNr)).thenReturn(Optional.of(existingApiCatalog));
        when(apiCatalogRepositoryMock.save(any(ApiCatalog.class))).thenAnswer((invocation) -> invocation.getArguments()[0]);

        ApiCatalog apiCatalogSaved = apiCatalogController.createApiCatalog(orgNr, postPayload);

        assertEquals(apiCatalogSaved, existingApiCatalog);
        assertEquals(apiCatalogSaved.getHarvestSourceUri(), testHarvestSourceUri);
    }

    @Test
    public void createApiCatalog_WhenApiCatalogNotFound_ShouldCreateNew() {
        String orgNr = "testOrgNr";
        String testHarvestSourceUri = "testUri";
        ApiCatalog postPayload = ApiCatalog.builder().harvestSourceUri(testHarvestSourceUri).build();

        when(apiCatalogRepositoryMock.findByOrgNo(orgNr)).thenReturn(Optional.empty());
        when(apiCatalogRepositoryMock.save(any(ApiCatalog.class))).thenAnswer((invocation) -> invocation.getArguments()[0]);

        ApiCatalog apiCatalogSaved = apiCatalogController.createApiCatalog(orgNr, postPayload);

        assertEquals(apiCatalogSaved.getHarvestSourceUri(), testHarvestSourceUri);
        assertEquals(apiCatalogSaved.getOrgNo(), orgNr);
    }

    @Test
    public void deleteApiCatalog_WhenExisting_ShouldDelete() {
        ApiCatalog existingApiCatalog = new ApiCatalog();

        String orgNr = "testOrgNr";

        when(apiCatalogRepositoryMock.findByOrgNo(orgNr)).thenReturn(Optional.of(existingApiCatalog));

        apiCatalogController.deleteApiCatalog(orgNr);

        verify(apiCatalogRepositoryMock).delete(existingApiCatalog);
    }

    @Test
    public void deleteApiCatalog_WhenNotExisting_ShouldDoNothing() {
        String orgNr = "testOrgNr";

        when(apiCatalogRepositoryMock.findByOrgNo(orgNr)).thenReturn(Optional.empty());

        apiCatalogController.deleteApiCatalog(orgNr);

        verify(apiCatalogRepositoryMock, never()).delete(any());
    }
}
