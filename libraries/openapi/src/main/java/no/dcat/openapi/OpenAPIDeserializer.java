package no.dcat.openapi;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.deser.std.StdDeserializer;

import java.io.IOException;

public class OpenAPIDeserializer extends StdDeserializer<OpenAPI> {
    public OpenAPIDeserializer() {
        this(null);
    }

    public OpenAPIDeserializer(Class<?> vc) {
        super(vc);
    }

    @Override
    public OpenAPI deserialize(
        JsonParser jsonparser, DeserializationContext context)
        throws IOException {

        String text = jsonparser.readValueAsTree().toString();
        return OpenApiV3Parser.parse(text);
    }
}
