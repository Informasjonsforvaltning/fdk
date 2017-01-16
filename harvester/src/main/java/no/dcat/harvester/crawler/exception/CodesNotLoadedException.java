package no.dcat.harvester.crawler.exception;

/**
 * Exception-class for denoting that the code hasn't been loaded into Elasticsearch.
 */
public class CodesNotLoadedException extends RuntimeException {
    public CodesNotLoadedException(String message) {
        super(message);
    }
}
