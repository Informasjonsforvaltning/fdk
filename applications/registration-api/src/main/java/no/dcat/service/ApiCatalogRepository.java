package no.dcat.service;

import no.dcat.model.ApiCatalog;
import org.springframework.data.domain.Page;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.Optional;

@RepositoryRestResource(exported = false)
public interface ApiCatalogRepository extends ElasticsearchRepository<ApiCatalog, String> {

    Optional<ApiCatalog> findByOrgNo(String identifier);

    Page<ApiCatalog> findAll(); //Find all returns something that fails to convert to list but does convert well to Page (use .getContent() to get to the list)
}
