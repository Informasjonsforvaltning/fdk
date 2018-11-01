package no.acat.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.swagger.v3.oas.models.OpenAPI;
import no.acat.spec.ParseException;
import no.acat.spec.converters.OpenApiV3JsonSpecConverter;
import no.acat.spec.converters.SwaggerJsonSpecConverter;
import org.apache.commons.io.IOUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URL;

import static java.nio.charset.StandardCharsets.UTF_8;


@Service
public class ParserService {
    private ObjectMapper mapper;

    @Autowired
    public ParserService(ObjectMapper mapper) {
        this.mapper = mapper;
    }

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

        // try deserialize to verify
        try {
            // todo there is something wrong with the converter and openApi model implementation
            // in some case the serialized version does not unserialize
            String json = this.mapper.writeValueAsString(openAPI);
            this.mapper.readValue(json, OpenAPI.class);
        } catch (IOException e) {
            throw new ParseException("Error verifying OpenAPI deserialization:" + e.getMessage());
        }

        return openAPI;
    }
}
