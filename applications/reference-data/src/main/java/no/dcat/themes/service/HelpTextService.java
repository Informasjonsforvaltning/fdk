package no.dcat.themes.service;

import com.google.gson.Gson;
import no.dcat.shared.HelpText;
import no.dcat.themes.database.TDBConnection;
import no.dcat.themes.database.TDBInferenceService;
import no.dcat.themes.database.TDBService;
import org.apache.commons.io.IOUtils;
import org.apache.jena.query.Dataset;
import org.apache.jena.query.DatasetFactory;
import org.apache.jena.query.ReadWrite;
import org.apache.jena.rdf.model.Model;
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

    // @Cacheable("helptexts")
    public List<HelpText> getHelpTexts(String id) {
        return getHelpTexts();
    }

    // @Cacheable("helptexts")
    public List<HelpText> getHelpTexts() {


        return tdbConnection.inTransaction(ReadWrite.READ, connection -> {
            Dataset dataset = DatasetFactory.create(helpTextModel(connection));

            String json = frame(dataset, frame);
            logger.trace("JSON returned with Helptexts: {}", json);

            return new Gson().fromJson(json, FramedHelpText.class).getGraph();
        });
    }

    private Model helpTextModel(TDBInferenceService connection) { // TODO: InferenceService shouldn't be necessary
        return connection.getModel(TDBService.HELPTEXTS_GRAPH);
    }
}
