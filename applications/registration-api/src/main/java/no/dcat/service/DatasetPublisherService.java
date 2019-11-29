package no.dcat.service;

import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.RequiredArgsConstructor;
import no.dcat.model.Dataset;
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

    public void sendHarvestMessage(Dataset dataset) {
        logger.info("Sending harvest message to queue for dataset with ID {} in catalog with ID {}", dataset.getId(), dataset.getCatalogId());

        String publisherId = dataset.getCatalog().getPublisher().getId();

        logger.info("Setting harvest message publisher to {}", publisherId);
        ObjectNode payload = JsonNodeFactory.instance.objectNode();
        payload.put("publisherId", publisherId);

        try {
            rabbitTemplate.convertAndSend(payload);
            logger.info("Successfully sent harvest message for publisher {}", publisherId);
        } catch (AmqpException e) {
            logger.error("Failed to send harvest message for publisher {}", publisherId, e);
        }
    }
}
