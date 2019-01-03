package no.dcat.controller;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import no.dcat.datastore.domain.dcat.smoke.TestCompleteCatalog;
import no.dcat.model.Catalog;
import no.dcat.model.Dataset;
import no.dcat.service.CatalogRepository;
import no.dcat.service.DatasetRepository;
import no.dcat.shared.testcategories.UnitTest;
import no.dcat.webutils.exceptions.NotFoundException;
import org.junit.Before;
import org.junit.Test;
import org.junit.experimental.categories.Category;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.BeanUtils;

import java.util.Optional;

import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

/**
 * Created by dask on 21.04.2017.
 */

@Category(UnitTest.class)
public class DatasetControllerTest {

    private DatasetController datasetController;

    @Mock
    private DatasetRepository mockDatasetRepository;

    @Mock
    private CatalogRepository mockCatalogRepository;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);

        String catalogId = "1234";
        Catalog catalog = new Catalog();
        catalog.setId(catalogId);
        when(mockCatalogRepository.findById(anyString())).thenReturn(Optional.of(catalog));


        datasetController = new DatasetController(mockDatasetRepository, mockCatalogRepository, null);

    }

    @Test
    public void createDatasetOK() throws NotFoundException {
        String catalogId = "1234";
        Catalog catalog = new Catalog();
        catalog.setId(catalogId);

        Dataset data = new Dataset();

        when(mockDatasetRepository.save(any(Dataset.class))).thenAnswer((invocation) -> invocation.getArguments()[0]);

        Dataset saveDataset = datasetController.saveDataset(catalogId, data);

        assertThat(saveDataset.getCatalogId(), is(catalogId));
    }

    @Test
    public void serializationOK() throws Throwable {
        no.dcat.shared.Catalog catalog = TestCompleteCatalog.getCompleteCatalog();

        no.dcat.shared.Dataset completeDataset = catalog.getDataset().get(0);

        Dataset expected = new Dataset();
        expected.setId("1");
        BeanUtils.copyProperties(completeDataset, expected);

        Gson gson = new Gson();

        String json = gson.toJson(expected);

        Dataset actual = new GsonBuilder().create().fromJson(json, Dataset.class);

        assertThat(actual, is(expected));
        assertThat(actual.getReferences(), is(expected.getReferences()));

    }
}



