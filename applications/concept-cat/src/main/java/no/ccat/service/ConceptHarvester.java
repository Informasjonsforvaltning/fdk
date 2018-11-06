package no.ccat.service;

import no.ccat.model.ConceptDenormalized;
import no.dcat.shared.HarvestMetadata;
import no.dcat.shared.HarvestMetadataUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.io.InputStreamReader;
import java.io.Reader;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.List;

/*
    Fetch concepts and insert or update them in the search index.
 */
@Service
public class ConceptHarvester {
    private static final Logger logger = LoggerFactory.getLogger(ConceptHarvester.class);

    private final ConceptDenormalizedRepository conceptDenormalizedRepository;
    private final RDFToModelTransformer rdfToModelTransformer;

    @Autowired
    public ConceptHarvester(ConceptDenormalizedRepository conceptDenormalizedRepository, RDFToModelTransformer rdfToModelTransformer) {
        this.conceptDenormalizedRepository = conceptDenormalizedRepository;
        this.rdfToModelTransformer = rdfToModelTransformer;
    }

    @PostConstruct
    public void harvestFromSource() {
        logger.info("harvest from source");

        Reader reader =resourceAsReader("jira-example-big.ttl");
        List<ConceptDenormalized> concepts = rdfToModelTransformer.getConceptsFromStream(reader);

        Date harvestDate=new Date();
        concepts.stream().forEach(concept -> {
            HarvestMetadata harvest = HarvestMetadataUtil.createOrUpdate(null, harvestDate, false);
            concept.setHarvest(harvest);
            conceptDenormalizedRepository.save(concept);
        });
    }

    private Reader resourceAsReader(final String resourceName) {
        return new InputStreamReader(getClass().getClassLoader().getResourceAsStream(resourceName), StandardCharsets.UTF_8);
    }
}
