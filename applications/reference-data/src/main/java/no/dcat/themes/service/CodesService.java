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
import org.apache.jena.util.FileManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Scope("thread")

public class CodesService extends BaseServiceWithFraming {


    private static final String frame;

    static {
        try {
            frame = IOUtils.toString(BaseServiceWithFraming.class.getClassLoader().getResourceAsStream("frames/skosCode.json"), "utf-8");
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    @Autowired
    public CodesService(TDBConnection tdbConnection) {
        super(tdbConnection);
    }

    public List<String> listCodes() {
        return Arrays
                .stream(Types.values())
                .map(Types::getType)
                .collect(Collectors.toList());

    }


    @Cacheable("codes")
    public List<SkosCode> getCodes(Types type) {

        return tdbConnection.inTransaction(ReadWrite.READ, connection -> {
            Dataset dataset = DatasetFactory.create(connection.getModelWithInference(type.toString()));

            String json = frame(dataset, frame);
            dataset.close();

            return new Gson().fromJson(json, FramedSkosCode.class).getGraph();
        });

    }


    public SkosCode addLocation(String locationUri) throws MalformedURLException {

        Model model = getRemoteModel(new URL(locationUri));

        tdbConnection.inTransaction(ReadWrite.WRITE, connection -> {
            connection.addModelToGraph(model, Types.location.toString());
            return null;
        });

        return getCode(locationUri);

    }

    public SkosCode getCode(String uri){
        return tdbConnection.inTransaction(ReadWrite.READ, connection -> {
            Dataset dataset = DatasetFactory.create(connection.describeWithInference(uri));
            String json = frame(dataset, frame);

            dataset.close();
            return new Gson().fromJson(json, FramedSkosCode.class).getGraph().get(0);
        });
    }
}
