package no.dcat.controller;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import no.dcat.datastore.domain.dcat.smoke.TestCompleteCatalog;
import no.dcat.factory.RegistrationFactory;
import no.dcat.model.ApiSpecification;
import no.dcat.model.Catalog;
import no.dcat.service.ApiSpecificationRepository;
import no.dcat.service.CatalogRepository;
import no.dcat.shared.testcategories.UnitTest;
import org.junit.Before;
import org.junit.Test;
import org.junit.experimental.categories.Category;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.BeanUtils;
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
public class ApiSpecificationControllerTest {

  private ApiSpecificationController apiSpecificationController;

  @Mock private ApiSpecificationRepository mockApiSpecificationRepository;

  @Mock private CatalogRepository mockCatalogRepository;

  @Before
  public void setup() {
    MockitoAnnotations.initMocks(this);

    String catalogId = "1234";
    Catalog catalog = new Catalog();
    catalog.setId(catalogId);
    when(mockCatalogRepository.findById(anyString())).thenReturn(Optional.of(catalog));

    apiSpecificationController =
        new ApiSpecificationController(mockApiSpecificationRepository, mockCatalogRepository);
  }

  @Test
  public void createApiSpecificationOK() throws Throwable {
    String catalogId = "1234";

    ApiSpecification apiSpecification = RegistrationFactory.createApiSpecification(catalogId);
    HttpEntity<ApiSpecification> actualEntity = saveApiSpecification(catalogId, apiSpecification);

    ApiSpecification actual = actualEntity.getBody();
    assertThat(actual.getCatalogId(), is(catalogId));
  }

  @Test
  public void serializationOK() throws Throwable {
    no.dcat.shared.Catalog catalog = TestCompleteCatalog.getCompleteCatalog();

    no.dcat.shared.ApiSpecification completeApiSpecification =
        catalog.getApiSpecifications().get(0);

    ApiSpecification expected = new ApiSpecification();
    expected.setId("1");
    BeanUtils.copyProperties(completeApiSpecification, expected);

    Gson gson = new Gson();

    String json = gson.toJson(expected);

    ApiSpecification actual = new GsonBuilder().create().fromJson(json, ApiSpecification.class);

    assertThat(actual, is(expected));
    assertThat(actual.getId(), is(expected.getId()));
  }

  @Test
  public void updateApiSpecificationOK() throws Throwable {
    String catalogId = "1234";

    ApiSpecification apiSpecification = RegistrationFactory.createApiSpecification(catalogId);
    HttpEntity<ApiSpecification> actualEntity = saveApiSpecification(catalogId, apiSpecification);

    ApiSpecification actual = actualEntity.getBody();
    assertThat(actual.getCatalogId(), is(catalogId));

    // make sure that findOne returns something
    when(mockApiSpecificationRepository.findById(anyString()))
        .thenReturn(Optional.of(apiSpecification));

    actual.getTitle().put("api", "update test");
    apiSpecification.setTitle(actual.getTitle());
    HttpEntity<ApiSpecification> updateActualEntity =
        apiSpecificationController.updateApiSpecificationPut(
            catalogId, apiSpecification.getId(), apiSpecification);

    ApiSpecification updateActual = actualEntity.getBody();
    assertThat(updateActual.getTitle().get("api"), is("update test"));
  }

  @Test
  public void deleteApiSpecificationOK() throws Throwable {
    // setup test data
    String catalogId = "910244132";
    ApiSpecification apiSpecification = RegistrationFactory.createApiSpecification(catalogId);
    HttpEntity<ApiSpecification> actualEntity = saveApiSpecification(catalogId, apiSpecification);

    ApiSpecification actual = actualEntity.getBody();
    assertThat(actual.getCatalogId(), is(catalogId));

    // make sure that findOne returns something
    when(mockApiSpecificationRepository.findById(anyString()))
        .thenReturn(Optional.of(apiSpecification));

    apiSpecificationController.deleteApiSpecification(catalogId, apiSpecification.getId());

    // verify that the call has been executed
    verify(mockApiSpecificationRepository, times(1)).delete(apiSpecification);
  }

  private HttpEntity<ApiSpecification> saveApiSpecification(
      String catalogId, ApiSpecification apiSpecification) throws Throwable {

    Map<String, String> title = new HashMap<>();
    title.put("api", "test");
    apiSpecification.setTitle(title);

    when(mockApiSpecificationRepository.save((ApiSpecification) any()))
        .thenReturn(apiSpecification);
    HttpEntity<ApiSpecification> actualEntity =
        apiSpecificationController.saveApispec(catalogId, apiSpecification);

    return actualEntity;
  }
}
