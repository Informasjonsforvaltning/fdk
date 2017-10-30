package no.difi.dcat.datastore.domain.dcat;

import no.dcat.shared.Catalog;
import no.difi.dcat.datastore.domain.dcat.builders.DcatBuilder;
import org.springframework.http.HttpInputMessage;
import org.springframework.http.HttpOutputMessage;
import org.springframework.http.MediaType;
import org.springframework.http.converter.AbstractHttpMessageConverter;
import org.springframework.http.converter.HttpMessageNotReadableException;

import java.io.IOException;
import java.nio.charset.Charset;

/**
 * Created by dask on 10.04.2017.
 */
public class RdfMessageConverter extends AbstractHttpMessageConverter<Object> {

    private static final Charset charset = Charset.forName("UTF-8");
    public static final String APPLICATION = "application";

    public RdfMessageConverter() {
        super (
                new MediaType("text", "turtle", charset),
                new MediaType(APPLICATION, "rdf+xml", charset),
                new MediaType(APPLICATION, "ld+json", charset)
        );
    }

    @Override
    protected Object readInternal(Class<?> aClass, HttpInputMessage httpInputMessage)
            throws IOException, HttpMessageNotReadableException {
        return null;
    }

    @Override
    protected boolean supports(Class<?> aClass) {
        return true;
    }

    @Override
    protected void writeInternal(Object o, HttpOutputMessage outputMessage) throws IOException {
        if (o instanceof Catalog) {
            Catalog catalog = (Catalog) o;

            MediaType media = outputMessage.getHeaders().getContentType();
            String format = "TURTLE";
            if (APPLICATION.equals(media.getType())) {
                if ("rdf+xml".equals(media.getSubtype())) {
                    format = "RDF/XML";
                } else if ("ld+json".equals(media.getSubtype())) {
                    format = "JSONLD";
                }
            }

            outputMessage.getBody().write(DcatBuilder.transform(catalog, format).getBytes());
        }
    }
}
