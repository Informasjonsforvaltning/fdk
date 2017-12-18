package no.dcat.harvester.service;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import no.dcat.shared.Subject;
import no.dcat.datastore.domain.dcat.builders.DatasetBuilder;
import org.apache.jena.rdf.model.Model;
import org.apache.jena.rdf.model.ResIterator;
import org.apache.jena.util.FileManager;
import org.apache.jena.vocabulary.RDF;
import org.apache.jena.vocabulary.SKOS;
import org.junit.Ignore;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.client.RestTemplate;

import java.net.UnknownHostException;
import java.util.ArrayList;
import java.util.List;


public class UploadSubjectsToElastic {
    private static Logger logger = LoggerFactory.getLogger(UploadSubjectsToElastic.class);


    @Test
    @Ignore
    public void uploadSubjects() throws Throwable {
        final String lok = "http://localhost:9200";
        final String ut1 = "http://elasticsearch-fellesdatakatalog-ut1.ose-npc.brreg.no";
        final String st2 = "http://elasticsearch-fellesdatakatalog-st2.ose-npc.brreg.no";

        postSubjects(lok);

    }

    private void postSubjects(String host) throws UnknownHostException {
        Model model = FileManager.get().loadModel("file://d:/git/fdk/conf/subjects/begrep.ttl");

       // model.write(System.out, "TURTLE");

        List<Subject> subjects = new ArrayList<>();
        ResIterator subjectsIterator = model.listResourcesWithProperty(RDF.type, SKOS.Concept);
        while (subjectsIterator.hasNext()) {
            org.apache.jena.rdf.model.Resource r = subjectsIterator.nextResource();
            Subject s = DatasetBuilder.extractSubject(r);
            subjects.add(s);
        }

        logger.info("Antall begrep i fil {}", subjects.size());

        Gson gson = new GsonBuilder().setPrettyPrinting().setDateFormat("yyyy-MM-dd'T'HH:mm:ssZ").create();
        RestTemplate template = new RestTemplate();

        subjects.forEach(subject -> {
            template.postForObject(host +"/dcat/subject", subject, Subject.class );
        });

        logger.info ("Success. Begrep er lastet opp til {}", host);

    }
}
