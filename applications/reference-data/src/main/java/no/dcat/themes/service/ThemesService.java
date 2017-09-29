package no.dcat.themes.service;

import com.google.gson.Gson;
import no.dcat.shared.DataTheme;
import no.dcat.themes.database.TDBConnection;
import no.dcat.themes.database.TDBService;
import org.apache.commons.io.IOUtils;
import org.apache.jena.query.Dataset;
import org.apache.jena.query.DatasetFactory;
import org.apache.jena.query.ReadWrite;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;

@Service
@Scope("thread")

public class ThemesService extends BaseServiceWithFraming {


    @Autowired
    public ThemesService(TDBConnection tdbConnection) {
        super(tdbConnection);
    }

    private static final String frame;

    static {
        try {
            frame = IOUtils.toString(BaseServiceWithFraming.class.getClassLoader().getResourceAsStream("frames/themes.json"), "utf-8");
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }


    @Cacheable("themes")
    public List<DataTheme> getThemes() {


        return tdbConnection.inTransaction(ReadWrite.READ, connection -> {
            Dataset dataset = DatasetFactory.create(connection.getModelWithInference(TDBService.THEMES_GRAPH));

            String json = frame(dataset, frame);

            return new Gson().fromJson(json, FramedDataTheme.class).getGraph();
        });
    }


}
