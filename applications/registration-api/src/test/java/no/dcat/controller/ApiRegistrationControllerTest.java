package no.dcat.controller;

import com.google.gson.Gson;
import io.swagger.v3.oas.models.OpenAPI;
import no.dcat.client.apicat.ApiCatClient;
import no.dcat.factory.RegistrationFactory;
import no.dcat.model.ApiRegistration;
import no.dcat.model.Catalog;
import no.dcat.service.ApiCatService;
import no.dcat.service.ApiRegistrationRepository;
import no.dcat.service.CatalogRepository;
import no.dcat.shared.testcategories.UnitTest;
import org.apache.commons.io.IOUtils;
import org.junit.Before;
import org.junit.Test;
import org.junit.experimental.categories.Category;
import org.junit.runner.RunWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.opensaml.xml.parse.ClasspathResolver;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.test.context.junit4.SpringRunner;

import java.io.IOException;
import java.util.Optional;

import static org.junit.Assert.*;
import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.anyObject;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

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
    private ApiCatService apiCatService;

    @Mock
    private ApiCatClient apiCatClient;

    @Before
    public void setup() throws IOException {
        MockitoAnnotations.initMocks(this);

        Catalog catalog = new Catalog();
        catalog.setId(catalogId);
        apiResource = new ClassPathResource("raw-enhet-api.json");
        OpenAPI openApi = new Gson().fromJson(IOUtils.toString(apiResource.getInputStream(), "UTF-8"), OpenAPI.class);
        ApiRegistration apiRegistrationData;

        when(catalogRepository.findById(anyString())).thenReturn(Optional.of(catalog));
        when(apiCatService.getClient()).thenReturn(apiCatClient);
        when(apiCatClient.convert(apiResource.getURL().toString(), null)).thenReturn(openApi);

        ApiRegistration apiRegData = mock(ApiRegistration.class);
        when(apiRegData.getId()).thenReturn("id");
        when(apiRegistrationRepository.save(anyObject())).thenReturn(apiRegData);
        //doNothing().when(apiCatClient).triggerHarvestApiRegistration(anyString());

        apiRegistrationController = new ApiRegistrationController(apiRegistrationRepository, catalogRepository, apiCatService);


    }

    @Test
    public void createApiRegistrationOK() throws Throwable {

        ApiRegistration apiRegData = new ApiRegistration();
        apiRegData.setApiSpecUrl(apiResource.getURL().toString());

        ApiRegistration actual = apiRegistrationController.createApiRegistration(catalogId, apiRegData);

        ArgumentCaptor<ApiRegistration> apiCaptor = ArgumentCaptor.forClass(ApiRegistration.class);
        verify(apiRegistrationRepository).save(apiCaptor.capture());

        actual = apiCaptor.getValue();
        assertThat(actual.getOpenApi().getInfo().getTitle(), is("Åpne Data fra Enhetsregisteret - API Dokumentasjon"));
    }

}
