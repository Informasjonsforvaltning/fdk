package no.dcat.harvester.service;

import com.google.gson.*;
import no.dcat.datastore.domain.dcat.builders.DatasetBuilder;
import no.dcat.datastore.domain.dcat.builders.DcatBuilder;
import no.dcat.shared.Publisher;
import no.dcat.shared.Subject;
import no.fdk.test.testcategories.UnitTest;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVRecord;
import org.apache.jena.rdf.model.Model;
import org.apache.jena.rdf.model.ResIterator;
import org.apache.jena.rdf.model.Resource;
import org.apache.jena.vocabulary.RDF;
import org.apache.jena.vocabulary.SKOS;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.junit.Ignore;
import org.junit.Test;
import org.junit.experimental.categories.Category;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.PathResource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;


@Category(UnitTest.class)
public class UploadSubjectsToElastic {

    private static final String BEGREP_TTL_URL = "D:\\git\\fdk\\conf\\subjects\\jira@brreg 2018-05-04T15_33_37+0200.html";
    private static final String FOLDER = "D://git/fdk/conf/subjects";
    private static Logger logger = LoggerFactory.getLogger(UploadSubjectsToElastic.class);
    final String lok = "http://localhost:9200";
    final String ut1 = "http://elasticsearch-fellesdatakatalog-ut1.ose-npc.brreg.no";
    final String tt1 = "http://elasticsearch-fellesdatakatalog-tt1.ose-npc.brreg.no";
    final String st2 = "http://elasticsearch-fellesdatakatalog-st2.ose-npc.brreg.no";
    final String ppe = "http://elasticsearch-fellesdatakatalog-ppe.ose-pc.brreg.no";

    final String ELASTIC_TARGET = ppe;


    /**
     * Reads subjects from CSV file (exported from JIRA) and extracts subject information from the file.
     * It generates a RDF. Finally it uploads the Subject to the requested elasticsearch server.
     * <p>
     * Notice that BRREG's JIRA CSV export generates two identical columns called "Computas sak", one of them must be
     * renamed
     *
     * @throws Throwable
     */
    @Test
    @Ignore
    public void uploadSubjectsFromJiraCSVtoElasticsearch() throws Throwable {

        String filename = FOLDER + "/brreg_begreper4_2018-05-07.csv";
        Iterable<CSVRecord> records = readCsvRecords(filename);

        if (records == null) {
            throw new IOException("Couldn't read input cvsfile: " + filename);
        }

        // set publisher
        Publisher publisher = new Publisher();
        publisher.setUri("http://data.brreg.no/enhetsregisteret/enhet/974760673");
        publisher.setName("Registerenheten i Brønnøysund");
        publisher.setPrefLabel(new HashMap<>());
        publisher.getPrefLabel().put("no", "Brønnøysundregistrene");
        publisher.setId("974760673");
        publisher.setOrgPath("/STAT/912660680/974760673");

        Model model = createRDFModel(extractSubjectsFromCSV(records, publisher));

        // update elasticsearch instance
        postSubjectsFromModel(ELASTIC_TARGET, model);
    }

    @Test
    @Ignore
    public void upladSubjectsFromJiraHtml2Elasticsearch() throws Throwable {
        List<Map<String, String>> records = readHtmlTable(BEGREP_TTL_URL);
    }


    @Test
    @Ignore
    public void deleteSubjectsFromElastic() throws Throwable {

        String host = st2;

        List<String> identifiersToBeDeleted = new ArrayList<>(); //getSubjectsToBeDeleted(host);
        identifiersToBeDeleted.add("null");
        RestTemplate template = new RestTemplate();

        for (String id : identifiersToBeDeleted) {
            try {
                if (!id.startsWith("http")) {
                    template.delete(host + "/scat/subject/" + id);
                    logger.info("Successfully deleted: {}", id);
                }
            } catch (HttpClientErrorException ex) {
                logger.info("Unable to delete: {} due to: {}", id, ex.getMessage());
            }
        }
    }


    private List<String> getSubjectsToBeDeleted(String host) {

        List<String> result = new ArrayList<>();

        RestTemplate template = new RestTemplate();
        ResponseEntity<String> response = template.getForEntity(host + "/dcat/subject/_search?fields=_id&size=50", String.class);

        String json = response.getBody();
        Gson gson = new Gson();
        JsonObject jsonObject = gson.fromJson(json, JsonObject.class);
        JsonArray hitsArray = jsonObject.get("hits").getAsJsonObject().get("hits").getAsJsonArray();

        for (JsonElement element : hitsArray) {
            String id = element.getAsJsonObject().get("_id").getAsString();
            logger.debug(id);
            result.add(id);
        }

        return result;
    }

    private void postSubjectsFromModel(String host, Model model) {
        List<Subject> subjects = new ArrayList<>();
        ResIterator subjectsIterator = model.listResourcesWithProperty(RDF.type, SKOS.Concept);
        while (subjectsIterator.hasNext()) {
            Resource r = subjectsIterator.nextResource();
            Subject s = DatasetBuilder.extractSubject(r);
            s.getCreator().setOrgPath("/STAT/912660680/974760673");
            subjects.add(s);
        }

        logger.info("Antall begrep i fil {}", subjects.size());

        Gson gson = new GsonBuilder().setPrettyPrinting().setDateFormat("yyyy-MM-dd'T'HH:mm:ssZ").create();
        RestTemplate template = new RestTemplate();

        subjects.forEach(subject -> {
            String url = host + "/scat/subject/" + subject.getIdentifier();
            logger.info(url);
            template.postForObject(url, subject, Subject.class);
        });

        logger.info("Hurra {} begrep er lastet opp til {}", subjects.size(), host);
    }

    private Model createRDFModel(List<Subject> subjects) {
        // Build RDF model
        DcatBuilder builder = new DcatBuilder();
        Model model = builder.getModel();
        int i = 0;

        // add subject resources
        for (Subject subject : subjects) {
            Resource resource = model.createResource(subject.getUri()); //AnonId.create("arkiv" +i));
            builder.addSubjectContent(subject, resource);

            i++;
        }

        if (logger.isDebugEnabled()) {
            model.write(System.out, "TURTLE");
        }
        return model;
    }

    private List<Subject> extractSubjectsFromCSV(Iterable<CSVRecord> records, Publisher publisher) {
        List<Subject> subjects = new ArrayList<>();
        for (CSVRecord record : records) {

            final String term = record.get("Summary");
            if (term == null || term.isEmpty()) {
                continue;
            }

            logger.info("Processing: {} ", term);
            Subject subject = new Subject();

            // prefLabel: skos:prefLabel
            subject.setPrefLabel(new HashMap<>());
            subject.getPrefLabel().put("no", term);

            // Creator: dct:creator
            subject.setCreator(publisher);

            // identifier/uri
            subject.setUri("http://brreg.no/vocabulary/" + record.get("Key"));
            subject.setIdentifier(record.get("Key"));

            // Alternative term: skos:altLabel
            final String altTerm = record.get("Alternativ term");

            if (altTerm != null && !altTerm.isEmpty()) {
                subject.setAltLabel(new ArrayList<>());
                String[] terms = altTerm.split(",");

                for (String t : terms) {
                    Map<String, String> label = new HashMap<>();
                    label.put("no", t);
                    subject.getAltLabel().add(label);
                }
            }

            // Created dct:created
            try {
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
            } catch (IllegalArgumentException e) {
                logger.warn("Created not present");
            }
            // Definition: dct:definition
            subject.setDefinition(new HashMap<>());
            subject.getDefinition().put("no", record.get("Definisjon"));

            // Source: dct:source

            try {
                final String source = record.get("Kilde til definisjon");

                subject.setSource(source);
            } catch (IllegalArgumentException e) {
                logger.warn("Kilde til definisjon er ikke satt");
            }

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

    private List<Map<String, String>> readHtmlTable(String fileName) {
        List<Map<String, String>> result = new ArrayList<>();

        org.springframework.core.io.Resource subjectResource = new PathResource(fileName);
        try {
            Document doc = Jsoup.parse(subjectResource.getFile(), "UTF-8", "http://brreg.no");

            Element table = doc.getElementById("issuetable");
            Elements headings_rows = table.select("thead tr");

            List<String> headings = new ArrayList<>();
            headings_rows.select("th").forEach(heading -> headings.add(heading.text()));

            Elements rows = table.select("tbody tr");

            rows.forEach(row -> {
                Map<String, String> record = new HashMap<>();

                Elements values = row.children();
                for (int i = 0; i < values.size(); i++) {
                    Element value = values.get(i);
                    String heading = headings.get(i);

                    record.put(heading, value.text());
                }

                result.add(record);

            });

            return result;

        } catch (IOException e) {
            logger.error("Could not read subject file: {}", e.getMessage());
            return null;
        }
    }
}
