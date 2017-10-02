package no.dcat.themes.service;

import com.google.gson.Gson;
import no.dcat.shared.SkosCode;
import no.dcat.shared.Types;
import no.dcat.themes.database.TDBConnection;
import org.apache.commons.io.IOUtils;
import org.apache.jena.query.Dataset;
import org.apache.jena.query.DatasetFactory;
import org.apache.jena.query.ReadWrite;
import org.apache.jena.rdf.model.Model;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;

@Service
public class SubjectsService extends BaseServiceWithFraming {

    static private final Logger logger = LoggerFactory.getLogger(SubjectsService.class);

    private static final String frame;

    static {
        try {
            frame = IOUtils.toString(BaseServiceWithFraming.class.getClassLoader().getResourceAsStream("frames/skosCode.json"), "utf-8");
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    @Autowired
    public SubjectsService(TDBConnection tdbConnection) {
        super(tdbConnection);
    }


    @Cacheable("subjects")
    public SkosCode addSubject(String uri) throws MalformedURLException {

        try {
            return getSubject(uri);
        } catch (Throwable e) {
            Model model = getRemoteModel(new URL(uri));

            tdbConnection.inTransaction(ReadWrite.WRITE, connection -> {
                connection.addModelToGraph(model, Types.subject.toString());
                return null;
            });

            return getSubject(uri);
        }


    }

    public SkosCode getSubject(String uri) {
        return tdbConnection.inTransaction(ReadWrite.READ, connection -> {
            Dataset dataset = DatasetFactory.create(connection.describeWithInference(uri));
            String json = frame(dataset, frame);

            dataset.close();
            return new Gson().fromJson(json, FramedSkosCode.class).getGraph().get(0);
        });
    }
}
