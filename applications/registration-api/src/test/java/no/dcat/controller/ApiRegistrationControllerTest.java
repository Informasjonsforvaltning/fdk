package no.dcat.controller;

import no.dcat.factory.RegistrationFactory;
import no.dcat.model.ApiRegistration;
import no.dcat.model.Catalog;
import no.dcat.service.ApiRegistrationRepository;
import no.dcat.service.CatalogRepository;
import no.dcat.shared.testcategories.UnitTest;
import org.junit.Before;
import org.junit.Test;
import org.junit.experimental.categories.Category;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpEntity;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

/** Created by */
@Category(UnitTest.class)
public class ApiRegistrationControllerTest {

  private ApiRegistrationController apiRegistrationController;

  @Mock private ApiRegistrationRepository mockApiRegistrationRepository;

  @Mock private CatalogRepository mockCatalogRepository;

  @Before
  public void setup() {
    MockitoAnnotations.initMocks(this);

    String catalogId = "1234";
    Catalog catalog = new Catalog();
    catalog.setId(catalogId);
    when(mockCatalogRepository.findById(anyString())).thenReturn(Optional.of(catalog));

    apiRegistrationController =
        new ApiRegistrationController(mockApiRegistrationRepository, mockCatalogRepository);
  }

  @Test
  public void createApiRegistrationOK() throws Throwable {
    String catalogId = "1234";

    ApiRegistration apiRegistration = RegistrationFactory.createApiRegistration(catalogId);
    HttpEntity<ApiRegistration> actualEntity = saveApiRegistration(catalogId, apiRegistration);

    ApiRegistration actual = actualEntity.getBody();
    assertThat(actual.getOrgNr(), is(catalogId));
  }

  /*@Test
  public void serializationOK() throws Throwable {
    no.dcat.shared.Catalog catalog = TestCompleteCatalog.getCompleteCatalog();

    ApiRegistration completeApiRegistration =
        catalog.getApiRegistrations().get(0);

    ApiRegistration expected = new ApiRegistration();
    expected.setId("1");
    BeanUtils.copyProperties(completeApiRegistration, expected);

    Gson gson = new Gson();

    String json = gson.toJson(expected);

    ApiRegistration actual = new GsonBuilder().create().fromJson(json, ApiRegistration.class);

    assertThat(actual, is(expected));
    assertThat(actual.getId(), is(expected.getId()));
  }*/

  @Test
  public void updateApiRegistrationOK() throws Throwable {
    String catalogId = "1234";

    ApiRegistration apiRegistration = RegistrationFactory.createApiRegistration(catalogId);
    HttpEntity<ApiRegistration> actualEntity = saveApiRegistration(catalogId, apiRegistration);

    ApiRegistration actual = actualEntity.getBody();
    assertThat(actual.getOrgNr(), is(catalogId));

    // make sure that findOne returns something
    when(mockApiRegistrationRepository.findById(anyString()))
        .thenReturn(Optional.of(apiRegistration));

    actual.getTitle().put("api", "update test");
    apiRegistration.setTitle(actual.getTitle());
    HttpEntity<ApiRegistration> updateActualEntity =
        apiRegistrationController.updateApiRegistrationPut(
            catalogId, apiRegistration.getId(), apiRegistration);

    ApiRegistration updateActual = actualEntity.getBody();
    assertThat(updateActual.getTitle().get("api"), is("update test"));
  }

  @Test
  public void deleteApiRegistrationOK() throws Throwable {
    // setup test data
    String catalogId = "910244132";
    ApiRegistration apiRegistration = RegistrationFactory.createApiRegistration(catalogId);
    HttpEntity<ApiRegistration> actualEntity = saveApiRegistration(catalogId, apiRegistration);

    ApiRegistration actual = actualEntity.getBody();
    assertThat(actual.getOrgNr(), is(catalogId));

    // make sure that findOne returns something
    when(mockApiRegistrationRepository.findById(anyString()))
        .thenReturn(Optional.of(apiRegistration));

    apiRegistrationController.deleteApiRegistration(catalogId, apiRegistration.getId());

    // verify that the call has been executed
    verify(mockApiRegistrationRepository, times(1)).delete(apiRegistration);
  }

  private HttpEntity<ApiRegistration> saveApiRegistration(
      String catalogId, ApiRegistration apiRegistration) throws Throwable {

    Map<String, String> title = new HashMap<>();
    title.put("api", "test");
    apiRegistration.setTitle(title);

    when(mockApiRegistrationRepository.save((ApiRegistration) any())).thenReturn(apiRegistration);
    HttpEntity<ApiRegistration> actualEntity =
        apiRegistrationController.saveApispec(catalogId, apiRegistration);

    return actualEntity;
  }
}
