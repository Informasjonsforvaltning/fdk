package no.dcat.service;

import no.dcat.model.Catalog;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

public interface CatalogRepository extends ElasticsearchRepository<Catalog, String> {
}
