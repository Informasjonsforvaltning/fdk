package no.ccat.service;

import no.ccat.model.ConceptDenormalized;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import java.util.List;

public interface ConceptDenormalizedRepository
    extends ElasticsearchRepository<ConceptDenormalized, String> {

    List<ConceptDenormalized> findByHarvestSourceUri(String harvestSourceUri);

}
