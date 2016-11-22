package no.dcat.portal.webapp;

import com.google.gson.*;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by mgu on 16.11.2016.
 */
public final class ElasticSearchResponse {
    public <T> List<T> toListOfObjects(String json, Class<T> classOfT) {
        List<T> listObjects = new ArrayList<T>();

        JsonElement completeResponseAsElement = new JsonParser().parse(json);
        JsonObject completeResponseAsObject = completeResponseAsElement.getAsJsonObject();
        JsonObject hitsResponseAsElement = completeResponseAsObject.getAsJsonObject("hits");
        JsonArray hitsResponseAsArray = hitsResponseAsElement.getAsJsonArray("hits");

        for (JsonElement jsonDataTheme : hitsResponseAsArray) {
            JsonObject hitAsJsonObject = jsonDataTheme.getAsJsonObject();
            T hitAsObject = new Gson().fromJson(hitAsJsonObject.get("_source"), classOfT);

            listObjects.add(hitAsObject);
        }
        return listObjects;
    }
}
