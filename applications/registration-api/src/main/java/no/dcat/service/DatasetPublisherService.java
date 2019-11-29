package no.dcat.service;

import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.RequiredArgsConstructor;
import no.dcat.model.Catalog;
import no.dcat.model.Dataset;
import no.fdk.webutils.exceptions.NotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.AmqpException;
import org.springframework.amqp.core.AmqpTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DatasetPublisherService {
    private static final Logger logger = LoggerFactory.getLogger(DatasetPublisherService.class);

    private final AmqpTemplate rabbitTemplate;
    private final CatalogRepository catalogRepository;

    public void sendHarvestMessage(Dataset dataset) {
        logger.info("Sending harvest message to queue for dataset with ID {} in catalog with ID {}", dataset.getId(), dataset.getCatalogId());

        logger.info("Fetching catalog with ID {}", dataset.getCatalogId());
        Catalog catalog = getCatalogById(dataset.getCatalogId());

        if (catalog != null && catalog.getPublisher() != null) {
            String publisherId = catalog.getPublisher().getId();

            logger.info("Setting harvest message publisher to {}", publisherId);
            ObjectNode payload = JsonNodeFactory.instance.objectNode();
            payload.put("publisherId", publisherId);

            try {
                rabbitTemplate.convertAndSend(payload);
                logger.info("Successfully sent harvest message for publisher {}", publisherId);
            } catch (AmqpException e) {
                logger.error("Failed to send harvest message for publisher {}", publisherId, e);
            }
        } else {
            logger.warn("Harvest message has not been sent for dataset with ID {} in catalog with ID {}", dataset.getId(), dataset.getCatalogId());
        }
    }

    private Catalog getCatalogById(String catalogId) {
        try {
            return catalogRepository.findById(catalogId).orElseThrow(NotFoundException::new);
        } catch (NotFoundException e) {
            logger.error("Failed to retrieve catalog with ID {}", catalogId, e);
            return null;
        }
    }
}
