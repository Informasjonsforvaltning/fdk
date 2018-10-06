package no.acat.spec;


import com.fasterxml.jackson.databind.ObjectMapper;
import io.swagger.v3.oas.models.OpenAPI;
import no.acat.config.Utils;
import no.acat.spec.converters.OpenApiV3JsonSpecConverter;
import no.acat.spec.converters.SwaggerJsonSpecConverter;
import org.apache.commons.io.IOUtils;

import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;

import static java.nio.charset.StandardCharsets.UTF_8;

public class Parser {
    private static final ObjectMapper mapper = Utils.jsonMapper();

    public static OpenAPI parse(String apiSpec) throws ParseException {
        OpenAPI openAPI;
        if (OpenApiV3JsonSpecConverter.canConvert(apiSpec)) {
            openAPI = OpenApiV3JsonSpecConverter.convert(apiSpec);
        } else if (SwaggerJsonSpecConverter.canConvert(apiSpec)) {
            openAPI = SwaggerJsonSpecConverter.convert(apiSpec);
        } else {
            throw new IllegalArgumentException("Unsupported api spec format");
        }

        // try deserialize to verify
        try {
            // todo there is something wrong with the converter and openApi model implementation
            // in some case the serialized version does not unserialize
            String json = mapper.writeValueAsString(openAPI);
            mapper.readValue(json, OpenAPI.class);
        } catch (IOException e) {
            throw new ParseException("Error verifying OpenAPI deserialization");
        }

        return openAPI;
    }

    public static String getSpecFromUrl(String apiSpecUrlString) throws IllegalArgumentException {

        try {
            URL apiSpecUrl;
            apiSpecUrl = new URL(apiSpecUrlString);
            return IOUtils.toString(apiSpecUrl.openStream(), UTF_8);
        } catch (MalformedURLException e) {
            throw new IllegalArgumentException("Invalid api spec url: " + apiSpecUrlString);
        } catch (IOException e) {
            throw new IllegalArgumentException("Error downloading api spec from url: " + apiSpecUrlString);
        }

    }
}
