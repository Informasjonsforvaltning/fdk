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
import java.io.*;
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

        String theEntireDocument = readURLFully(harvestSourceUri);

        reader = new StringReader(theEntireDocument);

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

    private String readURLFully(String harvestSourceUri) {
        try {
            URL url = new URL(harvestSourceUri);
            logger.info("Start harvest from url: {}", url);
            URLConnection urlConnection = url.openConnection();
            urlConnection.setRequestProperty("Accept", "text/turtle");

            InputStream inputStream = urlConnection.getInputStream();

            java.util.Scanner s = new java.util.Scanner(inputStream).useDelimiter("\\A");
            String someString = s.hasNext() ? s.next() : "";
            return someString;

        } catch (IOException e) {
            logger.warn("Downloading concepts from url failed:" + harvestSourceUri);
        }
            return "";
        }

    private Reader resourceAsReader(final String resourceName) {
        return new InputStreamReader(getClass().getClassLoader().getResourceAsStream(resourceName), StandardCharsets.UTF_8);
    }
}
