package no.dcat.service;

import no.dcat.model.ApiRegistration;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

public interface ApiRegistrationRepository
    extends ElasticsearchRepository<ApiRegistration, String> {

  Page<ApiRegistration> findByOrgNr(String orgNr, Pageable pageable);
}
