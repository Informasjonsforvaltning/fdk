package no.dcat.harvester.crawler.exception;

/**
 * Exception-class for denoting that data-themes hasn't been loaded into Elasticsearch.
 */
public class DataThemesNotLoadedException extends RuntimeException {
    public DataThemesNotLoadedException(String message) {
        super(message);
    }
}
