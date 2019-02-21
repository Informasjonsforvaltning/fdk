package no.fdk.acat.converters.apispecificationparser;

import com.google.gson.JsonElement;
import com.google.gson.JsonParser;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.Operation;
import io.swagger.v3.oas.models.Paths;
import io.swagger.v3.oas.models.media.Content;
import io.swagger.v3.oas.models.responses.ApiResponse;
import io.swagger.v3.oas.models.responses.ApiResponses;
import io.swagger.v3.parser.OpenAPIV3Parser;
import no.fdk.acat.common.model.apispecification.ApiSpecification;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class OpenApiV3JsonParser implements Parser {

    public boolean canParse(String spec) {
        try {
            JsonElement element = new JsonParser().parse(spec);
            String version = element.getAsJsonObject().get("openapi").getAsString();
            if (!(version.length() > 2 && version.substring(0, 2).equals("3."))) {
                return false;
            }

            JsonElement info = element.getAsJsonObject().get("info");
            if (info == null) {
                return false;
            }

            String title = info.getAsJsonObject().get("title").getAsString();
            if (title == null || title.isEmpty()) {
                return false;
            }
            String documentVersion = info.getAsJsonObject().get("version").getAsString();
            if (documentVersion == null || documentVersion.isEmpty()) {
                return false;
            }

            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public OpenAPI parseToOpenAPI(String spec) throws ParseException {
        try {
            return new OpenAPIV3Parser().readContents(spec, null, null).getOpenAPI();
        } catch (Throwable e) {
            throw new ParseException("Error parsing spec as OpenApi v3 json: " + e.getMessage());
        }
    }

    Set<String> extractFormatsFromOpenAPI(OpenAPI openAPI) {
        Set<String> formats = new HashSet<>();
        Paths paths = openAPI.getPaths();
        paths.forEach((path, pathItem) -> {
            List<Operation> operations = pathItem.readOperations();
            operations.forEach((operation -> {
                if (operation == null) return;

                /*as of now, request body formats are not included, due to the fact that the team decided that the focus here is on the output formats.
                RequestBody requestBody = operation.getRequestBody();
                if (requestBody == null) return;
                Content requestBodyContent = requestBody.getContent();
                if (requestBodyContent==null) return;
                formats.addAll(requestBodyContent.keySet());
                */

                ApiResponses apiResponses = operation.getResponses();
                if (apiResponses == null) return;
                List<ApiResponse> apiResponseList = new ArrayList<>(apiResponses.values());
                apiResponseList.forEach(apiResponse -> {
                    Content responseContent = apiResponse.getContent();
                    if (responseContent == null) return;
                    formats.addAll(responseContent.keySet());
                });
            }));
        });
        return formats;
    }

    public ApiSpecification parse(String spec) throws ParseException {
        OpenAPI openAPI = parseToOpenAPI(spec);
        ApiSpecification apiSpecification = OpenAPIToApiSpecificationConverter.convert(openAPI);

        apiSpecification.setFormats(extractFormatsFromOpenAPI(openAPI));

        return apiSpecification;
    }
}
