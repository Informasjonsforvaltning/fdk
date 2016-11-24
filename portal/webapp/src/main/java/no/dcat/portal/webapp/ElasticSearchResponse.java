package no.dcat.portal.webapp;

import com.google.gson.*;

import java.util.ArrayList;
import java.util.List;

/**
 * Class for transforming json-string to a list of objects, The type of object is specified by the input type.
 * @Auther: Marcus Gustafson
 */
public final class ElasticSearchResponse {

    public static final String TAG_DEFINING_HIT_OBJECT = "hits";
    public static final String TAG_DEFINING_LIST_OF_HITS = "hits";
    public static final String TAG_DEFINING_SOURCE = "_source";

    /**
     * Method for transforming json-string to a list of objects, The type of object is specified by the input type.
     * <p/>
     * @param json   A Json string, which represent a list of objects that corresponds to the type specified in the input.
     * @param classOfT  Specifies the type of objects in the list returned.
     * @param <T> Specifies the type of objects in the list returned.
     * @return A list of objects which type is specified by the
     */
    public <T> List<T> toListOfObjects(String json, Class<T> classOfT) {
        List<T> listObjects = new ArrayList<T>();

        JsonElement completeResponseAsElement = new JsonParser().parse(json);
        JsonObject completeResponseAsObject = completeResponseAsElement.getAsJsonObject();
        JsonObject hitsResponseAsElement = completeResponseAsObject.getAsJsonObject(TAG_DEFINING_HIT_OBJECT);
        JsonArray hitsResponseAsArray = hitsResponseAsElement.getAsJsonArray(TAG_DEFINING_LIST_OF_HITS);

        for (JsonElement jsonDataTheme : hitsResponseAsArray) {
            JsonObject hitAsJsonObject = jsonDataTheme.getAsJsonObject();
            T hitAsObject = new Gson().fromJson(hitAsJsonObject.get(TAG_DEFINING_SOURCE), classOfT);

            listObjects.add(hitAsObject);
        }
        return listObjects;
    }
}
