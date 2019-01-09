package no.ccat.service;

import no.ccat.model.ConceptDenormalized;
import no.dcat.shared.HarvestMetadata;
import no.dcat.shared.HarvestMetadataUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.Reader;
import java.net.URL;
import java.net.URLConnection;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.List;

/*
    Fetch concepts and insert or update them in the search index.
 */
@Service
public class ConceptHarvester {
    private static final Logger logger = LoggerFactory.getLogger(ConceptHarvester.class);

    private final ConceptDenormalizedRepository conceptDenormalizedRepository;
    private final RDFToModelTransformer rdfToModelTransformer;

    @Value("${application.harvestSourceUri}")
    private String harvestSourceUri;

    @Autowired
    public ConceptHarvester(ConceptDenormalizedRepository conceptDenormalizedRepository, RDFToModelTransformer rdfToModelTransformer) {
        this.conceptDenormalizedRepository = conceptDenormalizedRepository;
        this.rdfToModelTransformer = rdfToModelTransformer;
    }

    @PostConstruct
    public void harvestFromSource() {
        Reader reader;

        reader = getReaderFromURL(harvestSourceUri);
        if (reader == null) return;

        List<ConceptDenormalized> concepts = rdfToModelTransformer.getConceptsFromStream(reader);

        logger.info("Harvested {} concepts", concepts.size());


        Date harvestDate = new Date();
        concepts.stream().forEach(concept -> {
            HarvestMetadata harvest = HarvestMetadataUtil.createOrUpdate(null, harvestDate, false);
            concept.setHarvest(harvest);
            conceptDenormalizedRepository.save(concept);
        });
    }

    private Reader getReaderFromURL(String harvestSourceUri) {
        Reader reader;
        try {
            URL url = new URL(harvestSourceUri);
            logger.info("Start harvest from url: {}", url);
            URLConnection urlConnection = url.openConnection();
            urlConnection.setRequestProperty("Accept", "text/turtle");

            InputStream inputStream = urlConnection.getInputStream();

            reader = new InputStreamReader(inputStream);
        } catch (IOException e) {
            logger.warn("Downloading concepts from url failed:" + harvestSourceUri);
            return null;
        }
        return reader;
    }

    private Reader resourceAsReader(final String resourceName) {
        return new InputStreamReader(getClass().getClassLoader().getResourceAsStream(resourceName), StandardCharsets.UTF_8);
    }
}
