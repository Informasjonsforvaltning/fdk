package no.dcat.factory;

import no.dcat.model.Dataset;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DatasetFactory {

    @Autowired
    private DatasetIdGenerator datasetIdGenerator;

    public Dataset createDataset() {
        Dataset dataset = new Dataset();
        dataset.setId(datasetIdGenerator.createId());
        return dataset;
    }
}
