package no.dcat.themes.service;

import com.google.gson.Gson;
import no.dcat.shared.HelpText;
import no.dcat.themes.database.TDBConnection;
import no.dcat.themes.database.TDBService;
import org.apache.commons.io.IOUtils;
import org.apache.jena.query.Dataset;
import org.apache.jena.query.DatasetFactory;
import org.apache.jena.query.ReadWrite;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;

/**
 * Created by extkkj on 10.10.2017.
 */

@Service
public class HelpTextService extends BaseServiceWithFraming {

    @Autowired
    public HelpTextService(TDBConnection tdbConnection) {
        super(tdbConnection);
    }

    private static final String frame;

    static {
        try {
            frame = IOUtils.toString(BaseServiceWithFraming.class.getClassLoader().getResourceAsStream("frames/helptexts.json"), "utf-8");
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }


    @Cacheable("helptexts")
    public List<HelpText> getHelpTexts() {


        return tdbConnection.inTransaction(ReadWrite.READ, connection -> {
            Dataset dataset = DatasetFactory.create(connection.getModel(TDBService.THEMES_GRAPH));

            String json = frame(dataset, frame);


            return new Gson().fromJson(json, FramedHelpText.class).getGraph();
        });
    }

}
