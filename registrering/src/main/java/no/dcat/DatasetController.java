package no.dcat;

import no.dcat.factory.DatasetFactory;
import no.dcat.model.Dataset;
import no.dcat.service.DatasetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.elasticsearch.core.ElasticsearchTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
@RequestMapping("/dataset")
public class DatasetController {

    @Autowired
    private DatasetRepository datasetRepository;

    @Autowired
    private DatasetFactory datasetFactory;


    @Autowired
    private ElasticsearchTemplate elasticsearchTemplate;


    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    public HttpEntity<Dataset> getDataset(@PathVariable("id") String id) {
        Dataset dataset = datasetRepository.findOne(id);

        if (dataset == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(dataset, HttpStatus.OK);
    }

    @RequestMapping(value = "/", method = RequestMethod.POST)
    public HttpEntity<Dataset> addDataset(@RequestBody String description) {
        Dataset dataset = datasetFactory.createDataset();
        dataset.setDescription(description);
        Dataset savedDataset = datasetRepository.save(dataset);
        return new ResponseEntity<>(savedDataset, HttpStatus.OK);
    }

}
