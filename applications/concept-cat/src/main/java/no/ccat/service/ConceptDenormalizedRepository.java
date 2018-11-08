package no.ccat.service;

import no.ccat.model.ConceptDenormalized;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.List;

@RepositoryRestResource(itemResourceRel = "concept", collectionResourceRel = "concepts")
public interface ConceptDenormalizedRepository
    extends ElasticsearchRepository<ConceptDenormalized, String> {

    List<ConceptDenormalized> findByHarvestSourceUri(String harvestSourceUri);

}
