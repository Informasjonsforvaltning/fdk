package no.dcat.service;

import no.dcat.model.ApiRegistration;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.Optional;

@RepositoryRestResource(exported = false)
public interface ApiRegistrationRepository
    extends ElasticsearchRepository<ApiRegistration, String> {

  Page<ApiRegistration> findByCatalogId(String catalogId, Pageable pageable);

  Page<ApiRegistration> findByRegistrationStatus(String registrationStatus, Pageable pageable);
  
}
