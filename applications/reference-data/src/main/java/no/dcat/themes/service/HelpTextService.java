package no.dcat.themes.service;

import com.google.gson.Gson;
import no.dcat.shared.HelpText;
import no.dcat.themes.database.TDBConnection;
import no.dcat.themes.database.TDBService;
import org.apache.commons.io.IOUtils;
import org.apache.jena.query.Dataset;
import org.apache.jena.query.DatasetFactory;
import org.apache.jena.query.ReadWrite;
import org.apache.jena.rdf.model.*;
import org.apache.jena.shared.NotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;

/**
 * Created by extkkj on 10.10.2017.
 */

@Service
@Scope("thread")

public class HelpTextService extends BaseServiceWithFraming {

    private static Logger logger = LoggerFactory.getLogger(HelpTextService.class);
    private static final String frame;

    static {
        try {
            frame = IOUtils.toString(BaseServiceWithFraming.class.getClassLoader().getResourceAsStream("frames/helptexts.json"), "utf-8");
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    @Autowired
    public HelpTextService(TDBConnection tdbConnection) {
        super(tdbConnection);
    }

    @Cacheable("helptexts")
    public List<HelpText> getHelpTexts(String id) throws NotFoundException {
        return tdbConnection.inTransaction(ReadWrite.READ, connection -> {
            Model model = connection.getModel(TDBService.HELPTEXTS_GRAPH);
            Resource subject = model.createResource("http://brreg.no/fdk/fields#" + id);
            StmtIterator descIter = model.listStatements(subject, null, (RDFNode) null);
            if (! descIter.hasNext()) throw new NotFoundException(id + " Not found");
            Model newModel = ModelFactory.createDefaultModel();
            newModel.add(descIter);
            Dataset dataset = DatasetFactory.create(newModel);

            String json = frame(dataset, frame);
            logger.trace("JSON returned for ID: {} with Helptexts:\n{}", id, json);

            return new Gson().fromJson(json, FramedHelpText.class).getGraph();
        });
    }


    @Cacheable("helptexts")
    public List<HelpText> getHelpTexts() {


        return tdbConnection.inTransaction(ReadWrite.READ, connection -> {
            Model model = connection.getModel(TDBService.HELPTEXTS_GRAPH);
            Dataset dataset = DatasetFactory.create(model);
            if (logger.isTraceEnabled()) {
                logger.trace("Helptexts available for: {}", model.listSubjects().toList().toString());
            }
            String json = frame(dataset, frame);


            return new Gson().fromJson(json, FramedHelpText.class).getGraph();
        });
    }

}
