package no.fdk.imcat.service;

import no.fdk.imcat.model.InformationModel;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.Optional;

@RepositoryRestResource(itemResourceRel = "informationmodel", collectionResourceRel = "informationmodels", exported = false)
public interface InformationmodelRepository
    extends ElasticsearchRepository<InformationModel, String> {
}
