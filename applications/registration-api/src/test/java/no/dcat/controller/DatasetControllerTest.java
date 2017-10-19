package no.dcat.controller;

import no.dcat.factory.RegistrationFactory;
import no.dcat.model.Catalog;
import no.dcat.model.Dataset;
import no.dcat.service.CatalogRepository;
import no.dcat.service.DatasetRepository;
import org.junit.Before;
import org.junit.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpEntity;

import java.util.HashMap;
import java.util.Map;

import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertThat;
import static org.mockito.Mockito.anyObject;
import static org.mockito.Mockito.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.spy;
import static org.mockito.Mockito.when;

/**
 * Created by dask on 21.04.2017.
 */

public class DatasetControllerTest {

    private DatasetController detasetController;

    @Mock
    private DatasetRepository mockDatasetRepository;

    @Mock
    private CatalogRepository mockCatalogRepository;

    @Before
    public void setup () {
        MockitoAnnotations.initMocks(this);

        String catalogId = "1234";
        Catalog catalog = new Catalog();
        catalog.setId(catalogId);
        when(mockCatalogRepository.findOne(anyString())).thenReturn(catalog);


        detasetController = new DatasetController(mockDatasetRepository, mockCatalogRepository);

    }

    @Test
    public void createDatasetOK() throws Throwable {
        String catalogId = "1234";

        Dataset copy = RegistrationFactory.createDataset(catalogId);
        Map<String,String> title = new HashMap<>();
        title.put("nb","test");
        copy.setTitle(title);

        when(mockDatasetRepository.save((Dataset)anyObject())).thenReturn(copy);

        HttpEntity<Dataset> actualEntity = detasetController.saveDataset(catalogId, copy);

        Dataset actual = actualEntity.getBody();
        assertThat(actual.getCatalogId(), is(catalogId));

    }
}
