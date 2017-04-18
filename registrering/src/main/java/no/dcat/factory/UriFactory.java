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

    public static String createUri(Catalog catalog) {
        return catalogUriPrefix + "/catalogs/" + catalog.getId();
    }

    public static String createUri(Dataset dataset, Catalog parentCatalog) {
        return parentCatalog.getUri() + "/datasets/" + dataset.getUri();
    }

    public static String createUri(Contact contact, Catalog parentCatalog) {
        return parentCatalog.getUri() + "/contact/" + contact.getId();
    }

    public static String createUri(Distribution distribution, Dataset parentDataset) {
        return parentDataset.getUri() + "/distribution/" + distribution.getId();
    }

    public static String createUri(Publisher publisher, Catalog parentCatalog) {
        return parentCatalog.getUri() + "/publisher/" + publisher.getId();
    }


}
