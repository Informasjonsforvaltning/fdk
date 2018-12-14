package no.dcat.service;

import no.dcat.model.ApiCatalog;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.Optional;

@RepositoryRestResource(exported = false)
public interface ApiCatalogRepository extends ElasticsearchRepository<ApiCatalog, String> {

    Optional<ApiCatalog> findByOrgNo(String identifier);
}
