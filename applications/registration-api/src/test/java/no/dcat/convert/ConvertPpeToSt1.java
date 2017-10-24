package no.dcat.convert;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import no.dcat.model.Dataset;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;

import java.io.BufferedReader;
import java.io.FileWriter;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;

public class ConvertPpeToSt1 {
    private static Logger logger = LoggerFactory.getLogger(ConvertPpeToSt1.class);

    @Test
    public void readPpe() throws Throwable {
        Gson gson = new Gson();
        Resource resource = new ClassPathResource("skd_ppe.json");
        BufferedReader reader = new BufferedReader(new InputStreamReader(resource.getInputStream()));

        List<ElasticIndex> data = new ArrayList<>();
        while (reader.ready()) {
            String json = reader.readLine();

            String json2 = convert(json);

            ElasticIndex dataset = gson.fromJson(json2, ElasticIndex.class);

            logger.info(dataset.toString());
            data.add(dataset);
        }

        logger.info("Antall dataset: {}", data.size());

        // export "2017-10-19T07:50:03.600+0000"
        Gson builder = new GsonBuilder().setDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSX").create();

        PrintWriter writer = new PrintWriter("sdk_ppe_output.json");

        data.forEach(dataset -> {

            String j = builder.toJson(dataset);
            logger.info(j);
            writer.println(j);
        });

        writer.close();

    }


    public String convert(String json) {

        JsonElement element = new JsonParser().parse(json);
        JsonElement dataset = element.getAsJsonObject().get("_source");

        JsonElement catalog = dataset.getAsJsonObject().get("catalog");
        String catalogId = catalog.getAsString();
        dataset.getAsJsonObject().remove("catalog");
        dataset.getAsJsonObject().addProperty("catalogId", catalogId);

        return element.toString();
    }
}
