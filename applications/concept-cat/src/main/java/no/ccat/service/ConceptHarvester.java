package no.ccat.service;

import no.ccat.model.ConceptDenormalized;
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
    private final ConceptBuilderService conceptBuilderService;

    @Autowired
    public ConceptHarvester(ConceptDenormalizedRepository conceptDenormalizedRepository, ConceptBuilderService conceptBuilderService) {
        this.conceptDenormalizedRepository = conceptDenormalizedRepository;
        this.conceptBuilderService = conceptBuilderService;
    }

    @PostConstruct
    public void harvestFromSource() {
        logger.info("harvest from source");


        List<String> ids = IntStream.rangeClosed(1, 50).mapToObj(String::valueOf).collect(Collectors.toList());
        ids.add("970018131");

        List<ConceptDenormalized> concepts = ids.stream().map(id -> conceptBuilderService.create(id)).collect(Collectors.toList());

        concepts.stream().forEach(concept -> conceptDenormalizedRepository.save(concept));
    }

}
