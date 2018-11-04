package no.dcat.openapi;

import io.swagger.v3.parser.OpenAPIV3Parser;
import io.swagger.v3.parser.core.models.SwaggerParseResult;
import org.springframework.beans.BeanUtils;


public class OpenApiV3Parser {
    public static OpenAPI parse(String spec) {
        SwaggerParseResult swaggerParseResult = new OpenAPIV3Parser().readContents(spec, null, null);

        if (swaggerParseResult.getOpenAPI() == null && (swaggerParseResult.getMessages().size() > 0)) {
            throw new RuntimeException("Failed to parse document. Messages: " + String.join(" ", swaggerParseResult.getMessages()));
        }
        io.swagger.v3.oas.models.OpenAPI parseResult = swaggerParseResult.getOpenAPI();
        OpenAPI result = new OpenAPI();
        BeanUtils.copyProperties(parseResult, result);
        return result;
    }
}
