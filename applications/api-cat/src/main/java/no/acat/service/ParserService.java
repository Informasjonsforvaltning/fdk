package no.acat.service;

import no.acat.spec.ParseException;
import no.acat.spec.converters.OpenApiV3JsonSpecConverter;
import no.acat.spec.converters.SwaggerJsonSpecConverter;
import no.dcat.openapi.OpenAPI;
import org.apache.commons.io.IOUtils;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URL;

import static java.nio.charset.StandardCharsets.UTF_8;

@Service
public class ParserService {
    public static String getSpecFromUrl(String apiSpecUrlString) throws IOException {
        URL apiSpecUrl;
        apiSpecUrl = new URL(apiSpecUrlString);
        return IOUtils.toString(apiSpecUrl.openStream(), UTF_8);
    }

    public OpenAPI parse(String apiSpec) throws ParseException {
        OpenAPI openAPI;
        if (OpenApiV3JsonSpecConverter.canConvert(apiSpec)) {
            openAPI = OpenApiV3JsonSpecConverter.convert(apiSpec);
        } else if (SwaggerJsonSpecConverter.canConvert(apiSpec)) {
            openAPI = SwaggerJsonSpecConverter.convert(apiSpec);
        } else {
            throw new IllegalArgumentException("Unsupported api spec format");
        }

        return openAPI;
    }
}
