package no.dcat.controller;

import com.google.gson.Gson;
import io.swagger.v3.oas.models.OpenAPI;
import no.fdk.acat.bindings.ApiCatBindings;
import no.dcat.model.ApiRegistration;
import no.dcat.model.Catalog;
import no.dcat.service.ApiCatService;
import no.dcat.service.ApiRegistrationRepository;
import no.dcat.service.CatalogRepository;
import no.dcat.shared.testcategories.UnitTest;
import no.dcat.webutils.exceptions.BadRequestException;
import no.dcat.webutils.exceptions.NotFoundException;
import org.apache.commons.io.IOUtils;
import org.junit.Before;
import org.junit.Test;
import org.junit.experimental.categories.Category;
import org.junit.runner.RunWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.test.context.junit4.SpringRunner;

import java.io.IOException;
import java.util.Optional;

import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertThat;
import static org.mockito.ArgumentMatchers.anyObject;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@Category(UnitTest.class)
@RunWith(SpringRunner.class)
public class ApiRegistrationControllerTest {

    private ApiRegistrationController apiRegistrationController;
    private String catalogId = "1234";
    private Resource apiResource;

    @Mock
    private CatalogRepository catalogRepository;

    @Mock
    private ApiRegistrationRepository apiRegistrationRepository;

    @Mock
    private ApiCatService apiCatMock;

    @Before
    public void setup() throws IOException {
        MockitoAnnotations.initMocks(this);

        Catalog catalog = new Catalog();
        catalog.setId(catalogId);
        apiResource = new ClassPathResource("raw-enhet-api.json");
        OpenAPI openApi =
            new Gson().fromJson(IOUtils.toString(apiResource.getInputStream(), "UTF-8"), OpenAPI.class);

        when(catalogRepository.findById(anyString())).thenReturn(Optional.of(catalog));
        when(apiCatMock.convertSpecUrlToOpenApi(apiResource.getURL().toString())).thenReturn(openApi);

        ApiRegistration apiRegData = mock(ApiRegistration.class);
        when(apiRegData.getId()).thenReturn("id");
        when(apiRegistrationRepository.save(anyObject())).thenReturn(apiRegData);

        apiRegistrationController =
            new ApiRegistrationController(apiRegistrationRepository, catalogRepository, apiCatMock);
    }

    @Test
    public void createApiRegistrationOK() throws Throwable {

        ApiRegistration apiRegData = new ApiRegistration();
        apiRegData.setApiSpecUrl(apiResource.getURL().toString());

        ApiRegistration actual = apiRegistrationController.createApiRegistration(catalogId, apiRegData);

        ArgumentCaptor<ApiRegistration> apiCaptor = ArgumentCaptor.forClass(ApiRegistration.class);
        verify(apiRegistrationRepository).save(apiCaptor.capture());

        actual = apiCaptor.getValue();
        assertThat(
            actual.getOpenApi().getInfo().getTitle(),
            is("Åpne Data fra Enhetsregisteret - API Dokumentasjon"));
    }

    @Test(expected = NotFoundException.class)
    public void checkIfCatalogIdNotMatchWillFailWithNotFound() throws NotFoundException, BadRequestException {

        String catalogId = "1234";
        String id = "1234";

        ApiRegistration apiRegistration = new ApiRegistration();
        apiRegistration.setCatalogId(catalogId + "0000");

        when(apiRegistrationRepository.findById(anyString())).thenReturn(Optional.of(apiRegistration));

        apiRegistrationController.deleteApiRegistration(catalogId, id);
    }

    @Test(expected = BadRequestException.class)
    public void checkDeleteApiRegistrationWithStatusPublishedBadRequest()
        throws NotFoundException, BadRequestException {

        String catalogId = "1234";
        String id = "1234";

        ApiRegistration apiRegistration = new ApiRegistration();
        apiRegistration.setCatalogId(catalogId);
        apiRegistration.setRegistrationStatus(ApiRegistration.REGISTRATION_STATUS_PUBLISH);

        when(apiRegistrationRepository.findById(id)).thenReturn(Optional.of(apiRegistration));

        apiRegistrationController.deleteApiRegistration(catalogId, id);
    }

    @Test
    public void checkDeleteApiRegistrationWithStatusDraftOK()
        throws NotFoundException, BadRequestException {

        String catalogId = "1234";
        String id = "1234";

        ApiRegistration apiRegistration = new ApiRegistration();
        apiRegistration.setCatalogId(catalogId);
        apiRegistration.setRegistrationStatus(ApiRegistration.REGISTRATION_STATUS_DRAFT);

        when(apiRegistrationRepository.findById(id)).thenReturn(Optional.of(apiRegistration));

        apiRegistrationController.deleteApiRegistration(catalogId, id);
        doNothing().when(apiRegistrationRepository).delete(apiRegistration);

        verify(apiRegistrationRepository, times(1)).delete(apiRegistration);
        verify(apiCatMock, times(1)).triggerHarvestApiRegistration(id);
    }
}
