package no.dcat.client.conceptcat;

import lombok.Getter;
import lombok.Setter;
import no.ccat.common.model.Concept;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/*
ConceptCatClient is a library for consuming REST api with strong types.
 */
public class ConceptCatClient {
    @Getter
    @Setter
    private String apiRootUrl;

    private static Logger logger = LoggerFactory.getLogger(ConceptCatClient.class);

    public List<Concept> getByIds(List<String> ids) {


        List<Concept> result = ids.stream()
            .map(id->getById(id))
            .filter(Optional::isPresent)
            .map(Optional::get)
            .collect(Collectors.toList());

        return result;
    }

    public Optional<Concept> getById(String id) {
        Concept concept = new Concept();
        try {
            RestTemplate restTemplate = new RestTemplate();
            concept =  restTemplate.getForObject(getConceptUrlBase(id), Concept.class);
            logger.debug("String response from public apis ");

        } catch (Exception e) {
            logger.info("Error. Cannot read concept {}", e.getMessage());
            logger.debug("Error. Stack trace", e);
        }


        return Optional.ofNullable( concept );
    }
    public String getConceptUrlBase(String id) {

        return getApiRootUrl() + "/concepts/" + id;
    }
}
