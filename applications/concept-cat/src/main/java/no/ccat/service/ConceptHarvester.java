package no.ccat.service;

import no.ccat.model.ConceptDenormalized;
import no.ccat.model.ConceptDenormalizedFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

/*
    Fetch concepts and insert or update them in the search index.
 */
@Service
public class ConceptHarvester {
    private static final Logger logger = LoggerFactory.getLogger(ConceptHarvester.class);

    private final ConceptDenormalizedRepository conceptDenormalizedRepository;

    @Autowired
    public ConceptHarvester(ConceptDenormalizedRepository conceptDenormalizedRepository) {
        this.conceptDenormalizedRepository = conceptDenormalizedRepository;
    }

    @PostConstruct
    public void harvestFromSource() {
        logger.info("harvest from source");


        List<String> ids = IntStream.rangeClosed(1, 50).mapToObj(String::valueOf).collect(Collectors.toList());

        List<ConceptDenormalized> concepts = ids.stream().map(ConceptDenormalizedFactory::create).collect(Collectors.toList());

        concepts.stream().forEach(concept -> conceptDenormalizedRepository.save(concept));
    }

}
