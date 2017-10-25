package no.dcat.migration;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonParser;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class ConvertPpeToSt1 {
    private static Logger logger = LoggerFactory.getLogger(ConvertPpeToSt1.class);

    public static String dateFormat = "yyyy-MM-dd'T'hh.mm.ss.SSSZ";
    public static SimpleDateFormat dateFormater = new SimpleDateFormat(dateFormat);

    public static void main(String[] args) {
        ConvertPpeToSt1 converter = new ConvertPpeToSt1();
        try {
            converter.readPpe();
        } catch (IOException e) {
            logger.error("io-exception: {}", e.getMessage(), e);
        }
    }

    /*
            new GsonBuilder().registerTypeAdapter(Date.class, new JsonDeserializer<Date>() {
        public Date deserialize(JsonElement jsonElement, Type type, JsonDeserializationContext context) throws JsonParseException {
            return new Date(jsonElement.getAsJsonPrimitive().getAsLong());
        }
    })
            .create();
    */


    public void readPpe() throws IOException {
        String inputFile = "ppe_all_dataset.json";
        Gson gson = new Gson();

        Resource resource = new ClassPathResource(inputFile);
        BufferedReader reader = new BufferedReader(new InputStreamReader(resource.getInputStream()));

        PrintWriter writer = new PrintWriter("sdk_ppe_output.json");
        List<ElasticIndex> data = new ArrayList<>();
        while (reader.ready()) {
            String json = reader.readLine();

            String json2 = convert(json);

            writer.println(json2);

           // ElasticIndex dataset = gson.fromJson(json2, ElasticIndex.class);

            //logger.debug(dataset.toString());
            //data.add(dataset);
        }

        logger.info("Antall dataset: {}", data.size());

        // export "2017-10-19T07:50:03.600+0000"
        Gson builder = new GsonBuilder().create(); //.setDateFormat(dateFormat).create();

        //PrintWriter writer = new PrintWriter("sdk_ppe_output.json");
/*
        data.forEach(dataset -> {

            String j = builder.toJson(dataset);
            logger.debug(j);
            writer.println(j);
        });
*/
        writer.close();

    }


    public String convert(String json) {

        JsonElement element = new JsonParser().parse(json);
        JsonElement dataset = element.getAsJsonObject().get("_source");
/*
        fixDate(dataset, "modified");
        fixDate(dataset, "issued");

        if (dataset.getAsJsonObject().get("temporal") != null) {
            JsonArray temporal = dataset.getAsJsonObject().get("temporal").getAsJsonArray();
            if (temporal != null) {
                for (int i = 0; i < temporal.size(); i++) {
                    JsonElement timePeriod = temporal.get(i);

                    fixDate(timePeriod, "startDate");
                    fixDate(timePeriod, "endDate");
                }
            }
        }
*/
        JsonElement catalog = dataset.getAsJsonObject().get("catalog");
        String catalogId = catalog.getAsString();
        dataset.getAsJsonObject().remove("catalog");
        dataset.getAsJsonObject().addProperty("catalogId", catalogId);

        return element.toString();
    }

    private void fixDate(JsonElement element, String fieldName) {
        JsonElement dateElement = element.getAsJsonObject().get(fieldName);
        if (dateElement != null) {
            String dateInteger = dateElement.getAsString();

            if (dateInteger.length() == 10) {
                dateInteger += "000";
            }

            Date d = new Date(Long.parseLong(dateInteger));
            String formattedDate = dateFormater.format(d);

            logger.info("convert date {} from {} to {}", fieldName, dateInteger, formattedDate );
            try {
                Date newDate = dateFormater.parse(formattedDate);
                element.getAsJsonObject().remove(fieldName);
                element.getAsJsonObject().addProperty(fieldName, newDate.getTime());
            } catch (ParseException p) {
                logger.error("Couldn't parse date: {}", formattedDate, p);
            }
        }
    }
}
