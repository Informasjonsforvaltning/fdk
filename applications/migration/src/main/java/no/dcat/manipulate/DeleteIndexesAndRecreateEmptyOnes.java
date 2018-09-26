package no.dcat.manipulate;

import no.dcat.datastore.Elasticsearch;
import org.elasticsearch.action.admin.indices.delete.DeleteIndexRequest;
import org.elasticsearch.index.IndexNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

public class DeleteIndexesAndRecreateEmptyOnes {
  private static Logger logger = LoggerFactory.getLogger(DeleteIndexesAndRecreateEmptyOnes.class);

  // final String elasticUrl = "http://localhost:9200/";
  // //"http://elasticsearch-fellesdatakatalog-ppe.ose-pc.brreg.no";
  // //"http://elasticsearch-fellesdatakatalog-st2.ose-npc.brreg.no";

  public static void main(String... args) {

    if (args.length != 3) {
      logger.warn(
          "Need two arguments to identify elasticsearch: \"host1:port,host2:port\" clusterName\n\t example: \"localhost:9300\" elasticsearch");
    }

    String clusterNodes = args[0];
    String clusterName = args[1];

    deleteAndInitIndexes(clusterNodes, clusterName);
  }

  public static void deleteAndInitIndexes(String clusterNodes, String clusterName) {
    // final String elasticUrl = "http://localhost:9200/";
    // //"http://elasticsearch-fellesdatakatalog-ppe.ose-pc.brreg.no";
    // //"http://elasticsearch-fellesdatakatalog-st2.ose-npc.brreg.no";

    Elasticsearch elasticsearch = new Elasticsearch(clusterNodes, clusterName);

    if (elasticsearch.isElasticsearchRunning()) {

      if (elasticsearch.indexExists("dcat")) {
        deleteIndexInElasticsearch(elasticsearch, "dcat");
      }

      if (elasticsearch.indexExists("harvest")) {
        deleteIndexInElasticsearch(elasticsearch, "harvest");
      }

      if (!elasticsearch.indexExists("dcat")) {
        elasticsearch.createIndex("dcat");
      }

      if (!elasticsearch.indexExists("harvest")) {
        elasticsearch.createIndex("harvest");
      }
    } else {
      logger.error("Elasticsearch is not running! {}", clusterNodes);
    }
  }

  public static void deleteIndexInElasticsearch(Elasticsearch elasticsearch, String index) {
    try {
      elasticsearch.getClient().admin().indices().delete(new DeleteIndexRequest(index)).actionGet();
      elasticsearch.getClient().admin().indices().prepareRefresh().get();

    } catch (IndexNotFoundException e) {
      logger.warn("Index not found: {}", index);
    }
  }

  public static void deleteIndexRest(String elasticUrl, String index) {
    RestTemplate restTemplate = new RestTemplate();
    try {
      restTemplate.delete(elasticUrl + "/" + index);

    } catch (HttpClientErrorException e) {
      logger.warn(
          "Exception in deleting index: {} on {}. Reason {}", index, elasticUrl, e.getMessage());
    }
  }
}
