package no.dcat.service;

import no.dcat.model.ApiSpecification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

public interface ApiSpecificationRepository
    extends ElasticsearchRepository<ApiSpecification, String> {

  Page<ApiSpecification> findByCatalogId(String catalogId, Pageable pageable);
}
