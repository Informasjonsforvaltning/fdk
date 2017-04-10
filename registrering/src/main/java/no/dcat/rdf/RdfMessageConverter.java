package no.dcat.rdf;

import no.dcat.model.Catalog;
import no.dcat.model.Dataset;
import no.dcat.service.DatasetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpInputMessage;
import org.springframework.http.HttpOutputMessage;
import org.springframework.http.MediaType;
import org.springframework.http.converter.AbstractHttpMessageConverter;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.http.converter.HttpMessageNotWritableException;
import org.springframework.http.converter.StringHttpMessageConverter;

import java.io.IOException;
import java.nio.charset.Charset;
import java.util.List;

/**
 * Created by dask on 10.04.2017.
 */
public class RdfMessageConverter extends AbstractHttpMessageConverter<Object> {


    public RdfMessageConverter() {
        super (
                new MediaType("text", "turtle", Charset.forName("UTF-8")),
                new MediaType("application", "rdf+xml", Charset.forName("UTF-8")),
                new MediaType("application", "ld+json", Charset.forName("UTF-8"))
        );
    }

    @Override
    protected Object readInternal(Class<?> aClass, HttpInputMessage httpInputMessage) throws IOException, HttpMessageNotReadableException {
        return null;
    }

    @Override
    protected boolean supports(Class<?> aClass) {
        return true;
    }

    @Override
    protected void writeInternal(Object o, HttpOutputMessage outputMessage) throws IOException, HttpMessageNotWritableException {
        if (o instanceof Catalog) {
            Catalog catalog = (Catalog) o;

            MediaType media = outputMessage.getHeaders().getContentType();
            String format = "TURTLE";
            if (media.getType().equals("application")) {
                if (media.getSubtype().equals("rdf+xml")) {
                    format = "RDF/XML";
                } else if (media.getSubtype().equals("ld+json")) {
                    format = "JSONLD";
                }
            }

            outputMessage.getBody().write(DcatBuilder.transform(catalog, format).getBytes());
        }
    }
}
