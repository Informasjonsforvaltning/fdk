package no.fdk.acat.converters.apispecificationparser;

import com.google.gson.JsonElement;
import com.google.gson.JsonParser;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.parser.converter.SwaggerConverter;
import no.fdk.acat.common.model.apispecification.ApiSpecification;

public class SwaggerJsonParser implements Parser {
    public boolean canParse(String spec) {
        try {
            JsonElement element = new JsonParser().parse(spec);
            String version = element.getAsJsonObject().get("swagger").getAsString();
            return version.length() > 2 && version.substring(0, 2).equals("2.");
        } catch (Exception e) {
            return false;
        }
    }

    public OpenAPI parseToOpenAPI(String spec) throws ParseException {
        try {
            return new SwaggerConverter().readContents(spec, null, null).getOpenAPI();
        } catch (Throwable e) {
            throw new ParseException("Error parsing spec as Swagger v2 json: " + e.getMessage());
        }
    }

    public ApiSpecification parse(String spec) throws ParseException {
        OpenAPI openAPI = parseToOpenAPI(spec);
        ApiSpecification apiSpecification = OpenAPIToApiSpecificationConverter.convert(openAPI);

        // TODO parse formats

        return apiSpecification;
    }
}
