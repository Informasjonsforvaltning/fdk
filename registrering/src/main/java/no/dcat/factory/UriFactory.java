package no.dcat.factory;

import no.dcat.model.Catalog;
import no.dcat.model.Contact;
import no.dcat.model.Dataset;
import no.dcat.model.Distribution;
import no.dcat.model.Publisher;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/**
 * Created by dask on 18.04.2017.
 */
@Component
public class UriFactory {

    @Value("${spring.application.catalogUriPrefix}")
    public void setCatalogUriPrefix(String uri) {
        catalogUriPrefix = uri;
    }

    private static String catalogUriPrefix ;




}
