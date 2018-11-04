package no.acat.spec.converters;

import com.google.gson.JsonElement;
import com.google.gson.JsonParser;
import no.acat.spec.ParseException;
import no.dcat.openapi.OpenAPI;
import no.dcat.openapi.OpenApiV3Parser;

public class OpenApiV3JsonSpecConverter {

    public static boolean canConvert(String spec) {
        try {
            JsonElement element = new JsonParser().parse(spec);
            String version = element.getAsJsonObject().get("openapi").getAsString();
            return version.length() > 2 && version.substring(0, 2).equals("3.");
        } catch (Exception e) {
            return false;
        }
    }

    public static OpenAPI convert(String spec) throws ParseException {
        try {
            return OpenApiV3Parser.parse(spec);
        } catch (Throwable e) {
            throw new ParseException("Cannot import spec as OpenApi v3 json: " + e.getMessage());
        }
    }
}
