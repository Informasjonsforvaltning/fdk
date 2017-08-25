package no.dcat.controller;

import no.dcat.factory.RegistrationFactory;
import no.dcat.model.Catalog;
import no.dcat.model.Dataset;
import no.dcat.service.CatalogRepository;
import no.dcat.service.DatasetRepository;
import org.junit.Before;
import org.junit.Test;
import org.mockito.Mock;
import org.springframework.http.HttpEntity;

import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertThat;
import static org.mockito.Mockito.anyObject;
import static org.mockito.Mockito.anyString;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.spy;
import static org.mockito.Mockito.when;

/**
 * Created by dask on 21.04.2017.
 */

public class DatasetControllerTest {

    DatasetController controller, spy;

    @Mock
    DatasetRepository mockDR;

    @Mock
    CatalogRepository mockCR;

    @Before
    public void setup () {
        controller = new DatasetController();

        String catalogId = "1234";
        Catalog catalog = new Catalog();
        catalog.setId(catalogId);

        mockDR = mock(DatasetRepository.class);
        mockCR = mock(CatalogRepository.class);
        when(mockCR.findOne(anyString())).thenReturn(catalog);

        spy = spy(controller);
        //when(controller.getCatalogRepository()).thenReturn(mockCR);
        doReturn(mockCR).when(spy).getCatalogRepository();
        doReturn(mockDR).when(spy).getDatasetRepository();

    }

    @Test
    public void createDatasetOK() throws Throwable {
        String catalogId = "1234";

        Dataset copy = RegistrationFactory.INSTANCE.createDataset(catalogId);
        copy.getTitle().put("nb","test");

        when(mockDR.save((Dataset)anyObject())).thenReturn(copy);

        HttpEntity<Dataset> actualEntity = spy.saveDataset(catalogId, copy);

        Dataset actual = actualEntity.getBody();
        assertThat(actual.getCatalog(), is(catalogId));

    }
}
