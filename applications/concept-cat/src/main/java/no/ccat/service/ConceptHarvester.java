package no.ccat.service;

import no.ccat.config.HarvestURIList;
import no.ccat.model.ConceptDenormalized;
import no.dcat.shared.HarvestMetadata;
import no.dcat.shared.HarvestMetadataUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.io.IOException;
import java.io.InputStream;
import java.io.Reader;
import java.io.StringReader;
import java.net.URL;
import java.net.URLConnection;
import java.nio.file.Files;
import java.nio.file.Paths;
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
    private final boolean isRunningForDeveloperLocally = false;

    private HarvestURIList harvestURIList;

    @Autowired
    public ConceptHarvester(ConceptDenormalizedRepository conceptDenormalizedRepository, RDFToModelTransformer rdfToModelTransformer, HarvestURIList harvestURIList) {
        this.conceptDenormalizedRepository = conceptDenormalizedRepository;
        this.rdfToModelTransformer = rdfToModelTransformer;
        this.harvestURIList = harvestURIList;
    }

    @PostConstruct
    @Scheduled(cron = "${application.harvestCron}")
    public void harvestFromSource() {
        logger.info("Harvest of Concepts start");

        for (String uri : harvestURIList.getUriList()) {
            harvestFromSingleURLSource(uri);
        }
        logger.info("Harvest of Concepts complete");
    }

    private void harvestFromSingleURLSource(String harvestUri) {
        Reader reader;

        String theEntireDocument = null;

        if (isRunningForDeveloperLocally) {
            logger.info("Harvester isRunningForDeveloperLocally==true");
            theEntireDocument = readFileFully("c:\\tmp\\localConceptsFile.txt");
        } else {
            theEntireDocument = readURLFully(harvestUri);
        }

        reader = new StringReader(theEntireDocument);

        if (reader == null) return;

        List<ConceptDenormalized> concepts = rdfToModelTransformer.getConceptsFromStream(reader);

        logger.info("Harvested {} concepts from Uri {}", concepts.size(), harvestUri);

        concepts.stream().forEach(concept -> {
            conceptDenormalizedRepository.save(concept);
        });
    }

    private String readFileFully(String fileURI) {
        try {
            return new String(Files.readAllBytes(Paths.get(fileURI)));
        } catch (IOException ie) {
            logger.warn("File load failed for File URI " + fileURI);
        }
        return null;
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
            logger.warn("Downloading concepts from url failed: {} Exception {}", harvestSourceUri, e.toString());
            logger.trace("Got exception when trying to harvest from url {} {}", harvestSourceUri , e.getStackTrace());
        }
        return "";
    }
}
