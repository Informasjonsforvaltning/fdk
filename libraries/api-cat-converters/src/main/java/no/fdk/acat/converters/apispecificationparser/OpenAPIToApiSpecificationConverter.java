package no.fdk.acat.converters.apispecificationparser;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.swagger.v3.oas.models.OpenAPI;
import no.fdk.acat.common.model.apispecification.ApiSpecification;

public class OpenAPIToApiSpecificationConverter {
    public static ApiSpecification convert(OpenAPI openAPI) throws ParseException {
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

        ApiSpecification apiSpecification;

        try {
            String json = objectMapper.writeValueAsString(openAPI);
            apiSpecification = objectMapper.readValue(json, ApiSpecification.class);
        } catch (Throwable e) {
            throw new ParseException("Error converting OpenAPI to ApiSpecification: " + e.getMessage());
        }

        return apiSpecification;
    }
}
