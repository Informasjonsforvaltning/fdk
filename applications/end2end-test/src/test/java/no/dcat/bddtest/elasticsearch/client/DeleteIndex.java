package no.dcat.bddtest.elasticsearch.client;


import no.dcat.datastore.Elasticsearch;
import org.elasticsearch.action.admin.indices.delete.DeleteIndexRequest;
import org.elasticsearch.index.IndexNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Class for deleting index in Elasticsearch.
 */
public class DeleteIndex {
  private final Logger logger = LoggerFactory.getLogger(DeleteIndex.class);

  private final String clusterNodes;
  private final String clusterName = "elasticsearch";

  public DeleteIndex(String clusterNodes) {
    this.clusterNodes = clusterNodes;
  }

  public void deleteIndex(String index) {
    try (Elasticsearch elasticsearch = new Elasticsearch(clusterNodes, clusterName)) {
      logger.info("Deleting indexing {}", index);
      deleteIndexInElasticsearch(elasticsearch, index);
    } catch (Exception e) {
      logger.error("Exception occurred while deleting index: {}", e.getMessage());
      throw e;
    }
  }

  private void deleteIndexInElasticsearch(Elasticsearch elasticsearch, String index) {
    try {
      elasticsearch.getClient().admin().indices().delete(new DeleteIndexRequest(index)).actionGet();
      elasticsearch.getClient().admin().indices().prepareRefresh().get();

    } catch (IndexNotFoundException e) {
      logger.info("Index not found: {}", index);
    }
  }
}
