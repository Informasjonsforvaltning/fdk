package no.dcat.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import no.ccat.common.model.Concept;
import no.dcat.factory.DatasetFactory;
import no.dcat.model.Catalog;
import no.dcat.model.Dataset;
import no.dcat.repository.DatasetRepository;
import no.dcat.shared.Publisher;
import no.dcat.shared.Subject;
import no.fdk.webutils.exceptions.BadRequestException;
import no.fdk.webutils.exceptions.FDKException;
import no.fdk.webutils.exceptions.InternalServerErrorException;
import no.fdk.webutils.exceptions.NotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import static java.lang.String.format;

@Service
@RequiredArgsConstructor
public class DatasetService {
    private final static Logger logger = LoggerFactory.getLogger(DatasetService.class);

    private final OrganizationService organizationService;
    private final DatasetRepository datasetRepository;
    private final CatalogRepository catalogRepository;
    private final ConceptCatClient conceptCatClient;
    private final DatasetPublisherService datasetPublisherService;

    private final ObjectMapper objectMapper = new ObjectMapper();

    public Page<Dataset> listDatasets(String catalogId, Pageable pageable) {
        logger.info("Fetching datasets for catalog with ID {}", catalogId);
        return datasetRepository.findByCatalogId(catalogId, pageable);
    }

    public Dataset getDataset(String catalogId, String datasetId) throws FDKException {
        logger.info("Fetching dataset with ID {} from catalog with ID {}", datasetId, catalogId);
        return datasetRepository
            .findById(datasetId)
            .filter(dataset -> catalogId.equals(dataset.getCatalogId()))
            .orElseThrow(NotFoundException::new);
    }

    public Dataset createDataset(String catalogId, Dataset dataset) throws FDKException {
        logger.info("Fetching catalog with ID {}", catalogId);
        Catalog catalog = catalogRepository.findById(catalogId).orElseThrow(NotFoundException::new);

        if (dataset.getPublisher() != null) {
            logger.info("Dataset publisher is set");
            validateDatasetPublisher(catalog.getPublisher(), dataset.getPublisher());
        }

        logger.info("Creating dataset in catalog with ID {}", catalog.getId());
        Dataset createdDataset = datasetRepository.save(DatasetFactory.create(catalog, dataset));
        logger.info("Created dataset with ID {} in catalog with ID {} ready to be saved", createdDataset.getId(), catalogId);

        if (isDatasetPublished(createdDataset)) {
            triggerHarvest(createdDataset);
        }

        return createdDataset;
    }

    public Dataset updateDataset(Dataset dataset, Dataset patch) throws FDKException {
        logger.info("Updating dataset with ID {} for catalog with ID {}", dataset.getId(), dataset.getCatalogId());
        boolean previouslyPublished = isDatasetPublished(dataset);

        dataset = applyPatch(dataset, patch);
        dataset.set_lastModified(new Date());
        logger.info("Applied patch successfully to dataset with ID {} for catalog with ID {}", dataset.getId(), dataset.getCatalogId());

        if (patch.getConcepts() != null) {
            updateDatasetConcepts(patch.getConcepts(), dataset);
        }

        if (patch.getPublisher() != null) {
            updateDatasetPublisher(patch.getPublisher(), dataset);
        }

        logger.info("Updated dataset with ID {} in catalog with ID {} ready to be saved", dataset.getId(), dataset.getCatalogId());
        dataset = datasetRepository.save(dataset);

        if (isDatasetPublished(dataset) || previouslyPublished) {
            triggerHarvest(dataset);
        }

        return dataset;
    }

    public void removeDataset(String catalogId, String datasetId) {
        logger.info("Preparing to remove dataset with ID {} from catalog with ID {}", datasetId, catalogId);
        List<Dataset> removedDatasets = datasetRepository.removeByIdAndCatalogId(datasetId, catalogId);
        logger.info("{} dataset with ID {} from catalog with ID {}", !removedDatasets.isEmpty() ? "Successfully removed" : "Failed to remove", datasetId, catalogId);
        removedDatasets.stream().filter(this::isDatasetPublished).forEach(this::triggerHarvest);
    }

    private Dataset applyPatch(Dataset dataset, Dataset patch) throws InternalServerErrorException {
        try {
            return objectMapper.readerForUpdating(dataset).readValue(objectMapper.writeValueAsString(patch));
        } catch (IOException ex) {
            throw new InternalServerErrorException(
                format(
                    "Failed to parse dataset JSON body for dataset with ID %s",
                    dataset.getId()
                )
            );
        }
    }

    private void validateDatasetPublisher(Publisher catalogPublisher, Publisher datasetPublisher) throws FDKException {
        logger.info("Validating catalog publisher permissions");
        String catalogPublisherId = catalogPublisher.getId();
        boolean isSameDatasetPublisherAsCatalogPublisher = catalogPublisherId.equals(datasetPublisher.getId());
        if (!isSameDatasetPublisherAsCatalogPublisher && !organizationService.hasDelegationPermission(catalogPublisherId)) {
            throw new BadRequestException(
                format(
                    "Organization with ID %s has no delegation permission to create datasets on behalf of other organizations",
                    catalogPublisherId
                )
            );
        }
    }

    private void updateDatasetConcepts(List<Concept> newConcepts, Dataset dataset) {
        logger.info("Dataset concepts update has been requested");
        List<String> ids = newConcepts.stream().map(Concept::getId).collect(Collectors.toList());
        List<Concept> concepts = conceptCatClient.getByIds(ids);
        List<Subject> subjects = concepts.stream().map(this::convertConceptToSubject).collect(Collectors.toList());
        dataset.setSubject(subjects);
        dataset.setConcepts(concepts);
    }

    private void updateDatasetPublisher(Publisher newPublisher, Dataset dataset) throws FDKException {
        logger.info("Dataset publisher update has been requested");
        logger.info("Fetching catalog with ID {}", dataset.getCatalogId());
        Catalog catalog = catalogRepository.findById(dataset.getCatalogId()).orElseThrow(NotFoundException::new);
        validateDatasetPublisher(catalog.getPublisher(), newPublisher);
    }

    private Subject convertConceptToSubject(Concept concept) {
        Subject subject = new Subject();
        subject.setId(concept.getId());
        subject.setUri(concept.getUri());
        subject.setDefinition(concept.getDefinition().getText());
        subject.setPrefLabel(concept.getPrefLabel());
        subject.setAltLabel(concept.getAltLabel());
        subject.setIdentifier(concept.getIdentifier());
        return subject;
    }

    private boolean isDatasetPublished(Dataset dataset) {
        logger.info("Checking whether dataset with ID {} in catalog with ID {} should be harvested", dataset.getId(), dataset.getCatalogId());
        return dataset.getRegistrationStatus().equalsIgnoreCase("PUBLISH");
    }

    private void triggerHarvest(Dataset dataset) {
        logger.info("Dataset status is {}, so a harvest message should be sent for dataset with ID {} in catalog with ID {}", dataset.getRegistrationStatus(), dataset.getId(), dataset.getCatalogId());
        datasetPublisherService.sendHarvestMessage(dataset);
    }
}
