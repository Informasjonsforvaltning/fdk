package no.acat.spec.converters;

import com.google.gson.JsonElement;
import com.google.gson.JsonParser;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.parser.converter.SwaggerConverter;
import no.acat.spec.ParseException;

public class SwaggerJsonSpecConverter {
    public static boolean canConvert(String spec) {
        try {
            JsonElement element = new JsonParser().parse(spec);
            String version = element.getAsJsonObject().get("swagger").getAsString();
            return version.length() > 2 && version.substring(0, 2).equals("2.");
        } catch (Exception e) {
            return false;
        }
    }

    public static OpenAPI convert(String spec) throws ParseException {
        try {
            return new SwaggerConverter().readContents(spec, null, null).getOpenAPI();
        } catch (Throwable e) {
            throw new ParseException("Error parsing spec as Swagger v2 json: " + e.getMessage());
        }
    }
}
