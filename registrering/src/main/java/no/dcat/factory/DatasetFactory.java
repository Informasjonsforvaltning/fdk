package no.dcat.factory;

import no.dcat.model.Dataset;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DatasetFactory {

    @Autowired
    private DatasetIdGenerator datasetIdGenerator;

    public Dataset createDataset() {
        return new Dataset(datasetIdGenerator.createId());
    }
}
