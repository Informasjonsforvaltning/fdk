package no.dcat.service;

import no.dcat.model.Catalog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

import java.util.List;

public interface CatalogRepository extends ElasticsearchRepository<Catalog, String> {
    Page<Catalog> findByIdIn(List<String> identifiers, Pageable page);
}
