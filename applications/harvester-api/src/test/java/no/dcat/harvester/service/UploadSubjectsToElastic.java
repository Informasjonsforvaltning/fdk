package no.dcat.harvester.service;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import no.dcat.datastore.domain.dcat.builders.DatasetBuilder;
import no.dcat.datastore.domain.dcat.builders.DcatBuilder;
import no.dcat.shared.Publisher;
import no.dcat.shared.Subject;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVRecord;
import org.apache.jena.rdf.model.Model;
import org.apache.jena.rdf.model.ResIterator;
import org.apache.jena.rdf.model.Resource;
import org.apache.jena.util.FileManager;
import org.apache.jena.vocabulary.RDF;
import org.apache.jena.vocabulary.SKOS;
import org.junit.Ignore;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.PathResource;
import org.springframework.web.client.RestTemplate;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;


public class UploadSubjectsToElastic {

    private static final String BEGREP_TTL_URL = "file://d:/git/fdk/conf/subjects/begrep.ttl";
    private static Logger logger = LoggerFactory.getLogger(UploadSubjectsToElastic.class);

    private static final String FOLDER = "D://git/fdk/conf/subjects";

    final String lok = "http://localhost:9200";
    final String ut1 = "http://elasticsearch-fellesdatakatalog-ut1.ose-npc.brreg.no";
    final String tt1 = "http://elasticsearch-fellesdatakatalog-tt1.ose-npc.brreg.no";
    final String st2 = "http://elasticsearch-fellesdatakatalog-st2.ose-npc.brreg.no";

    /**
     * Should not be run as a test. Hack to upload subjects to elastic.
     * 
     * @throws Throwable
     */
    @Test
    @Ignore
    public void uploadSubjectsFromFiletoElasticsearch() throws Throwable {
        Model model = FileManager.get().loadModel(BEGREP_TTL_URL);
        // model.write(System.out, "TURTLE");

        postSubjectsFromModel(tt1, model);
    }


    /**
     * Reads subjects from CSV file (exported from JIRA) and extracts subject information from the file.
     * It generates a RDF. Finally it uploads the Subject to the requested elasticsearch server.
     *
     * Notice that BRREG's JIRA CSV export generates two identical columns called "Computas sak", one of them must be
     * renamed
     *
     * @throws Throwable
     */
    @Test
    @Ignore
    public void uploadSubjectsFromJiraCSVtoElasticsearch() throws Throwable {

        String filename = FOLDER + "/Begreper.csv";
        Iterable<CSVRecord> records = readCsvRecords(filename);

        if (records == null) {
            throw new IOException("Couldn't read input cvsfile: " +filename);
        }

        // set publisher
        Publisher publisher = new Publisher();
        publisher.setUri("http://data.brreg.no/enhetsregisteret/enhet/974760673");
        publisher.setName("Brønnøysundregistrene");
        publisher.setId("974760673");

        Model model = createRDFModel(extractSubjectsFromCSV(records, publisher));

        // update elasticsearch instance
        postSubjectsFromModel(st2, model);

    }

    private void postSubjectsFromModel(String host, Model model) {
        List<Subject> subjects = new ArrayList<>();
        ResIterator subjectsIterator = model.listResourcesWithProperty(RDF.type, SKOS.Concept);
        while (subjectsIterator.hasNext()) {
            Resource r = subjectsIterator.nextResource();
            Subject s = DatasetBuilder.extractSubject(r);
            subjects.add(s);
        }

        logger.info("Antall begrep i fil {}", subjects.size());

        Gson gson = new GsonBuilder().setPrettyPrinting().setDateFormat("yyyy-MM-dd'T'HH:mm:ssZ").create();
        RestTemplate template = new RestTemplate();

        subjects.forEach(subject -> {
            template.postForObject(host +"/dcat/subject", subject, Subject.class );
        });

        logger.info ("Hurra {} begrep er lastet opp til {}", subjects.size(), host);
    }

    private Model createRDFModel(List<Subject> subjects) {
        // Build RDF model
        DcatBuilder builder = new DcatBuilder();
        Model model = builder.getModel();
        int i = 0;

        // add subject resources
        for (Subject subject : subjects ) {
            Resource resource = model.createResource(subject.getIdentifier()); //AnonId.create("arkiv" +i));
            builder.addSubjectContent(subject, resource);

            i++;
        }

        if (logger.isInfoEnabled()) {
            model.write(System.out, "TURTLE");
        }
        return model;
    }

    private List<Subject> extractSubjectsFromCSV(Iterable<CSVRecord> records, Publisher publisher) {
        List<Subject> subjects = new ArrayList<>();
        for (CSVRecord record : records) {
            logger.info("Processing: {} ", record.get("Summary"));
            Subject subject = new Subject();

            // prefLabel: skos:prefLabel
            subject.setPrefLabel(new HashMap<>());
            subject.getPrefLabel().put("no", record.get("Summary"));

            // Creator: dct:creator
            subject.setCreator(publisher);

            // identifier/uri
            subject.setIdentifier("http://brreg.no/vocabulary/" +record.get("Key"));

            // Alternative term: skos:altLabel
            final String altTerm = record.get("Alternativ term");

            if (altTerm != null && !altTerm.isEmpty()) {
                subject.setAltLabel(new ArrayList<>());
                String[] terms = altTerm.split(",");

                for (String term : terms) {
                    Map<String, String> label = new HashMap<>();
                    label.put("no", term);
                    subject.getAltLabel().add(label);
                }
            }

            // Created dct:created
            final String created = record.get("Created");
            SimpleDateFormat firstJiraDate = new SimpleDateFormat("dd.MM.yyyy HH:mm");
            SimpleDateFormat secondJiraDate = new SimpleDateFormat("dd/MMM/yy HH:mm", Locale.ENGLISH);
            SimpleDateFormat isoDate = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ssZ");

            Date dt = null;
            try {
                dt = firstJiraDate.parse(created);
            } catch (ParseException pe) {
                try {
                    dt = secondJiraDate.parse(created);
                } catch (ParseException pe2) {
                    logger.error("Wrong input date format {}", created);
                }
            }
            if (dt != null) {
                // handle creation date, but subject doesn't have that field
                String dctCreated = isoDate.format(dt);

            }

            // Definition: dct:definition
            subject.setDefinition(new HashMap<>());
            subject.getDefinition().put("no", record.get("Definisjon"));

            // Note
            final String note = record.get("Kommentar");
            if (note != null && !note.isEmpty()) {
                subject.setNote(new HashMap<>());
                subject.getNote().put("no", note);
            }

            subjects.add(subject);
        }
        return subjects;
    }

    private Iterable<CSVRecord> readCsvRecords(String filename) {
        org.springframework.core.io.Resource subjectResource = new PathResource(filename);
        Reader in = null;
        Iterable<CSVRecord> records = null;
        try {
            in = new BufferedReader(new InputStreamReader(subjectResource.getInputStream()));
            records = CSVFormat.EXCEL.withDelimiter(';').withHeader().parse(in);
        } catch (IOException e) {
            logger.error("Could not read subject file: {}", e.getMessage());
            return null;
        }
        return records;
    }
}
